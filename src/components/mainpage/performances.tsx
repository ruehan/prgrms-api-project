import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

interface Performance {
  mt20id: string
  prfnm: string
  prfpdfrom: string
  prfpdto: string
  fcltynm: string
  poster: string
}

const BestPerformances: React.FC = () => {
  const [performances, setPerformances] = useState<Performance[]>([])

  useEffect(() => {
    const fetchPerformances = async () => {
      try {
        const today = new Date().toISOString().split('T')[0].replace(/-/g, '')
        const response = await axios.get(
          `https://ruehan-kopis.org/performances?stdate=${today}&eddate=${today}&cpage=1&rows=3`
        )
        setPerformances(response.data)
      } catch (error) {
        console.error('Error fetching performances:', error)
      }
    }

    fetchPerformances()
  }, [])

  return (
    <section className="my-8 flex max-w-[1440px] flex-col items-center">
      <h2 className="mb-4 text-center text-2xl font-bold md:text-3xl lg:text-[40px]">
        베스트 공연
      </h2>
      <div className="mt-[60px] grid grid-cols-1 gap-4 md:grid-cols-3">
        {performances.map((performance) => (
          <Link
            to={`/performance/${performance.mt20id}`}
            key={performance.mt20id}
            className="overflow-hidden rounded-lg bg-white shadow-md"
          >
            <img
              src={performance.poster}
              alt={performance.prfnm}
              className="h-[280px] w-full object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold">{performance.prfnm}</h3>
              <p className="text-sm text-gray-600">{performance.fcltynm}</p>
              <p className="text-sm text-gray-600">
                {performance.prfpdfrom} - {performance.prfpdto}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default BestPerformances
