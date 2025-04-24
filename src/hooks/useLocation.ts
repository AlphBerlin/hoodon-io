import { useState, useEffect } from 'react'

export function useLocation() {
  const [location, setLocation] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [position, setPosition] = useState<GeolocationPosition>()
  const [error, setError] = useState<string>('')

  const updateLocation = () => {
    setLoading(true)
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            setPosition(position)
            const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`)
            const data = await response.json()
            const locationString = `${data.city}, ${data.countryName}`
            setLocation(locationString)
          } catch (err) {
            setError('Could not determine location')
          } finally {
            setLoading(false)
          }
        },
        (err) => {
          setError('Location access denied')
          setLoading(false)
        }
      )
    } else {
      setError('Geolocation not supported')
      setLoading(false)
    }
  }

  useEffect(() => {
    updateLocation()
  }, [])

  return { location, loading, error, updateLocation,position }
}

