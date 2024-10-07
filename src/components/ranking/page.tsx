import React, { useState } from 'react'
import { useQuery } from 'react-query'
import axios from 'axios'
import { Link } from 'react-router-dom'
import BoxOfficeSkeleton from './skeleton'

interface BoxOfficeItem {
  mt20id: string
  prfnm: string
  prfpd: string
  prfpdfrom: string
  prfpdto: string
  fcltynm: string
  poster: string
  genrenm: string
  rnum: number
}

interface FilterOptions {
  ststype: 'day' | 'week' | 'month'
  date: string
  catecode?: string
  area?: string
}

const GENRE_CODE_MAP = {
  AAAA: '연극',
  BBBC: '무용(서양/한국무용)',
  BBBE: '대중무용',
  CCCA: '서양음악(클래식)',
  CCCC: '한국음악(국악)',
  CCCD: '대중음악',
  EEEA: '복합',
  EEEB: '서커스/마술',
  GGGA: '뮤지컬',
}

const AREA_CODE_MAP = {
  '11': '서울',
  '26': '부산',
  '27': '대구',
  '28': '인천',
  '29': '광주',
  '30': '대전',
  '31': '울산',
  '36': '세종',
  '41': '경기',
  '51': '강원',
  '43': '충청북도',
  '44': '충청남도',
  '45': '전라북도',
  '46': '전라남도',
  '47': '경상북도',
  '48': '경상남도',
  '50': '제주',
}

const fetchBoxOffice = async (options: FilterOptions) => {
  const { data } = await axios.get<BoxOfficeItem[]>('https://ruehan-kopis.org/boxoffice', {
    params: options,
  })
  return data
}

const BoxOffice: React.FC = () => {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    ststype: 'day',
    date: new Date().toISOString().split('T')[0].replace(/-/g, ''),
  })

  const {
    data: boxOfficeData,
    isLoading,
    error,
  } = useQuery(['boxOffice', filterOptions], () => fetchBoxOffice(filterOptions), {
    keepPreviousData: true,
  })

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setFilterOptions({ ...filterOptions, [e.target.name]: e.target.value })
  }

  if (isLoading) return <BoxOfficeSkeleton />

  if (error)
    return <div className="py-10 text-center text-red-600">데이터를 불러오는 데 실패했습니다.</div>

  if (!boxOfficeData || boxOfficeData.length === 0) {
    return (
      <div className="mx-auto mt-[80px] max-w-[1440px] lg:px-8">
        <h1 className="mb-4 text-center text-2xl font-bold md:text-3xl lg:text-[40px]">
          예매 순위
        </h1>

        <div className="mb-6 mt-[60px] grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          <select
            name="ststype"
            value={filterOptions.ststype}
            onChange={handleFilterChange}
            className="w-full rounded border p-2"
          >
            <option value="day">일별</option>
            <option value="week">주간</option>
            <option value="month">월별</option>
          </select>

          <input
            type="date"
            name="date"
            value={filterOptions.date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')}
            onChange={(e) =>
              handleFilterChange({
                target: {
                  name: 'date',
                  value: e.target.value.replace(/-/g, ''),
                },
              } as React.ChangeEvent<HTMLInputElement>)
            }
            className="w-full rounded border p-2"
          />

          <select
            name="catecode"
            value={filterOptions.catecode || ''}
            onChange={handleFilterChange}
            className="w-full rounded border p-2"
          >
            <option value="">모든 장르</option>
            {Object.entries(GENRE_CODE_MAP).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>

          <select
            name="area"
            value={filterOptions.area || ''}
            onChange={handleFilterChange}
            className="w-full rounded border p-2"
          >
            <option value="">모든 지역</option>
            {Object.entries(AREA_CODE_MAP).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div className="py-10 text-center">
          <h2>선택한 조건에 맞는 데이터가 없습니다.</h2>
        </div>
      </div>
    )
  }

  const top3 = boxOfficeData.slice(0, 3)
  const rest = boxOfficeData.slice(3)

  return (
    <div className="mx-auto mt-[80px] max-w-[1440px] lg:px-8">
      <h1 className="mb-4 text-center text-2xl font-bold md:text-3xl lg:text-[40px]">예매 순위</h1>

      <div className="mb-6 mt-[60px] grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <select
          name="ststype"
          value={filterOptions.ststype}
          onChange={handleFilterChange}
          className="w-full rounded border p-2"
        >
          <option value="day">일별</option>
          <option value="week">주간</option>
          <option value="month">월별</option>
        </select>

        <input
          type="date"
          name="date"
          value={filterOptions.date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')}
          onChange={(e) =>
            handleFilterChange({
              target: {
                name: 'date',
                value: e.target.value.replace(/-/g, ''),
              },
            } as React.ChangeEvent<HTMLInputElement>)
          }
          className="w-full rounded border p-2"
        />

        <select
          name="catecode"
          value={filterOptions.catecode || ''}
          onChange={handleFilterChange}
          className="w-full rounded border p-2"
        >
          <option value="">모든 장르</option>
          {Object.entries(GENRE_CODE_MAP).map(([code, name]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>

        <select
          name="area"
          value={filterOptions.area || ''}
          onChange={handleFilterChange}
          className="w-full rounded border p-2"
        >
          <option value="">모든 지역</option>
          {Object.entries(AREA_CODE_MAP).map(([code, name]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {top3.map((item, index) => (
          <Link
            to={`/performance/${item.mt20id}`}
            key={item.mt20id}
            className="overflow-hidden rounded-lg bg-white shadow-md"
          >
            <div className="relative">
              <img
                src={`http://www.kopis.or.kr/${item.poster}`}
                alt={item.prfnm}
                className="h-80 w-full object-cover"
              />
              <div className="absolute left-0 top-0 rounded-br-lg bg-purple-600 p-2 text-2xl font-bold text-white">
                {index + 1}
              </div>
            </div>
            <div className="p-4">
              <h2 className="mb-2 truncate text-xl font-semibold">{item.prfnm}</h2>
              <p className="mb-1 truncate text-gray-600">{item.fcltynm}</p>
              <p className="mb-1 text-gray-600">{item.prfpd}</p>
              <p className="text-gray-600">{item.genrenm}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow-md">
        {rest.map((item) => (
          <Link
            to={`/performance/${item.mt20id}`}
            key={item.mt20id}
            className="flex items-center border-b p-4 last:border-b-0 hover:bg-gray-50"
          >
            <div className="mr-4 h-24 w-16 flex-shrink-0">
              <img
                src={`http://www.kopis.or.kr/${item.poster}`}
                alt={item.prfnm}
                className="h-full w-full rounded object-cover"
              />
            </div>
            <div className="flex-grow">
              <h3 className="mb-1 text-lg font-semibold">
                {item.rnum}. {item.prfnm}
              </h3>
              <p className="mb-1 text-sm text-gray-600">{item.fcltynm}</p>
              <p className="text-sm text-gray-600">{item.prfpd}</p>
            </div>
            <div className="flex-shrink-0 text-sm text-gray-500">{item.genrenm}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default BoxOffice
