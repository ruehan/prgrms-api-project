import React from 'react'
import { useNavigate } from 'react-router-dom'

const MenuBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('')
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`)
    }
  }

  return (
    <div className="z-20 flex flex-col">
      <header className="fixed top-0 flex h-[94px] w-full bg-purple-600 p-4 text-white">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">CultureTree</h1>
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="공연 검색..."
              className="p-2 text-black"
            />
            <button type="submit" className="ml-2 bg-purple-800 p-2">
              검색
            </button>
          </form>
        </div>
      </header>
    </div>
  )
}

export default MenuBar
