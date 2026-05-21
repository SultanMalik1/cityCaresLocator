import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const { Client } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BACKUP_FILE = path.join(
  __dirname,
  'db_cluster-12-09-2025@07-36-22.backup'
);
const COPY_MARKER =
  'COPY public.organizations (name, cityname, oneliner, fivebasics, emoji, date, notes, "position", address, website, number, id, propublica_url, guidestar_url) FROM stdin;';

const COLUMNS = [
  'name',
  'cityname',
  'oneliner',
  'fivebasics',
  'emoji',
  'date',
  'notes',
  'position',
  'address',
  'website',
  'number',
  'id',
  'propublica_url',
  'guidestar_url',
];

const EXPECTED_ROW_COUNT = 78;

function loadDatabaseUrl() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL.trim();
  }

  const envPath = path.join(__dirname, '.env');
  const envText = fs.readFileSync(envPath, 'utf8').replace(/^\uFEFF/, '');
  for (const line of envText.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    if (trimmed.startsWith('DATABASE_URL=')) {
      return trimmed.slice('DATABASE_URL='.length).trim();
    }
  }
  throw new Error('DATABASE_URL not found in .env');
}

function parseCopyValue(raw) {
  if (raw === '\\N') return null;
  return raw;
}

/**
 * Split a PostgreSQL COPY text row on tabs, respecting backslash escapes.
 */
function splitCopyRow(line) {
  const fields = [];
  let current = '';
  let i = 0;

  while (i < line.length) {
    const ch = line[i];

    if (ch === '\t') {
      fields.push(current);
      current = '';
      i += 1;
      continue;
    }

    if (ch === '\\' && i + 1 < line.length) {
      const next = line[i + 1];
      if (next === 't') {
        current += '\t';
        i += 2;
        continue;
      }
      if (next === 'n') {
        current += '\n';
        i += 2;
        continue;
      }
      if (next === 'r') {
        current += '\r';
        i += 2;
        continue;
      }
      if (next === '\\') {
        current += '\\';
        i += 2;
        continue;
      }
      if (next === 'N') {
        current += '\\N';
        i += 2;
        continue;
      }
    }

    current += ch;
    i += 1;
  }

  fields.push(current);
  return fields;
}

function parseOrganizationsFromBackup() {
  const rows = [];
  let inCopyBlock = false;
  let finished = false;

  const stream = fs.createReadStream(BACKUP_FILE, { encoding: 'utf8' });
  let buffer = '';

  return new Promise((resolve, reject) => {
    const done = (value) => {
      if (finished) return;
      finished = true;
      resolve(value);
    };
    const fail = (err) => {
      if (finished) return;
      finished = true;
      reject(err);
    };

    stream.on('data', (chunk) => {
      buffer += chunk;
      let newlineIndex = buffer.indexOf('\n');

      while (newlineIndex !== -1) {
        const line = buffer.slice(0, newlineIndex).replace(/\r$/, '');
        buffer = buffer.slice(newlineIndex + 1);

        if (!inCopyBlock) {
          if (line === COPY_MARKER) {
            inCopyBlock = true;
          }
        } else if (line === '\\.') {
          stream.destroy();
          done(rows);
          return;
        } else if (line.length > 0) {
          const fields = splitCopyRow(line);
          if (fields.length !== COLUMNS.length) {
            fail(
              new Error(
                `Row ${rows.length + 1}: expected ${COLUMNS.length} fields, got ${fields.length}`
              )
            );
            return;
          }

          const record = {};
          COLUMNS.forEach((col, idx) => {
            let value = parseCopyValue(fields[idx]);
            if (col === 'position' && value !== null) {
              value = JSON.parse(value);
            }
            if (col === 'id' && value !== null) {
              value = Number.parseInt(value, 10);
            }
            record[col] = value;
          });
          rows.push(record);
        }

        newlineIndex = buffer.indexOf('\n');
      }
    });

    stream.on('error', fail);
    stream.on('close', () => {
      if (finished) return;
      if (rows.length === 0) {
        fail(new Error('COPY public.organizations block not found or empty'));
      } else {
        done(rows);
      }
    });
  });
}

async function migrate() {
  if (!fs.existsSync(BACKUP_FILE)) {
    throw new Error(`Backup file not found: ${BACKUP_FILE}`);
  }

  console.log('Parsing organizations from backup...');
  const organizations = await parseOrganizationsFromBackup();

  if (organizations.length !== EXPECTED_ROW_COUNT) {
    throw new Error(
      `Expected ${EXPECTED_ROW_COUNT} organizations, parsed ${organizations.length}`
    );
  }

  const connectionString = loadDatabaseUrl();
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();

  try {
    await client.query('BEGIN');

    await client.query('DROP TABLE IF EXISTS public.organizations CASCADE');

    await client.query(`
      CREATE SEQUENCE IF NOT EXISTS public.organizations_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;
    `);

    await client.query(`
      CREATE TABLE public.organizations (
        name text,
        cityname text,
        oneliner text,
        fivebasics text,
        emoji text,
        date text,
        notes text,
        "position" jsonb,
        address text,
        website text,
        number text,
        id integer NOT NULL DEFAULT nextval('public.organizations_id_seq'::regclass),
        propublica_url character varying(255),
        guidestar_url character varying(255),
        CONSTRAINT organizations_pkey PRIMARY KEY (id)
      );
    `);

    await client.query(`
      ALTER SEQUENCE public.organizations_id_seq OWNED BY public.organizations.id;
    `);

    const insertSql = `
      INSERT INTO public.organizations (
        name, cityname, oneliner, fivebasics, emoji, date, notes,
        "position", address, website, number, id, propublica_url, guidestar_url
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8::jsonb, $9, $10, $11, $12, $13, $14
      )
    `;

    for (const row of organizations) {
      const positionJson =
        row.position === null ? null : JSON.stringify(row.position);

      await client.query(insertSql, [
        row.name,
        row.cityname,
        row.oneliner,
        row.fivebasics,
        row.emoji,
        row.date,
        row.notes,
        positionJson,
        row.address,
        row.website,
        row.number,
        row.id,
        row.propublica_url,
        row.guidestar_url,
      ]);
    }

    await client.query(
      "SELECT pg_catalog.setval('public.organizations_id_seq', 79, true)"
    );

    const { rows: countRows } = await client.query(
      'SELECT COUNT(*)::int AS count FROM public.organizations'
    );

    await client.query('COMMIT');

    const count = countRows[0].count;
    console.log(`Inserted ${count} organization rows.`);

    if (count !== EXPECTED_ROW_COUNT) {
      throw new Error(`Verification failed: expected ${EXPECTED_ROW_COUNT}, got ${count}`);
    }

    console.log('Migration complete: all 78 organizations are live in Supabase.');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    await client.end();
  }
}

migrate().catch((err) => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
