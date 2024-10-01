import React, { useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { getUserPicks, getRecommendByGenre } from './api'
import GenreSelectionModal from './modal'
import PerformanceList from './list'
import { transformPerformanceData } from './util'

interface GroupedPerformances {
  [genre: string]: Performance[]
}

export interface Performance {
  mt20id: string
  prfnm: string
  prfpdfrom: string
  prfpdto: string
  fcltynm: string
  poster: string
  genrenm: string
  prfstate?: string
}

const RecommendedShows: React.FC = () => {
  const [, setUserPicks] = useState<Performance[]>([])
  const [showModal, setShowModal] = useState(false)
  const [recommendedShows, setRecommendedShows] = useState<GroupedPerformances>({})
  const { token } = useAuth()

  useEffect(() => {
    const fetchUserPicks = async () => {
      if (token) {
        try {
          const picks = await getUserPicks(token)
          setUserPicks(picks)
          if (picks.length === 0) {
            setShowModal(true)
          } else {
            const recommended = await getRecommendByGenre(token)

            //@ts-ignore
            const formattedData = transformPerformanceData({ root: recommended })
            setRecommendedShows(formattedData)
          }
        } catch (error) {
          console.error('Error fetching user picks:', error)
          setShowModal(true)
        }
      } else {
        setShowModal(true)
      }
    }

    fetchUserPicks()
  }, [token])

  const handleGenreSelect = async () => {
    if (token) {
      const recommended = await getRecommendByGenre(token)

      //@ts-ignore
      const formattedData = transformPerformanceData({ root: recommended })
      setRecommendedShows(formattedData)
      setShowModal(false)
    }
  }

  return (
    <div className="mx-auto mt-[80px] max-w-[1440px] lg:px-8">
      <h1 className="mb-4 text-center text-2xl font-bold md:text-3xl lg:text-[40px]">추천 공연</h1>
      {showModal ? (
        <GenreSelectionModal onSelect={handleGenreSelect} onClose={() => setShowModal(false)} />
      ) : (
        //@ts-ignore
        <PerformanceList performances={recommendedShows} />
      )}
    </div>
  )
}

export default RecommendedShows
