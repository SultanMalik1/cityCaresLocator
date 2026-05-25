import { getNeedById, parseNeedIds } from "../constants/needs"

function normalize(text) {
  return (text ?? "").toString().toLowerCase().trim()
}

function organizationHaystack(org) {
  return [org.name, org.oneliner, org.notes, org.fivebasics, org.address, org.cityname]
    .filter(Boolean)
    .map(normalize)
    .join(" ")
}

export function organizationMatchesSearch(org, query) {
  const q = normalize(query)
  if (!q) return true
  return organizationHaystack(org).includes(q)
}

export function organizationMatchesNeed(org, needId) {
  const need = getNeedById(needId)
  if (!need) return false

  const basicsList = parseNeedIds(org.fivebasics)
  if (basicsList.includes(need.id)) return true

  const text = organizationHaystack(org)
  return need.keywords.some((keyword) => text.includes(normalize(keyword)))
}

export function filterOrganizations(organizations, { search = "", needs = [] } = {}) {
  const list = Array.isArray(organizations) ? organizations : []
  const selectedNeeds = Array.isArray(needs) ? needs.filter(Boolean) : []
  const hasSearch = normalize(search).length > 0
  const hasNeeds = selectedNeeds.length > 0

  if (!hasSearch && !hasNeeds) return list

  return list.filter((org) => {
    if (
      hasNeeds &&
      !selectedNeeds.some((needId) => organizationMatchesNeed(org, needId))
    ) {
      return false
    }
    if (hasSearch && !organizationMatchesSearch(org, search)) {
      return false
    }
    return true
  })
}
