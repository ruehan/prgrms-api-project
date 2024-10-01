interface RawPerformance {
  mt20id: string
  prfnm: string
  prfpdfrom: string
  prfpdto: string
  fcltynm: string
  poster: string
  genrenm: string
  prfstate: string
  openrun: string
  area: string
}

interface TransformedData {
  [genre: string]: RawPerformance[]
}

export function transformPerformanceData(data: {
  root: { [genre: string]: RawPerformance[] }
}): TransformedData {
  return Object.entries(data.root).reduce((acc, [genre, performances]) => {
    acc[genre] = performances
    return acc
  }, {} as TransformedData)
}
