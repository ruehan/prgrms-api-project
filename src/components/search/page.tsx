import React, { useState, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import axios from 'axios'
import { format } from 'date-fns'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

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

interface FilterState {
  genres: string[]
  status: string
  date: Date | null
  regions: string[]
}

const fetchPerformances = async (prfnm: string) => {
  if (!prfnm) return []
  const { data } = await axios.get<Performance[]>(
    'https://ruehan-kopis.org/performances',
    {
      params: {
        stdate: format(new Date(), 'yyyyMMdd'),
        eddate: format(
          new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
          'yyyyMMdd'
        ),
        shprfnm: prfnm,
        cpage: 1,
        rows: 100,
      },
    }
  )
  return data
}

const SearchPage: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const searchParams = new URLSearchParams(location.search)
  const query = searchParams.get('q') || ''

  const [selectedFilters, setSelectedFilters] = useState<FilterState>({
    genres: [],
    status: '전체',
    date: null,
    regions: [],
  })

  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    genres: [],
    status: '전체',
    date: null,
    regions: [],
  })

  const {
    data: performances,
    isLoading,
    error,
  } = useQuery(['performances', query], () => fetchPerformances(query), {
    enabled: !!query,
  })

  const genres = useMemo(
    () => Array.from(new Set(performances?.map((p) => p.genrenm) || [])),
    [performances]
  )
  const regions = useMemo(
    () =>
      Array.from(new Set(performances?.map((p) => p.area.split(' ')[0]) || [])),
    [performances]
  )

  const filteredPerformances = useMemo(() => {
    if (!performances) return []
    return performances.filter((performance) => {
      const genreMatch =
        appliedFilters.genres.length === 0 ||
        appliedFilters.genres.includes(performance.genrenm)
      const statusMatch =
        appliedFilters.status === '전체' ||
        performance.prfstate === appliedFilters.status
      const regionMatch =
        appliedFilters.regions.length === 0 ||
        appliedFilters.regions.includes(performance.area.split(' ')[0])
      const dateMatch =
        !appliedFilters.date ||
        (new Date(performance.prfpdfrom) <= appliedFilters.date &&
          new Date(performance.prfpdto) >= appliedFilters.date)
      return genreMatch && statusMatch && regionMatch && dateMatch
    })
  }, [performances, appliedFilters])

  const potentialResults = useMemo(() => {
    if (!performances) return []
    return performances.filter((performance) => {
      const genreMatch =
        selectedFilters.genres.length === 0 ||
        selectedFilters.genres.includes(performance.genrenm)
      const statusMatch =
        selectedFilters.status === '전체' ||
        performance.prfstate === selectedFilters.status
      const regionMatch =
        selectedFilters.regions.length === 0 ||
        selectedFilters.regions.includes(performance.area.split(' ')[0])
      const dateMatch =
        !selectedFilters.date ||
        (new Date(performance.prfpdfrom) <= selectedFilters.date &&
          new Date(performance.prfpdto) >= selectedFilters.date)
      return genreMatch && statusMatch && regionMatch && dateMatch
    })
  }, [performances, selectedFilters])

  const handleSearch = () => {
    setAppliedFilters(selectedFilters)
    const params = new URLSearchParams(location.search)
    params.set('genres', selectedFilters.genres.join(','))
    params.set('status', selectedFilters.status)
    params.set('regions', selectedFilters.regions.join(','))
    params.set(
      'date',
      selectedFilters.date ? format(selectedFilters.date, 'yyyy-MM-dd') : ''
    )
    navigate(`${location.pathname}?${params.toString()}`)
  }

  if (isLoading) return <div className="mt-10 text-center">로딩 중...</div>
  if (error)
    return (
      <div className="mt-10 text-center text-red-500">에러가 발생했습니다.</div>
    )

  return (
    <div className="mt-[80px] w-full px-4 sm:px-6 md:mt-[120px] lg:mt-[162px] lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        <h1 className="mb-4 text-center text-2xl font-bold md:text-3xl lg:text-[40px]">
          '{query}' 검색 결과
        </h1>
        <section className="flex flex-col gap-[20px] lg:flex-row">
          <div className="rounded-lg bg-white p-4 shadow-md lg:w-[260px]">
            <h2 className="mb-4 text-lg font-bold">필터</h2>

            {/* 장르 필터 */}
            <div className="mb-4">
              <h3 className="mb-2 font-semibold">장르</h3>
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => {
                      setSelectedFilters((prev) => ({
                        ...prev,
                        genres: prev.genres.includes(genre)
                          ? prev.genres.filter((g) => g !== genre)
                          : [...prev.genres, genre],
                      }))
                    }}
                    className={`rounded-full px-3 py-1 text-sm ${
                      selectedFilters.genres.includes(genre)
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* 공연상태 필터 */}
            <div className="mb-4">
              <h3 className="mb-2 font-semibold">공연상태</h3>
              <div className="flex flex-wrap gap-2">
                {['전체', '공연중', '공연예정', '공연종료'].map((status) => (
                  <button
                    key={status}
                    onClick={() =>
                      setSelectedFilters((prev) => ({ ...prev, status }))
                    }
                    className={`rounded-full px-3 py-1 text-sm ${
                      selectedFilters.status === status
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* 날짜 필터 */}
            <div className="mb-4">
              <h3 className="mb-2 font-semibold">날짜</h3>
              <DatePicker
                selected={selectedFilters.date}
                onChange={(date: Date | null) => {
                  setSelectedFilters((prev) => ({ ...prev, date: date }))
                }}
                dateFormat="yyyy.MM.dd"
                className="w-full rounded border p-2"
                inline
              />
            </div>

            {/* 지역 필터 */}
            <div className="mb-4">
              <h3 className="mb-2 font-semibold">지역</h3>
              <div className="flex flex-wrap gap-2">
                {regions.map((region) => (
                  <button
                    key={region}
                    onClick={() => {
                      setSelectedFilters((prev) => ({
                        ...prev,
                        regions: prev.regions.includes(region)
                          ? prev.regions.filter((r) => r !== region)
                          : [...prev.regions, region],
                      }))
                    }}
                    className={`rounded-full px-3 py-1 text-sm ${
                      selectedFilters.regions.includes(region)
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>

            {/* 검색 버튼 */}
            <button
              onClick={handleSearch}
              className="mt-4 w-full rounded-lg bg-purple-500 py-2 text-white"
            >
              {potentialResults.length}개 검색
            </button>
          </div>

          {/* 검색 결과 */}
          <div className="w-full">
            <div className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPerformances.map((performance) => (
                <div
                  key={performance.mt20id}
                  className="flex flex-col overflow-hidden rounded-lg bg-white shadow-md"
                >
                  <div className="h-48 overflow-hidden">
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
        </section>
      </div>
    </div>
  )
}

export default SearchPage
