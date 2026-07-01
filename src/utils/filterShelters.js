import {
  formatPopulation,
  formatService,
  formatShelterType,
} from "../constants/shelters"

function normalize(text) {
  return (text ?? "").toString().toLowerCase().trim()
}

function shelterHaystack(shelter) {
  const populations = Array.isArray(shelter.populations_served)
    ? shelter.populations_served.map(formatPopulation).join(" ")
    : ""
  const services = Array.isArray(shelter.services_offered)
    ? shelter.services_offered.map(formatService).join(" ")
    : ""

  return [
    shelter.name,
    shelter.notes,
    shelter.intake_notes,
    shelter.address_line1,
    shelter.borough,
    shelter.zip_code,
    shelter.hours_text,
    formatShelterType(shelter.shelter_type),
    populations,
    services,
  ]
    .filter(Boolean)
    .map(normalize)
    .join(" ")
}

export function shelterMatchesSearch(shelter, query) {
  const q = normalize(query)
  if (!q) return true
  return shelterHaystack(shelter).includes(q)
}

export function shelterMatchesPopulation(shelter, populationId) {
  const list = Array.isArray(shelter.populations_served)
    ? shelter.populations_served
    : []
  return list.includes(populationId)
}

export function shelterMatchesService(shelter, serviceId) {
  const list = Array.isArray(shelter.services_offered)
    ? shelter.services_offered
    : []
  return list.includes(serviceId)
}

export function shelterMatchesType(shelter, typeId) {
  return shelter.shelter_type === typeId
}

export function shelterMatches24_7(shelter) {
  return shelter.is_24_7 === true
}

export function filterShelters(
  shelters,
  {
    search = "",
    populations = [],
    services = [],
    types = [],
    only24_7 = false,
  } = {},
) {
  const list = Array.isArray(shelters) ? shelters : []
  const selectedPopulations = Array.isArray(populations)
    ? populations.filter(Boolean)
    : []
  const selectedServices = Array.isArray(services) ? services.filter(Boolean) : []
  const selectedTypes = Array.isArray(types) ? types.filter(Boolean) : []
  const hasSearch = normalize(search).length > 0
  const hasPopulations = selectedPopulations.length > 0
  const hasServices = selectedServices.length > 0
  const hasTypes = selectedTypes.length > 0

  if (
    !hasSearch &&
    !hasPopulations &&
    !hasServices &&
    !hasTypes &&
    !only24_7
  ) {
    return list
  }

  return list.filter((shelter) => {
    if (
      hasPopulations &&
      !selectedPopulations.some((id) => shelterMatchesPopulation(shelter, id))
    ) {
      return false
    }
    if (
      hasServices &&
      !selectedServices.some((id) => shelterMatchesService(shelter, id))
    ) {
      return false
    }
    if (hasTypes && !selectedTypes.some((id) => shelterMatchesType(shelter, id))) {
      return false
    }
    if (only24_7 && !shelterMatches24_7(shelter)) {
      return false
    }
    if (hasSearch && !shelterMatchesSearch(shelter, search)) {
      return false
    }
    return true
  })
}
