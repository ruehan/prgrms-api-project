import React, { useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import axios from 'axios'

interface PerformanceDetail {
  styurls: string
  mt20id: string
  prfnm: string
  prfpdfrom: string
  prfpdto: string
  fcltynm: string
  prfcast: string | null
  prfcrew: string | null
  prfruntime: string
  prfage: string
  entrpsnm: string
  pcseguidance: string
  poster: string
  sty: string
  genrenm: string
  prfstate: string
  openrun: string
  dtguidance: string
  relates: string
}

interface RelateInfo {
  relatenm: string
  relateurl: string
}

const fetchPerformanceDetail = async (mt20id: string) => {
  const { data } = await axios.get<PerformanceDetail>(
    `https://ruehan-kopis.org/performance/${mt20id}`
  )
  return data
}

const PerformanceDetailPage: React.FC = () => {
  const { mt20id } = useParams<{ mt20id: string }>()
  const {
    data: performance,
    isLoading,
    error,
  } = useQuery(['performanceDetail', mt20id], () => fetchPerformanceDetail(mt20id!))
  const imageSectionRef = useRef<HTMLDivElement>(null)

  if (isLoading) return <div className="flex h-screen items-center justify-center">로딩 중...</div>
  if (error)
    return (
      <div className="flex h-screen items-center justify-center text-red-600">
        에러가 발생했습니다.
      </div>
    )
  if (!performance)
    return (
      <div className="flex h-screen items-center justify-center">공연 정보를 찾을 수 없습니다.</div>
    )

  const priceList = performance.pcseguidance.split(/원,|원/).map((price) => price.trim())
  const imageUrls = performance.styurls.split(',').map((url) => url.trim())
  const relateInfo: RelateInfo[] = Array.isArray(JSON.parse(performance.relates))
    ? JSON.parse(performance.relates)
    : [JSON.parse(performance.relates)]

  priceList.pop()

  return (
    <div className="border-b-gray">
      <section className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-lg bg-white shadow-xl">
            <div className="md:flex">
              <div className="md:w-1/3 md:flex-shrink-0">
                <img
                  className="h-full w-full object-cover md:h-full md:w-full"
                  src={performance.poster}
                  alt={performance.prfnm}
                />
              </div>
              <div className="p-8 md:w-2/3">
                <div className="text-sm font-semibold uppercase tracking-wide text-indigo-500">
                  {performance.genrenm}
                </div>
                <h1 className="mt-2 text-3xl font-extrabold leading-8 tracking-tight text-gray-900 sm:text-4xl">
                  {performance.prfnm}
                </h1>
                <p className="mt-2 text-xl text-gray-500">
                  {performance.prfpdfrom} ~ {performance.prfpdto}
                </p>
                <p className="mt-4 text-lg text-gray-700">{performance.fcltynm}</p>

                <div className="mt-6 border-t border-gray-200 pt-6">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">등급</dt>
                      <dd className="mt-1 text-sm text-gray-900">{performance.prfage}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">관람시간</dt>
                      <dd className="mt-1 text-sm text-gray-900">{performance.prfruntime}</dd>
                    </div>
                    {performance.prfcast && (
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">출연</dt>
                        <dd className="mt-1 text-sm text-gray-900">{performance.prfcast}</dd>
                      </div>
                    )}
                    {performance.prfcrew && (
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">제작진</dt>
                        <dd className="mt-1 text-sm text-gray-900">{performance.prfcrew}</dd>
                      </div>
                    )}
                  </dl>
                </div>

                <div className="mt-6 border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">가격</h3>
                  <dl className="mt-2 border-t border-gray-200">
                    {priceList.map((price, index) => (
                      <div
                        key={index}
                        className={`flex justify-between py-3 ${index % 2 === 0 ? 'bg-gray-50' : ''}`}
                      >
                        <dt className="text-sm font-medium text-gray-500">{price.split(' ')[0]}</dt>
                        <dd className="text-sm text-gray-900">{price.split(' ')[1]}원</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="mt-6 border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">공연시간 안내</h3>
                  <p className="mt-2 text-sm text-gray-700">{performance.dtguidance}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {relateInfo.length > 0 && (
        <div
          className="fixed bottom-0 left-0 right-0 flex justify-center bg-white p-4 shadow-lg"
          style={{ zIndex: 10 }} // z-index로 고정된 요소가 다른 요소 위에 오도록 설정
        >
          <div className="flex gap-4">
            {relateInfo.map((relate, index) => (
              <a
                key={index}
                href={relate.relateurl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-purple-600 px-6 py-3 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {relate.relatenm}에서 예매하기
              </a>
            ))}
          </div>
        </div>
      )}

      {imageUrls.length > 0 && (
        <section ref={imageSectionRef} className="bg-white py-16">
          <div className="container mx-auto max-w-[800px] px-4">
            <h2 className="mb-8 text-center text-2xl font-bold">공연 상세 이미지</h2>
            <div className="flex flex-col items-center space-y-8">
              {imageUrls.map((url, index) => (
                <div key={index} className="w-full">
                  <img
                    src={url}
                    alt={`공연 상세 이미지 ${index + 1}`}
                    className="h-auto w-full rounded-lg shadow-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default PerformanceDetailPage
