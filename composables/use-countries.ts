interface Country {
  name: {
    common: string
  }
  cca2: string
  flags: {
    svg: string
  }
}

export const useCountries = async () => {
  const { data, error } = await useFetch('https://restcountries.com/v3.1/all', {
    key: 'countries-data', // Ensures caching
    server: true,
    lazy: true,
    params: {
      fields: 'name,cca2,flags,population,region'
    },
    transform: (countries: Country[]) => {
      return countries.map((c: Country) => ({
        name: c.name.common,
        code: c.cca2,
        flag: c.flags?.svg || '',
      })).sort((a, b) => a.name.localeCompare(b.name))
    }
  })

  if (error.value) {
    console.error('Failed to fetch countries:', error.value)
  }

  return data
}
