export type Deal = {
  id: string
  title: string
  price: string
  original?: string
  vendor: string
  eta: string
  image?: string
  tags?: string[]
  distance?: string
  rating?: number
  sold?: number
  category?: string
}
