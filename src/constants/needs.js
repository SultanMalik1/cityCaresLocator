/** Canonical need categories for chips and filtering (Phase 4). */
export const MAX_PRIMARY_NEEDS = 5
export const MAX_ONELINER_WORDS = 6
export const MIN_NOTES_WORDS = 20

export const NEEDS = [
  {
    id: "food",
    label: "Food",
    keywords: ["food", "pantry", "meals", "soup kitchen", "nutrition", "hunger"],
  },
  {
    id: "shelter",
    label: "Shelter",
    keywords: [
      "shelter",
      "housing",
      "homeless",
      "bed",
      "residence",
      "overnight",
    ],
  },
  {
    id: "jobs",
    label: "Jobs",
    keywords: [
      "jobs",
      "employment",
      "workforce",
      "career",
      "training",
      "job",
    ],
  },
  {
    id: "health",
    label: "Health",
    keywords: [
      "health",
      "medical",
      "clinic",
      "mental health",
      "healthcare",
      "hospital",
    ],
  },
  {
    id: "legal",
    label: "Legal",
    keywords: ["legal", "lawyer", "attorney", "court", "immigration"],
  },
  {
    id: "lgbtq",
    label: "LGBTQ+",
    keywords: ["lgbtq", "lgbt", "queer", "transgender", "trans", "pride"],
  },
]

const needById = new Map(NEEDS.map((need) => [need.id, need]))

export function getNeedById(id) {
  return needById.get(id)
}

export function parseNeedIds(value) {
  if (!value) return []
  return value
    .toString()
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
}

export function formatNeeds(value) {
  return parseNeedIds(value)
    .map((id) => getNeedById(id)?.label ?? id)
    .join(", ")
}
