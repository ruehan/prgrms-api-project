import React, { useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import axios from 'axios'
import { useInView } from 'react-intersection-observer'

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
  // const [ref, inView] = useInView()
  const imageSectionRef = useRef<HTMLDivElement>(null)
  const [ref, inView] = useInView({})

  useEffect(() => {
    if (inView) {
      scrollToImageSection()
    }
  }, [inView])

  const scrollToImageSection = () => {
    imageSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

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
  const relateInfo: RelateInfo[] = JSON.parse(performance.relates)

  return (
    <div className="min-h-screen">
      <section className="flex min-h-screen flex-col bg-gray-100 p-4 pt-[80px]">
        <div className="container mx-auto max-w-[1440px]">
          <h1 className="mb-6 text-3xl font-bold">{performance.prfnm}</h1>
          <div className="mb-4 text-sm">
            {performance.prfpdfrom} ~ {performance.prfpdto}
          </div>
          <div className="flex flex-col gap-8 md:flex-row">
            <div className="flex flex-col md:w-1/3">
              <img
                src={performance.poster}
                alt={performance.prfnm}
                className="h-auto w-full rounded-lg object-cover shadow-lg"
              />
            </div>
            <div className="flex flex-col md:w-2/3">
              <div className="flex flex-grow flex-col justify-between rounded-lg bg-white p-6 shadow-md">
                <dl className="grid grid-cols-1 gap-y-4">
                  <div className="flex">
                    <dt className="w-1/4 font-medium">등급</dt>
                    <dd>{performance.prfage}</dd>
                  </div>
                  <div className="flex">
                    <dt className="w-1/4 font-medium">관람시간</dt>
                    <dd>{performance.prfruntime}</dd>
                  </div>
                  {performance.prfcast && (
                    <div className="flex">
                      <dt className="w-1/4 font-medium">출연</dt>
                      <dd>{performance.prfcast}</dd>
                    </div>
                  )}
                  {performance.prfcrew && (
                    <div className="flex">
                      <dt className="w-1/4 font-medium">제작진</dt>
                      <dd>{performance.prfcrew}</dd>
                    </div>
                  )}
                  <div className="flex">
                    <dt className="w-1/4 font-medium">가격</dt>
                    <dd>
                      {priceList.map((price, index) => (
                        <div key={index}>{price}</div>
                      ))}
                    </dd>
                  </div>
                  <div className="flex">
                    <dt className="w-1/4 font-medium">공연시간 안내</dt>
                    <dd>{performance.dtguidance}</dd>
                  </div>
                </dl>
              </div>
              {/* 여기 부분 어떻게 해야할까? */}
              {relateInfo.length > 0 && (
                <div className="mt-4">
                  {relateInfo.map((relate, index) => (
                    <a
                      key={index}
                      href={relate.relateurl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mb-2 block w-full rounded-lg bg-purple-600 py-3 text-center font-bold text-white"
                    >
                      {relate.relatenm}에서 예매하기
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div ref={ref} style={{ height: '1px' }} />

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
