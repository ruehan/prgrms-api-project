import React, { useState, useEffect } from 'react'
import { getPopularByGenre, saveUserGenres } from './api'
import SkeletonUI from './modalSkeleton'
import { useAuth } from './AuthContext'
import { Performance } from './page'

interface GenreSelectionModalProps {
  onSelect: (selectedGenres: string[]) => void
  onClose: () => void
}

const GenreSelectionModal: React.FC<GenreSelectionModalProps> = ({ onSelect, onClose }) => {
  const [genreShows, setGenreShows] = useState<Record<string, Performance[]>>({})
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const { token } = useAuth()

  useEffect(() => {
    const fetchGenreShows = async () => {
      setIsLoading(true)
      try {
        const shows = await getPopularByGenre()
        const groupedShows = shows.reduce(
          (acc, show) => {
            if (!acc[show.genrenm]) {
              acc[show.genrenm] = []
            }
            acc[show.genrenm].push(show)
            return acc
          },
          {} as Record<string, Performance[]>
        )
        setGenreShows(groupedShows)
      } catch (error) {
        console.error('Error fetching genre shows:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchGenreShows()
  }, [])

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre].slice(0, 3)
    )
  }

  const handleSubmit = async () => {
    if (selectedGenres.length > 2 && token) {
      try {
        await saveUserGenres(token, selectedGenres)
        onSelect(selectedGenres)
        onClose()
      } catch (error) {
        console.error('Error saving user genres:', error)
      }
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[80vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white">
        <div className="p-6">
          <h2 className="mb-4 text-2xl font-bold">장르별 공연 선택</h2>
          <p className="mb-4">관심 있는 장르를 선택해주세요 (최대 3개)</p>
        </div>
        <div className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-3 md:grid-cols-4">
          {isLoading ? (
            <SkeletonUI count={8} />
          ) : (
            Object.entries(genreShows).map(([genre, shows]) => (
              <div
                key={genre}
                className={`cursor-pointer overflow-hidden rounded-lg bg-white shadow-md transition-all ${
                  selectedGenres.includes(genre) ? 'ring-2 ring-purple-500' : ''
                }`}
                onClick={() => handleGenreToggle(genre)}
              >
                {shows.slice(0, 1).map((show) => (
                  <div key={show.mt20id}>
                    <img src={show.poster} alt={show.prfnm} className="h-48 w-full object-cover" />
                    <div className="p-4">
                      <h3 className="truncate text-sm font-bold">{show.prfnm}</h3>
                      <p className="truncate text-xs text-gray-600">{genre}</p>
                    </div>
                  </div>
                ))}
                <div className="bg-gray-100 px-4 py-2">
                  <span className="rounded bg-gray-200 px-2 py-1 text-xs font-semibold text-gray-800">
                    {genre}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="flex items-center justify-between bg-gray-100 p-6">
          <p className="text-sm text-gray-600">선택된 장르: {selectedGenres.join(', ')}</p>
          <button
            onClick={handleSubmit}
            className="rounded bg-purple-500 px-6 py-2 text-white transition-colors hover:bg-purple-600 disabled:bg-gray-300"
            disabled={selectedGenres.length === 0}
          >
            선택 완료 ({selectedGenres.length}/3)
          </button>
        </div>
      </div>
    </div>
  )
}

export default GenreSelectionModal
