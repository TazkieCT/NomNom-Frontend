import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, MessageSquare, X, Send } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

export default function RatingTab() {
  const [isOpen, setIsOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [existingRating, setExistingRating] = useState<any>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (isOpen && user) {
      fetchMyRating()
    }
  }, [isOpen, user])

  const fetchMyRating = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/app-ratings/my/rating`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setExistingRating(data)
        setRating(data.rating)
        setComment(data.comment || "")
      } else if (response.status === 404) {
        setExistingRating(null)
        setRating(0)
        setComment("")
      }
    } catch (error) {
      console.error('Error fetching rating:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      setMessage({ type: 'error', text: 'Please sign in to rate the app' })
      setTimeout(() => setMessage(null), 3000)
      return
    }

    if (rating === 0) {
      setMessage({ type: 'error', text: 'Please select a rating' })
      setTimeout(() => setMessage(null), 3000)
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/app-ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating, comment })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: existingRating 
            ? 'Rating updated! It will appear after approval.' 
            : 'Thank you for your rating! It will appear after approval.'
        })
        setExistingRating(data)
        setTimeout(() => {
          setMessage(null)
          setIsOpen(false)
        }, 3000)
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to submit rating' })
        setTimeout(() => setMessage(null), 3000)
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-40 cursor-pointer bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition-all hover:scale-110"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <MessageSquare className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 right-0 w-full md:w-[450px] bg-white rounded-t-3xl shadow-2xl z-50 md:rounded-l-3xl md:rounded-tr-none md:bottom-0 md:right-0 md:top-auto md:h-auto max-h-[85vh]"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-100 p-2 rounded-full">
                      <Star className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Rate Our App</h3>
                      <p className="text-sm text-gray-500">Share your experience</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {existingRating && (
                  <div className={`mb-4 p-3 rounded-lg ${
                    existingRating.isApproved 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-yellow-50 border border-yellow-200'
                  }`}>
                    <p className={`text-sm ${
                      existingRating.isApproved ? 'text-green-700' : 'text-yellow-700'
                    }`}>
                      {existingRating.isApproved 
                        ? '✓ Your rating is published' 
                        : '⏳ Your rating is pending approval'}
                    </p>
                  </div>
                )}

                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-4 p-3 rounded-lg ${
                      message.type === 'success' 
                        ? 'bg-green-50 border border-green-200' 
                        : 'bg-red-50 border border-red-200'
                    }`}
                  >
                    <p className={`text-sm ${
                      message.type === 'success' ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {message.text}
                    </p>
                  </motion.div>
                )}

                {/* Rating Form */}
                <form onSubmit={handleSubmit}>
                  {/* Star Rating */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Your Rating *
                    </label>
                    <div className="flex gap-2 justify-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="transition-transform hover:scale-125"
                        >
                          <Star
                            className={`w-10 h-10 transition-colors ${
                              star <= (hoverRating || rating)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    {rating > 0 && (
                      <p className="text-center mt-2 text-sm text-gray-600">
                        {rating === 1 && "Poor"}
                        {rating === 2 && "Fair"}
                        {rating === 3 && "Good"}
                        {rating === 4 && "Very Good"}
                        {rating === 5 && "Excellent"}
                      </p>
                    )}
                  </div>

                  {/* Comment */}
                  <div className="mb-6">
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Feedback (Optional)
                    </label>
                    <textarea
                      id="comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                      placeholder="Tell us what you think about the app..."
                      maxLength={500}
                    />
                    <p className="text-xs text-gray-500 mt-1 text-right">
                      {comment.length}/500
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || rating === 0}
                    className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        {existingRating ? 'Update Rating' : 'Submit Rating'}
                      </>
                    )}
                  </button>
                </form>

                {/* Info */}
                <p className="text-xs text-gray-500 mt-4 text-center">
                  Your rating will be reviewed before appearing publicly
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
