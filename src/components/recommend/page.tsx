import React, { useState, useEffect } from 'react'
import { Performance } from '../nearby/page'
import { useAuth } from './AuthContext'
import { getUserPicks, getPopularByGenre, getRecommendByGenre } from './api'
import RecommendationList from './list'
import GenreSelectionModal from './modal'

const RecommendedShows: React.FC = () => {
  const [userPicks, setUserPicks] = useState<Performance[]>([])
  const [showModal, setShowModal] = useState(false)
  const [recommendedShows, setRecommendedShows] = useState<Performance[]>([])
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
            const recommended = await getPopularByGenre()
            setRecommendedShows(recommended)
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
      console.log(recommended)
      setRecommendedShows(recommended)
      setShowModal(false)
    }
  }

  return (
    <div className="mx-auto mt-[80px] max-w-[1440px] lg:px-8">
      <h1 className="mb-4 text-center text-2xl font-bold md:text-3xl lg:text-[40px]">추천 공연</h1>
      {showModal ? (
        <GenreSelectionModal onSelect={handleGenreSelect} onClose={() => setShowModal(false)} />
      ) : (
        <RecommendationList shows={recommendedShows} />
      )}
    </div>
  )
}

export default RecommendedShows
