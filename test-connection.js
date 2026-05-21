import fs from 'fs';
import pg from 'pg';

const env = fs.readFileSync('.env', 'utf8');
const base = env.match(/DATABASE_URL=(.+)/)[1].trim();
const u = new URL(base);
const pwd = u.password;
const ref = 'lwivexffwwlxcmsuvsce';

const hosts = [
  'db.lwivexffwwlxcmsuvsce.supabase.co',
  'aws-0-us-east-1.pooler.supabase.com',
  'aws-1-us-east-1.pooler.supabase.com',
  'aws-0-us-east-2.pooler.supabase.com',
];
const ports = ['5432', '6543'];
const users = [`postgres.${ref}`, 'postgres'];

for (const host of hosts) {
  for (const port of ports) {
    for (const user of users) {
      const url = `postgres://${encodeURIComponent(user)}:${encodeURIComponent(pwd)}@${host}:${port}/postgres`;
      const client = new pg.Client({
        connectionString: url,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 8000,
      });
      try {
        await client.connect();
        console.log('OK', host, port, user);
        await client.end();
        process.exit(0);
      } catch (err) {
        console.log('FAIL', host, port, user, '-', err.message);
      }
    }
  }
}

process.exit(1);
