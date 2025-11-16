import { motion } from "framer-motion"
import { MapPin, Clock, Star, TrendingUp } from "lucide-react"

type Deal = {
  id: string
  title: string
  price: string
  original?: string
  vendor: string
  eta: string
  distance?: string
  rating?: number
  sold?: number
  category?: string
}

interface DealCardProps {
  deal: Deal
  index: number
}

export default function DealCard({ deal, index }: DealCardProps) {
  return (
    <motion.article
      initial={{ y: 20 }}
      animate={{ y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-xl cursor-pointer hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 group"
    >
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-medium text-center px-4">
          {deal.title}
        </div>
        
        {deal.original && (
          <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            {Math.round((1 - parseFloat(deal.price.replace("$", "")) / parseFloat(deal.original.replace("$", ""))) * 100)}% OFF
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

        <div className="flex items-center gap-3 mb-4 text-xs text-gray-500">
          {deal.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-gray-700">{deal.rating}</span>
            </div>
          )}
          {deal.distance && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{deal.distance}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{deal.eta}</span>
          </div>
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
    </motion.article>
  )
}
