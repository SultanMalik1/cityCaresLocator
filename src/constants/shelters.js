const SHELTER_TYPE_LABELS = {
  drop_in_center: "Drop-in center",
  youth_drop_in: "Youth drop-in",
}

const POPULATION_LABELS = {
  single_adults: "Single adults",
  youth: "Youth",
  families: "Families",
  runaway_homeless_youth: "Runaway",
  lgbtq_youth: "LGBTQ+",
}

const SERVICE_LABELS = {
  meals: "Meals",
  showers: "Showers",
  laundry: "Laundry",
  case_management: "Case management",
  housing_placement: "Housing placement",
  shelter_referrals: "Shelter referrals",
}

const ACCESS_METHOD_LABELS = {
  walk_in: "Walk-in",
  appointment: "By appointment",
  referral: "Referral required",
}

export const SHELTER_POPULATION_FILTERS = [
  { id: "single_adults", label: "Single adults" },
  { id: "youth", label: "Youth" },
  { id: "families", label: "Families" },
  { id: "runaway_homeless_youth", label: "Runaway" },
  { id: "lgbtq_youth", label: "LGBTQ+" },
]

export const SHELTER_SERVICE_FILTERS = [
  { id: "meals", label: "Meals" },
  { id: "showers", label: "Showers" },
  { id: "laundry", label: "Laundry" },
  { id: "case_management", label: "Case management" },
  { id: "housing_placement", label: "Housing placement" },
  { id: "shelter_referrals", label: "Shelter referrals" },
]

export const SHELTER_TYPE_FILTERS = [
  { id: "drop_in_center", label: "Drop-in center" },
  { id: "youth_drop_in", label: "Youth drop-in" },
]

function titleCase(value) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (ch) => ch.toUpperCase())
}

export function formatShelterType(value) {
  if (!value) return ""
  return SHELTER_TYPE_LABELS[value] ?? titleCase(value)
}

export function formatPopulation(value) {
  if (!value) return ""
  return POPULATION_LABELS[value] ?? titleCase(value)
}

export function formatService(value) {
  if (!value) return ""
  return SERVICE_LABELS[value] ?? titleCase(value)
}

export function formatAccessMethod(value) {
  if (!value) return ""
  return ACCESS_METHOD_LABELS[value] ?? titleCase(value)
}

export function formatList(values, formatter) {
  const list = Array.isArray(values) ? values : []
  return list.map(formatter).filter(Boolean).join(", ")
}

export function formatShelterAddress(shelter) {
  if (!shelter?.is_address_public) {
    const borough = shelter?.borough?.trim()
    return borough
      ? `${borough} — exact address not public; contact site for location`
      : "Address not public — contact site for location"
  }

  const parts = [
    shelter.address_line1,
    shelter.borough,
    shelter.zip_code ? `NY ${shelter.zip_code}` : null,
  ].filter(Boolean)

  return parts.join(", ")
}

export function formatShelterSubtitle(shelter) {
  const typeLabel = formatShelterType(shelter.shelter_type)
  const borough = shelter.borough?.trim()
  const hours = shelter.is_24_7
    ? "Open 24 hours"
    : shelter.hours_text?.trim()

  return [typeLabel, borough, hours].filter(Boolean).join(" · ")
}
