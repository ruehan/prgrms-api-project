import React, { useState, useEffect } from 'react'
import { Performance } from '../nearby/page'
import { useAuth } from './AuthContext'
import { getUserPicks, getPopularByGenre, getRecommendByGenre } from './api'
import GenreSelectionModal from './modal'
import PerformanceList from './list'
import { transformPerformanceData } from './util'

interface GroupedPerformances {
  [genre: string]: Performance[]
}

const RecommendedShows: React.FC = () => {
  const [userPicks, setUserPicks] = useState<Performance[]>([])
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
            console.log(recommended)
            console.log(transformPerformanceData({ root: recommended }))
            setRecommendedShows(transformPerformanceData({ root: recommended }))
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

    // try {
    //   if (!localStorage.getItem('userpick')) {
    //     fetchUserPicks()
    //   }
    // } catch {
    //   console.error('Error')
    // }
  }, [token])

  const handleGenreSelect = async () => {
    if (token) {
      const recommended = await getRecommendByGenre(token)
      console.log(recommended)
      setRecommendedShows(transformPerformanceData({ root: recommended }))
      setShowModal(false)
    }
  }

  return (
    <div className="mx-auto mt-[80px] max-w-[1440px] lg:px-8">
      <h1 className="mb-4 text-center text-2xl font-bold md:text-3xl lg:text-[40px]">추천 공연</h1>
      {showModal ? (
        <GenreSelectionModal onSelect={handleGenreSelect} onClose={() => setShowModal(false)} />
      ) : (
        <PerformanceList performances={recommendedShows} />
      )}
    </div>
  )
}

export default RecommendedShows
