import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"
import { useEffect, useState } from "react"

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

interface Review {
  _id?: string
  customerId?: {
    username: string
  }
  name?: string
  location?: string
  rating: number
  review?: string
  comment?: string
  avatar?: string
  date?: string
  createdAt?: string
}

export default function CustomerReviews() {
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    fetchApprovedRatings()
  }, [])

  const fetchApprovedRatings = async () => {
    try {
      const response = await fetch(`${API_URL}/app-ratings/approved`)
      
      if (response.ok) {
        const data = await response.json()
        // Transform API ratings to match Review interface
        const transformedReviews = data.ratings.map((rating: any) => ({
          _id: rating._id,
          name: rating.customerId?.username || 'Anonymous',
          location: 'Customer',
          rating: rating.rating,
          review: rating.comment || 'No comment provided',
          avatar: rating.customerId?.username?.substring(0, 2).toUpperCase() || 'AN',
          date: getRelativeTime(rating.createdAt)
        }))
        
        setReviews(transformedReviews.length > 0 ? transformedReviews : getFallbackReviews())
      } else {
        setReviews(getFallbackReviews())
      }
    } catch (error) {
      console.error('Error fetching ratings:', error)
      setReviews(getFallbackReviews())
    }
  }

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return '1 day ago'
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 14) return '1 week ago'
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    return `${Math.floor(diffInDays / 30)} months ago`
  }

  const getFallbackReviews = (): Review[] => [
    {
      name: "Sarah Chen",
      location: "New York, NY",
      rating: 5,
      review: "Amazing experience! Got a gourmet meal for half the price. The food was fresh and delicious. Definitely doing this again!",
      avatar: "SC",
      date: "2 days ago"
    },
    {
      name: "Michael Rodriguez",
      location: "Los Angeles, CA",
      rating: 5,
      review: "Love this concept! Not only am I saving money, but I'm also helping reduce food waste. Win-win!",
      avatar: "MR",
      date: "5 days ago"
    },
    {
      name: "Emma Thompson",
      location: "Chicago, IL",
      rating: 5,
      review: "The variety of restaurants is incredible. I've discovered so many new places in my neighborhood through this app.",
      avatar: "ET",
      date: "1 week ago"
    },
    {
      name: "David Park",
      location: "Seattle, WA",
      rating: 5,
      review: "Perfect for my busy lifestyle. Quick pickup, amazing deals, and the app is super easy to use. Highly recommend!",
      avatar: "DP",
      date: "3 days ago"
    },
    {
      name: "Lisa Anderson",
      location: "Austin, TX",
      rating: 5,
      review: "I've saved over $200 this month alone! The quality of food is always top-notch. This is a game-changer.",
      avatar: "LA",
      date: "4 days ago"
    },
    {
      name: "James Wilson",
      location: "Miami, FL",
      rating: 5,
      review: "Supporting local businesses while saving money feels great. The selection updates constantly with new options!",
      avatar: "JW",
      date: "6 days ago"
    }
  ]

  const duplicatedReviews = [...reviews, ...reviews, ...reviews]

  return (
    <section className="py-20 md:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gray-900 bg-clip-text text-transparent">
              What Our Customers Say
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Join thousands of happy customers saving money and fighting food waste
            </p>
          </motion.div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex gap-6"
          animate={{
            x: -1 * (reviews.length * 400),
          }}
          transition={{
            duration: reviews.length * 8,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop"
          }}
        >
          {duplicatedReviews.map((review, index) => (
            <motion.div
              key={index}
              className="shrink-0 w-[380px]"
              transition={{ duration: 0.3 }}
            >
              <div className="relative h-full bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow duration-300">
                <div className="absolute inset-0 bg-linear-to-br from-red-500/5 via-transparent to-orange-500/5 rounded-2xl" />
                
                <div className="absolute -top-3 -left-3 bg-red-600 rounded-full p-2.5 shadow-lg">
                  <Quote className="w-4 h-4 text-white" />
                </div>

                <div className="relative">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="w-4 h-4 fill-amber-400 text-amber-400" 
                      />
                    ))}
                  </div>

                  <p className="text-gray-700 text-sm leading-relaxed mb-6 min-h-20">
                    "{review.review}"
                  </p>

                  <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent mb-4" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-linear-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                        {review.avatar}
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {review.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {review.location}
                        </p>
                      </div>
                    </div>

                    <span className="text-xs text-gray-400">
                      {review.date}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
