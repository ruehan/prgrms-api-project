import React, { useState, useEffect } from 'react'
import axios from 'axios'

interface Performance {
  mt20id: string
  prfnm: string
  prfpdfrom: string
  prfpdto: string
  fcltynm: string
  poster: string
}

const MainBanner: React.FC = () => {
  const [performances, setPerformances] = useState<Performance[]>([])
  const [currentPerformance, setCurrentPerformance] = useState(0)

  useEffect(() => {
    const fetchPerformances = async () => {
      try {
        const today = new Date().toISOString().split('T')[0].replace(/-/g, '')
        const response = await axios.get(
          `https://ruehan-kopis.org/performances?stdate=${today}&eddate=${today}&cpage=1&rows=5`
        )
        setPerformances(response.data)
      } catch (error) {
        console.error('Error fetching performances:', error)
      }
    }

    fetchPerformances()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPerformance((prev) => (prev + 1) % performances.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [performances.length])

  return (
    <div className="relative h-[500px] overflow-hidden">
      {performances.map((performance, index) => (
        <div
          key={performance.mt20id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentPerformance ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
          <img
            src={performance.poster}
            alt={performance.prfnm}
            className="h-full w-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <h2 className="mb-2 text-4xl font-bold">{performance.prfnm}</h2>
            <p className="mb-1 text-xl">{performance.fcltynm}</p>
            <p className="text-lg">
              {performance.prfpdfrom} - {performance.prfpdto}
            </p>
          </div>
        </div>
      ))}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 transform space-x-2">
        {performances.map((_, index) => (
          <button
            key={index}
            className={`h-3 w-3 rounded-full transition-colors ${
              index === currentPerformance ? 'bg-white' : 'bg-gray-400'
            }`}
            onClick={() => setCurrentPerformance(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default MainBanner
