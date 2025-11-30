import { useState, useEffect, useMemo } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { 
  ArrowLeft, 
  Heart,
  Share2,
  CheckCircle2,
  Info,
  Store,
  Sparkles,
  Star,
  ShoppingCart
} from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import StoreMap from "../components/StoreMap"

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

interface Review {
  _id: string
  customerId: {
    _id: string
    username: string
  }
  rating: number
  comment: string
  createdAt: string
}

interface Food {
  _id: string
  name: string
  description: string
  price: number
  isAvailable: boolean
  images: string[]
  categoryId: { _id: string; name: string }
  storeId: { 
    _id: string
    name: string
    address: string
    mapsLink?: string
    openHours: string
  }
  filters: { _id: string; name: string }[]
  averageRating: number
  totalReviews: number
}

export default function ItemDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isFavorited, setIsFavorited] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [food, setFood] = useState<Food | null>(null)
  const [loading, setLoading] = useState(true)
  const [similarFoods, setSimilarFoods] = useState<Food[]>([])
  const [orderLoading, setOrderLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [copied, setCopied] = useState(false)
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all')

  useEffect(() => {
    async function fetchFood() {
      try {
        const response = await fetch(`${API_URL}/foods/${id}`)
        if (response.ok) {
          const data = await response.json()
          setFood(data)
          
          const similarRes = await fetch(`${API_URL}/foods`)
          if (similarRes.ok) {
            const allFoods = await similarRes.json()
            const similar = allFoods
              .filter((f: Food) => 
                f._id !== id && 
                f.categoryId._id === data.categoryId._id && 
                f.isAvailable
              )
              .slice(0, 4)
            setSimilarFoods(similar)
          }
        } else {
          setError("Food item not found")
        }
      } catch (error) {
        console.error('Error fetching food:', error)
        setError("Failed to load food item")
      } finally {
        setLoading(false)
      }
    }

    async function fetchReviews() {
      setReviewsLoading(true)
      try {
        const response = await fetch(`${API_URL}/reviews/food/${id}`)
        if (response.ok) {
          const data = await response.json()
          setReviews(data.reviews)
        }
      } catch (error) {
        console.error('Error fetching reviews:', error)
      } finally {
        setReviewsLoading(false)
      }
    }

    fetchFood()
    fetchReviews()
  }, [id])

  const filteredReviews = useMemo(() => {
    if (ratingFilter === 'all') return reviews
    return reviews.filter(review => review.rating === ratingFilter)
  }, [reviews, ratingFilter])

  const handleOrder = async () => {
    if (!user) {
      navigate('/signin', { state: { from: `/deal/${id}` } })
      return
    }

    if (user.role !== 'customer') {
      setError("Only customers can place orders")
      return
    }

    if (!food) return

    setOrderLoading(true)
    setError("")

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          storeId: food.storeId._id,
          items: [{
            foodId: food._id,
            quantity
          }]
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccessMessage("Order placed successfully!")
        setTimeout(() => {
          navigate('/orders')
        }, 2000)
      } else {
        setError(data.message || 'Failed to place order')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setOrderLoading(false)
    }
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy link:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (error && !food) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Food item not found</h2>
          <Link to="/marketplace" className="text-red-600 hover:text-red-700 font-semibold">
            Back to Marketplace
          </Link>
        </div>
      </div>
    )
  }

  if (!food) return null

  const totalPrice = food.price * quantity

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex cursor-pointer items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-600">{successMessage}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-5 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="relative">
              <div className="aspect-video bg-linear-to-br from-gray-100 to-gray-200 rounded-3xl overflow-hidden shadow-xl">
                {food.images && food.images.length > 0 && food.images[0] ? (
                  <img
                    src={food.images[0]}
                    alt={food.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-bold text-2xl text-center px-8">
                    {food.name}
                  </div>
                )}

                {!food.isAvailable && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">Currently Unavailable</span>
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
                  className={`py-3 px-6 border-2 rounded-xl transition-all font-semibold ${
                    copied 
                      ? 'bg-green-50 border-green-600 text-green-600'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Share2 className="w-5 h-5 inline-block mr-2" />
                  {copied ? 'Copied!' : 'Share'}
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-red-600" />
              <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">
                {food.categoryId.name}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-3 leading-tight">
              {food.name}
            </h1>
            
            <div className="flex items-center gap-2 mb-6">
              <Store className="w-5 h-5 text-gray-500" />
              <span className="text-xl text-gray-600 font-semibold">{food.storeId.name}</span>
            </div>

            <div className="flex items-center gap-1 mb-6 pb-6 border-b border-gray-200 text-sm text-gray-600">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-semibold">{food.averageRating || 0}</span>
              {food.totalReviews > 0 ? (
                <span className="text-gray-500">({food.totalReviews} {food.totalReviews === 1 ? 'review' : 'reviews'})</span>
              ) : (
                <span className="text-gray-500">(No reviews yet)</span>
              )}
            </div>

            {food.description && (
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{food.description}</p>
              </div>
            )}

            <div className="bg-gray-50 rounded-2xl py-6 mb-6">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Price</div>
                  <div className="text-3xl font-black text-gray-900">
                    Rp {food.price.toLocaleString('id-ID')}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg bg-white border-2 cursor-pointer border-gray-300 font-bold hover:border-gray-400 transition-colors"
                  >
                    -
                  </button>
                  <span className="text-xl font-bold w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="w-10 h-10 rounded-lg bg-white border-2 cursor-pointer border-gray-300 font-bold hover:border-gray-400 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <button 
                onClick={handleOrder}
                disabled={!food.isAvailable || orderLoading}
                className="w-full py-4 bg-red-600 cursor-pointer text-white rounded-xl font-bold text-lg hover:bg-red-700 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                {orderLoading ? 'Processing...' : `Order Now · Rp ${totalPrice.toLocaleString('id-ID')}`}
              </button>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Fresh & Quality</div>
                  <div className="text-sm text-gray-600">Guaranteed fresh food</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Store className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Opening Hours</div>
                  <div className="text-sm text-gray-600">{food.storeId.openHours}</div>
                </div>
              </div>
            </div>

            {food.filters && food.filters.length > 0 && (
              <div className="mb-8">
                <h3 className="font-bold text-gray-900 mb-3">Dietary Information</h3>
                <div className="flex flex-wrap gap-2">
                  {food.filters.map(filter => (
                    <span
                      key={filter._id}
                      className="px-4 py-2 bg-green-50 border-2 border-green-200 rounded-full text-sm font-semibold text-green-700"
                    >
                      {filter.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-8">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">About this offer</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    This is a fresh food item from {food.storeId.name}. By ordering this, 
                    you're getting a great meal while supporting local businesses. 
                    All food is freshly prepared and guaranteed quality.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-3">Store Location</h3>
              <div className="bg-white rounded-xl p-4 border border-gray-200 mb-4">
                <p className="text-gray-700 mb-2">{food.storeId.address}</p>
              </div>
              <StoreMap 
                mapsLink={food.storeId.mapsLink} 
                storeName={food.storeId.name}
                address={food.storeId.address}
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 pt-16 border-t border-gray-200"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black text-gray-900">Customer Reviews</h2>
            {food.totalReviews > 0 && (
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span className="text-2xl font-bold text-gray-900">{food.averageRating}</span>
                <span className="text-gray-600">/ 5</span>
              </div>
            )}
          </div>

          {reviews.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setRatingFilter('all')}
                  className={`px-4 py-2 rounded-lg cursor-pointer font-semibold text-sm transition-colors ${
                    ratingFilter === 'all'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All ({reviews.length})
                </button>
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = reviews.filter(r => r.rating === rating).length
                  return (
                    <button
                      key={rating}
                      onClick={() => setRatingFilter(rating)}
                      disabled={count === 0}
                      className={`px-4 py-2 rounded-lg cursor-pointer font-semibold text-sm transition-colors flex items-center gap-1 ${
                        ratingFilter === rating
                          ? 'bg-amber-600 text-white'
                          : count === 0
                          ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${
                        ratingFilter === rating || count > 0 ? 'fill-current' : ''
                      }`} />
                      {rating} ({count})
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {reviewsLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-12 text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No reviews yet</h3>
              <p className="text-gray-600">Be the first to review this food item!</p>
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-12 text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No {ratingFilter}-star reviews</h3>
              <p className="text-gray-600">Try selecting a different rating filter.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredReviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-linear-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {review.customerId.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{review.customerId.username}</h4>
                        <p className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-amber-700">{review.rating}</span>
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {similarFoods.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 pt-16 border-t border-gray-200"
          >
            <h2 className="text-3xl font-black text-gray-900 mb-8">Similar Items</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarFoods.map(similarFood => (
                <Link
                  key={similarFood._id}
                  to={`/deal/${similarFood._id}`}
                  className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all group"
                >
                  <div className="relative h-40 bg-gray-100">
                    {similarFood.images && similarFood.images[0] ? (
                      <img
                        src={similarFood.images[0]}
                        alt={similarFood.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm font-medium text-center px-4">
                        {similarFood.name}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-red-600 transition line-clamp-1">
                      {similarFood.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{similarFood.storeId.name}</p>
                    <span className="text-xl font-bold text-gray-900">
                      Rp {similarFood.price.toLocaleString('id-ID')}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
