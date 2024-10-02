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

const UpcomingPerformances: React.FC = () => {
  const [performances, setPerformances] = useState<Performance[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPerformances = async () => {
      try {
        const response = await axios.get<Performance[]>(
          'https://ruehan-kopis.org/upcoming-performances'
        )

        console.log(response.data)
        const upcomingPerformances = response.data
          .filter((perf: Performance) => new Date(perf.prfpdfrom.replace(/\./g, '-')) > new Date())
          .sort(
            (a: Performance, b: Performance) =>
              new Date(a.prfpdfrom.replace(/\./g, '-')).getTime() -
              new Date(b.prfpdfrom.replace(/\./g, '-')).getTime()
          )
          .slice(0, 4)
        setPerformances(upcomingPerformances)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching performances:', error)
        setLoading(false)
      }
    }

    fetchPerformances()
  }, [])

  const getDaysUntilStart = (startDate: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const start = new Date(startDate.replace(/\./g, '-'))
    start.setHours(0, 0, 0, 0)
    const diffTime = start.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const PerformanceSkeleton = () => (
    <div className="w-full max-w-[300px] transform overflow-hidden rounded-lg bg-white shadow-lg">
      <div className="relative">
        <div className="h-48 w-full bg-gray-300"></div>
        <div className="absolute right-0 top-0 h-6 w-24 rounded-bl-lg bg-gray-300"></div>
      </div>
      <div className="p-4">
        <div className="mb-2 h-6 w-3/4 rounded bg-gray-300"></div>
        <div className="mb-1 h-4 w-1/2 rounded bg-gray-300"></div>
        <div className="mb-4 h-4 w-2/3 rounded bg-gray-300"></div>
        <div className="h-10 w-full rounded bg-gray-300"></div>
      </div>
    </div>
  )

  return (
    <section className="my-12 w-full max-w-[1440px] px-4 py-8">
      <div className="container mx-auto">
        <h2 className="mb-4 text-center text-2xl font-bold md:text-3xl lg:text-[40px]">
          곧 시작하는 공연
        </h2>
        <div className="mt-[60px] grid grid-cols-1 justify-items-center gap-6 md:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            <>
              <PerformanceSkeleton />
              <PerformanceSkeleton />
              <PerformanceSkeleton />
              <PerformanceSkeleton />
            </>
          ) : performances.length === 0 ? (
            <p className="col-span-full text-center text-gray-600">현재 예정된 공연이 없습니다.</p>
          ) : (
            performances.map((performance) => {
              const daysUntilStart = getDaysUntilStart(performance.prfpdfrom)
              return (
                <div
                  key={performance.mt20id}
                  className="w-full max-w-[300px] transform overflow-hidden rounded-lg bg-white shadow-lg transition duration-300 hover:scale-105"
                >
                  <div className="relative">
                    <img
                      src={performance.poster}
                      alt={performance.prfnm}
                      className="h-48 w-full object-cover"
                    />
                    <div className="absolute right-0 top-0 rounded-bl-lg bg-yellow-500 px-3 py-1 text-white">
                      {daysUntilStart === 0 ? '오늘 시작' : `${daysUntilStart}일 후 시작`}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="mb-2 truncate text-lg font-bold">{performance.prfnm}</h3>
                    <p className="mb-1 text-sm text-gray-600">{performance.fcltynm}</p>
                    <p className="mb-4 text-sm text-gray-600">
                      {performance.prfpdfrom} - {performance.prfpdto}
                    </p>
                    <a
                      href={`https://tickets.interpark.com/search?keyword=${encodeURIComponent(performance.prfnm)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full rounded bg-purple-500 px-4 py-2 text-center font-bold text-white transition duration-300 hover:bg-purple-600"
                    >
                      예매하기
                    </a>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </section>
  )
}

export default UpcomingPerformances
