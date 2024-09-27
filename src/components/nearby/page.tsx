import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import axios from 'axios'
import { FaTheaterMasks } from 'react-icons/fa'
import { format } from 'date-fns'

interface Facility {
  mt10id: string
  fcltynm: string
  adres: string
  la: number
  lo: number
  distance?: number
}

interface LocationInfo {
  city: string
  state: string
  country: string
}

interface Performance {
  mt20id: string
  prfnm: string
  prfpdfrom: string
  prfpdto: string
  fcltynm: string
  poster: string
  genrenm: string
  prfstate: string
  openrun: string
  area: string
}

const userSvgIcon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
  <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z" fill="#FF0000"/>
</svg>
`

const svgToBase64 = (svg: string) => {
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

const createCustomIcon = (svgString: string) => {
  return L.icon({
    iconUrl: svgToBase64(svgString),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  })
}

const userIcon = createCustomIcon(userSvgIcon)

const facilityIcon = L.icon({
  iconUrl: '/tickets.svg',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

const NearbyPerformanceFacilities: React.FC = () => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  )
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null)
  const [relatedShows, setRelatedShows] = useState<Performance[]>([])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lon = position.coords.longitude
          setUserLocation([lat, lon])
          fetchLocationInfo(lat, lon)
        },
        (error) => {
          console.error('Error getting user location:', error)
        }
      )
    } else {
      console.error('Geolocation is not supported by this browser.')
    }
  }, [])

  useEffect(() => {
    if (userLocation) {
      fetchFacilities()
    }
  }, [userLocation])

  const fetchLocationInfo = async (lat: number, lon: number) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse`,
        {
          params: {
            format: 'json',
            lat: lat,
            lon: lon,
          },
        }
      )
      const address = response.data.address
      console.log(address)
      setLocationInfo({
        city: address.city || address.town || address.village || '',
        state: address.state || '',
        country: address.country || '',
      })
    } catch (error) {
      console.error('Error fetching location info:', error)
    }
  }

  const fetchFacilities = async () => {
    try {
      const response = await axios.get(
        'https://ruehan-kopis.org/performance-facilities',
        {
          params: {
            signgucode: '',
            signgucodesub: '',
            cpage: 1,
            rows: 2000,
          },
        }
      )
      if (userLocation) {
        const facilitiesWithDistance = response.data.map(
          (facility: Facility) => ({
            ...facility,
            distance: calculateDistance(
              userLocation[0],
              userLocation[1],
              facility.la,
              facility.lo
            ),
          })
        )
        const sortedFacilities = facilitiesWithDistance.sort(
          (a: Facility, b: Facility) => a.distance! - b.distance!
        )
        setFacilities(sortedFacilities.slice(0, 10))
      }
    } catch (error) {
      console.error('Error fetching facilities:', error)
    }
  }

  const fetchRelatedShow = async (facilityName: string) => {
    try {
      const today = format(new Date(), 'yyyyMMdd')
      const response = await axios.get<Performance[]>(
        'https://ruehan-kopis.org/performances',
        {
          params: {
            stdate: today,
            eddate: today,
            shprfnmfct: facilityName,
            cpage: 1,
            rows: 2,
          },
        }
      )
      if (response.data.length > 0) {
        setRelatedShows((prev) => [...prev, response.data[0]]) // 배열에 추가
      }
    } catch (error) {
      console.error('Error fetching related show:', error)
    }
  }

  useEffect(() => {
    facilities.forEach((facility) => {
      fetchRelatedShow(facility.fcltynm)
    })
  }, [facilities])

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  if (!userLocation || !locationInfo) {
    return <div>Loading user location...</div>
  }

  return (
    // mt-[80px] w-full px-4 sm:px-6 md:mt-[120px] lg:mt-[162px] lg:px-8
    <div className="mx-auto mt-[80px] max-w-[1440px] lg:px-8">
      <h1 className="mb-4 text-center text-2xl font-bold md:text-3xl lg:text-[40px]">
        주변 공연장 안내
      </h1>
      <div className="mb-4 h-[400px]">
        <MapContainer
          center={userLocation}
          zoom={13}
          style={{ height: '100%', width: '100%', zIndex: '0' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={userLocation} icon={userIcon}>
            <Popup>현재 위치</Popup>
          </Marker>
          {facilities.map((facility) => (
            <Marker
              key={facility.mt10id}
              position={[facility.la, facility.lo]}
              icon={facilityIcon}
            >
              <Popup>{facility.fcltynm}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <div>
        <h2 className="mb-2 text-xl font-semibold">
          주변 공연장 목록 (가까운 순 10개)
        </h2>
        <div className="grid w-full grid-cols-2">
          {facilities.map((facility) => (
            <div
              key={facility.mt10id}
              className="mb-2 flex items-center justify-start"
            >
              <div className="mr-2 flex h-10 w-10 items-center justify-center rounded-full bg-purple-500">
                <FaTheaterMasks className="text-xl text-white" />
              </div>
              <div>
                <h3 className="font-semibold">{facility.fcltynm}</h3>
                <p className="text-sm text-gray-600">{facility.adres}</p>
                <p className="text-xs text-gray-500">
                  거리: {facility.distance?.toFixed(2)} km
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="w-full">
          <h1 className="mb-4 mt-[80px] text-center text-2xl font-bold md:text-3xl lg:text-[40px]">
            관련 공연
          </h1>
          <div className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {relatedShows.map((performance) => (
              <div
                key={performance.mt20id}
                className="flex flex-col overflow-hidden rounded-lg bg-white shadow-md"
              >
                <div className="h-[300px] overflow-hidden">
                  <img
                    src={performance.poster}
                    alt={performance.prfnm}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-grow flex-col p-4">
                  <h2 className="mb-2 line-clamp-2 text-sm font-bold sm:text-base">
                    {performance.prfnm}
                  </h2>
                  <p className="mb-1 line-clamp-1 text-sm">
                    {performance.fcltynm}
                  </p>
                  <p className="mt-auto text-xs">{`${format(new Date(performance.prfpdfrom), 'yyyy.MM.dd')} - ${format(new Date(performance.prfpdto), 'yyyy.MM.dd')}`}</p>
                  <p className="mt-1 text-xs">
                    {performance.prfstate || '상태 미정'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NearbyPerformanceFacilities
