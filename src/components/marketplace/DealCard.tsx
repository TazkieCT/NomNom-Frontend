import { Link } from "react-router-dom"
import { Star, TrendingUp } from "lucide-react"

type Deal = {
  id: string
  title: string
  price: string
  original?: string
  vendor: string
  eta: string
  image?: string
  distance?: string
  rating?: number
  reviewCount?: number
  sold?: number
  category?: string
}

interface DealCardProps {
  deal: Deal
}

export default function DealCard({ deal }: DealCardProps) {
  return (
    <Link to={`/deal/${deal.id}`}>
      <article
        className="bg-white rounded-xl cursor-pointer hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 group"
      >
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {deal.image ? (
          <img
            src={deal.image}
            alt={deal.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-medium text-center px-4">
            {deal.title}
          </div>
        )}
        
        {deal.original && (
          <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            {Math.round((1 - parseFloat(deal.price.replace("Rp ", "").replace(/\./g, "")) / parseFloat(deal.original.replace("Rp ", "").replace(/\./g, ""))) * 100)}% OFF
          </div>
        )}

        {deal.sold && deal.sold > 15 && (
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {deal.sold} sold
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-red-600 transition">
          {deal.title}
        </h3>
        <p className="text-sm text-gray-600 mb-3">{deal.vendor}</p>

        <div className="flex items-center gap-1 mb-4 text-xs text-gray-600">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="font-semibold">{deal.rating || 0}</span>
          {deal.reviewCount !== undefined && deal.reviewCount > 0 ? (
            <span className="text-gray-500">({deal.reviewCount} {deal.reviewCount === 1 ? 'review' : 'reviews'})</span>
          ) : (
            <span className="text-gray-500">(No reviews)</span>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <div className="text-2xl font-bold text-gray-900">{deal.price}</div>
            {deal.original && (
              <div className="text-sm line-through text-gray-400">{deal.original}</div>
            )}
          </div>

          <button className="px-5 py-2.5 bg-red-600 text-white cursor-pointer rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold text-sm hover:bg-red-700">
            Claim Deal
          </button>
        </div>
      </div>
      </article>
    </Link>
  )
}
