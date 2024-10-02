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

  useEffect(() => {
    const fetchPerformances = async () => {
      try {
        // FastAPI의 /upcoming-performances 엔드포인트로 변경
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
          .slice(0, 4) // 최대 4개까지만 표시
        setPerformances(upcomingPerformances)
      } catch (error) {
        console.error('Error fetching performances:', error)
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

  if (performances.length === 0) {
    return (
      <section className="my-12 bg-gradient-to-r from-purple-100 to-pink-100 py-8">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold text-purple-800">곧 시작하는 공연</h2>
          <p className="text-center text-gray-600">현재 예정된 공연이 없습니다.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="my-12 flex max-w-[1440px] flex-col items-center py-8">
      <div className="container mx-auto px-4">
        <h2 className="mb-4 text-center text-2xl font-bold md:text-3xl lg:text-[40px]">
          곧 시작하는 공연
        </h2>
        <div className="mt-[60px] grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {performances.map((performance) => {
            const daysUntilStart = getDaysUntilStart(performance.prfpdfrom)
            return (
              <div
                key={performance.mt20id}
                className="transform overflow-hidden rounded-lg bg-white shadow-lg transition duration-300 hover:scale-105"
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
          })}
        </div>
      </div>
    </section>
  )
}

export default UpcomingPerformances
