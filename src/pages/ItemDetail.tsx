import { useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { 
  MapPin, 
  Clock, 
  Star, 
  TrendingUp, 
  ArrowLeft, 
  Heart,
  Share2,
  Calendar,
  CheckCircle2,
  Info,
  Store,
  Sparkles
} from "lucide-react"
import { SAMPLE_DEALS } from "../data/sampleDeals"

export default function ItemDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isFavorited, setIsFavorited] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const deal = SAMPLE_DEALS.find(d => d.id === id)

  if (!deal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Deal not found</h2>
          <Link to="/marketplace" className="text-red-600 hover:text-red-700 font-semibold">
            Back to Marketplace
          </Link>
        </div>
      </div>
    )
  }

  const discountPercentage = deal.original 
    ? Math.round((1 - parseFloat(deal.price.replace("$", "")) / parseFloat(deal.original.replace("$", ""))) * 100)
    : 0

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: deal.title,
        text: `Check out this deal: ${deal.title} at ${deal.vendor}`,
        url: window.location.href,
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl overflow-hidden shadow-xl">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-bold text-2xl text-center px-8">
                  {deal.title}
                </div>

                {deal.original && (
                  <div className="absolute top-6 left-6 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    {discountPercentage}% OFF
                  </div>
                )}

                {deal.sold && deal.sold > 10 && (
                  <div className="absolute top-6 right-6 bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    {deal.sold} sold today
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setIsFavorited(!isFavorited)}
                  className={`flex-1 py-3 px-6 rounded-xl border-2 font-semibold transition-all ${
                    isFavorited
                      ? "bg-red-50 border-red-600 text-red-600"
                      : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Heart className={`w-5 h-5 inline-block mr-2 ${isFavorited ? "fill-red-600" : ""}`} />
                  {isFavorited ? "Saved" : "Save"}
                </button>
                <button
                  onClick={handleShare}
                  className="py-3 px-6 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-all font-semibold text-gray-700"
                >
                  <Share2 className="w-5 h-5 inline-block" />
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {deal.category && (
              <div className="inline-flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-red-600" />
                <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">
                  {deal.category}
                </span>
              </div>
            )}

            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-3 leading-tight">
              {deal.title}
            </h1>
            
            <div className="flex items-center gap-2 mb-6">
              <Store className="w-5 h-5 text-gray-500" />
              <span className="text-xl text-gray-600 font-semibold">{deal.vendor}</span>
            </div>

            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
              {deal.rating && (
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className="text-lg font-bold text-gray-900">{deal.rating}</span>
                  <span className="text-gray-500 text-sm">(120+ reviews)</span>
                </div>
              )}
              {deal.distance && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="font-medium">{deal.distance}</span>
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 mb-6">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Deal Price</div>
                  <div className="text-5xl font-black text-gray-900">{deal.price}</div>
                  {deal.original && (
                    <div className="flex items-center gap-3 mt-2">
                      <div className="text-xl line-through text-gray-400">{deal.original}</div>
                      <div className="text-green-600 font-bold text-sm">
                        Save ${(parseFloat(deal.original.replace("$", "")) - parseFloat(deal.price.replace("$", ""))).toFixed(2)}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg bg-white border-2 border-gray-300 font-bold hover:border-gray-400 transition-colors"
                  >
                    -
                  </button>
                  <span className="text-xl font-bold w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(5, quantity + 1))}
                    className="w-10 h-10 rounded-lg bg-white border-2 border-gray-300 font-bold hover:border-gray-400 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <button className="w-full py-4 bg-red-600 text-white rounded-xl font-bold text-lg hover:bg-red-700 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]">
                Claim Deal · ${(parseFloat(deal.price.replace("$", "")) * quantity).toFixed(2)}
              </button>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Pickup Time</div>
                  <div className="text-sm text-gray-600">{deal.eta}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Valid Until</div>
                  <div className="text-sm text-gray-600">Today at 11:59 PM</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Guarantee</div>
                  <div className="text-sm text-gray-600">Full refund if not satisfied</div>
                </div>
              </div>
            </div>

            {deal.tags && deal.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="font-bold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {deal.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-4 py-2 bg-white border-2 border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:border-red-600 hover:text-red-600 transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">About this deal</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    This is a limited-time offer to help reduce food waste. By claiming this deal, 
                    you're getting a great meal at an amazing price while supporting local businesses 
                    and helping the environment. All food is freshly prepared and guaranteed quality.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 pt-16 border-t border-gray-200"
        >
          <h2 className="text-3xl font-black text-gray-900 mb-8">Similar Deals</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SAMPLE_DEALS.filter(d => d.id !== id && d.category === deal.category)
              .slice(0, 4)
              .map(similarDeal => (
                <Link
                  key={similarDeal.id}
                  to={`/deal/${similarDeal.id}`}
                  className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all group"
                >
                  <div className="relative h-40 bg-gray-100">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm font-medium text-center px-4">
                      {similarDeal.title}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-red-600 transition">
                      {similarDeal.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{similarDeal.vendor}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-gray-900">{similarDeal.price}</span>
                      {similarDeal.original && (
                        <span className="text-sm line-through text-gray-400">{similarDeal.original}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
