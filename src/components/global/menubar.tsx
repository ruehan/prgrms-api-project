import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useDebounce } from 'use-debounce'
import { format } from 'date-fns'

const MenuBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedSearchTerm.length > 1) {
        try {
          const response = await axios.get(
            'https://ruehan-kopis.org/auto-fill',
            {
              params: {
                stdate: format(new Date(), 'yyyyMMdd'),
                eddate: format(
                  new Date(
                    new Date().setFullYear(new Date().getFullYear() + 1)
                  ),
                  'yyyyMMdd'
                ),
                shprfnm: debouncedSearchTerm,
                cpage: 1,
                rows: 5,
              },
            }
          )
          setSuggestions(
            response.data.map((item: { prfnm: string }) => item.prfnm)
          )
          setShowSuggestions(true)
        } catch (error) {
          console.error('Error fetching suggestions:', error)
        }
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    }

    fetchSuggestions()
  }, [debouncedSearchTerm])

  console.log(debouncedSearchTerm)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion)
    setShowSuggestions(false)
    navigate(`/search?q=${encodeURIComponent(suggestion)}`)
  }

  return (
    <div className="flex flex-col">
      <header className="fixed top-0 z-50 w-full bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <Link to="/" className="flex items-center">
              <object
                type="image/svg+xml"
                data="/logo.svg"
                className="h-[50px] w-[200px]"
              >
                culturetree
              </object>
              {/* <img src="/public/logo.svg" alt="" /> */}
            </Link>
            <div className="mx-10 flex-grow">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions(false), 200)
                  }
                  placeholder="공연/정보를 검색해 보세요"
                  className="w-full rounded-full border border-gray-300 p-2 pl-10 pr-4 focus:border-purple-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="absolute left-3 top-1/2 -translate-y-1/2 transform"
                >
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </form>
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full rounded-b-lg bg-white shadow-md">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="cursor-pointer p-2 hover:bg-gray-100"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <Link to="/" className="text-gray-600 hover:text-purple-600">
                    홈
                  </Link>
                </li>
                <li>
                  <Link
                    to="/recommend"
                    className="text-gray-600 hover:text-purple-600"
                  >
                    추천
                  </Link>
                </li>
                <li>
                  <Link
                    to="/ranking"
                    className="text-gray-600 hover:text-purple-600"
                  >
                    랭킹
                  </Link>
                </li>
                <li>
                  <Link
                    to="/nearby"
                    className="text-gray-600 hover:text-purple-600"
                  >
                    주변 공연장
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
      {/* 헤더의 높이만큼 여백을 추가하여 컨텐츠가 헤더 아래에 오도록 합니다 */}
      <div className="pt-20"></div>
    </div>
  )
}

export default MenuBar
