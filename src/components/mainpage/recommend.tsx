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
  genrenm: string
}

const genres = [
  '뮤지컬',
  '연극',
  '무용',
  '서양음악(클래식)',
  '대중음악',
  '복합',
  '서커스/마술',
  '한국음악(국악)',
]

const GenreRecommendations: React.FC = () => {
  const [performances, setPerformances] = useState<{ [key: string]: Performance[] }>({})
  const [activeGenre, setActiveGenre] = useState(genres[0])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPerformances = async () => {
      setIsLoading(true)
      try {
        const today = new Date().toISOString().split('T')[0].replace(/-/g, '')
        const futureDate = new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0]
          .replace(/-/g, '')

        const genrePerformances: { [key: string]: Performance[] } = {}

        for (const genre of genres) {
          const response = await axios.get(
            `https://ruehan-kopis.org/performances?stdate=${today}&eddate=${futureDate}&shcate=${genre}&cpage=1&rows=8`
          )
          genrePerformances[genre] = response.data
        }

        setPerformances(genrePerformances)
      } catch (error) {
        console.error('Error fetching performances:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPerformances()
  }, [])

  const PerformanceSkeleton: React.FC = () => (
    <div className="w-full max-w-[300px] overflow-hidden rounded-lg bg-white shadow-md">
      <div className="h-64 w-full bg-gray-300"></div>
      <div className="p-4">
        <div className="mb-2 h-6 w-3/4 rounded bg-gray-300"></div>
        <div className="mb-1 h-4 w-1/2 rounded bg-gray-300"></div>
        <div className="h-4 w-2/3 rounded bg-gray-300"></div>
      </div>
    </div>
  )

  return (
    <section className="my-12 mt-[80px] w-full max-w-[1440px] px-4">
      <h2 className="mb-4 text-center text-2xl font-bold md:text-3xl lg:text-[40px]">
        장르별 추천 공연
      </h2>
      <div className="mb-6 mt-[60px] flex flex-wrap justify-center gap-4">
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setActiveGenre(genre)}
            className={`rounded-full px-6 py-3 text-lg font-semibold transition-colors ${
              activeGenre === genre
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, index) => (
            <PerformanceSkeleton key={index} />
          ))}
        </div>
      ) : performances[activeGenre]?.length ? (
        <div className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {performances[activeGenre].map((performance) => (
            <Link
              to={`/performance/${performance.mt20id}`}
              key={performance.mt20id}
              className="w-full max-w-[300px] overflow-hidden rounded-lg bg-white shadow-md transition-transform hover:scale-105"
            >
              <img
                src={performance.poster}
                alt={performance.prfnm}
                className="h-64 w-full object-cover"
              />
              <div className="p-4">
                <h4 className="mb-2 truncate text-lg font-bold">{performance.prfnm}</h4>
                <p className="mb-1 truncate text-sm text-gray-600">{performance.fcltynm}</p>
                <p className="text-sm text-gray-600">
                  {performance.prfpdfrom} - {performance.prfpdto}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="w-full py-12 text-center">
          <p className="text-xl text-gray-600">현재 표시할 공연 정보가 없습니다.</p>
        </div>
      )}
    </section>
  )
}

export default GenreRecommendations
