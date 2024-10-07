const BoxOfficeSkeleton: React.FC = () => (
  <div className="mx-auto mt-[80px] max-w-[1440px] lg:px-8">
    <h1 className="mb-4 text-center text-2xl font-bold md:text-3xl lg:text-[40px]">예매 순위</h1>

    <div className="mb-6 mt-[60px] grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
      <select name="ststype" className="w-full rounded border p-2">
        <option value="day">일별</option>
        <option value="week">주간</option>
        <option value="month">월별</option>
      </select>

      <input type="date" name="date" className="w-full rounded border p-2" />

      <select name="catecode" className="w-full rounded border p-2">
        <option value="">모든 장르</option>
      </select>

      <select name="area" className="w-full rounded border p-2">
        <option value="">모든 지역</option>
      </select>
    </div>

    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
      {[1, 2, 3].map((item) => (
        <div key={item} className="overflow-hidden rounded-lg bg-white shadow-md">
          <div className="relative">
            <div className="h-80 w-full bg-gray-300"></div>
            <div className="absolute left-0 top-0 h-12 w-12 rounded-br-lg bg-gray-300"></div>
          </div>
          <div className="p-4">
            <div className="mb-2 h-6 w-3/4 rounded bg-gray-300"></div>
            <div className="mb-2 h-5 w-1/2 rounded bg-gray-300"></div>
            <div className="h-5 w-2/3 rounded bg-gray-300"></div>
          </div>
        </div>
      ))}
    </div>

    <div className="overflow-hidden rounded-lg bg-white shadow-md">
      {[1, 2, 3, 4, 5].map((item) => (
        <div key={item} className="flex items-center border-b p-4 last:border-b-0">
          <div className="mr-4 h-24 w-16 flex-shrink-0 rounded bg-gray-300"></div>
          <div className="flex-grow">
            <div className="mb-2 h-6 w-3/4 rounded bg-gray-300"></div>
            <div className="mb-2 h-5 w-1/2 rounded bg-gray-300"></div>
          </div>
          <div className="h-5 w-1/4 flex-shrink-0 rounded bg-gray-300"></div>
        </div>
      ))}
    </div>
  </div>
)

export default BoxOfficeSkeleton
