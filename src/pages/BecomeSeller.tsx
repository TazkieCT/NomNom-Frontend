import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useAuth } from "../contexts/AuthContext"

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function BecomeSeller() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()

  useEffect(() => {
    if (user?.role === 'seller') {
      navigate('/dashboard', { replace: true })
    }
  }, [user, navigate])

  async function handleApply() {
    setLoading(true)
    setError("")

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/auth/apply-seller`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upgrade account')
      }

      updateUser(data.user)
      
      navigate('/create-store', { 
        state: { message: 'Congratulations! You are now a seller. Create your store to get started.' } 
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (user?.role === 'seller') {
    return null
  }

  return (
    <main className="min-h-[72vh] py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Become a Seller
          </h1>
          <p className="text-lg text-gray-600">
            Join our marketplace and help reduce food waste while growing your business
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Reduce Food Waste</h3>
            <p className="text-sm text-gray-600">
              Sell surplus food at discounted prices instead of throwing it away. Help the environment while earning revenue.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Reach New Customers</h3>
            <p className="text-sm text-gray-600">
              Connect with eco-conscious customers looking for great deals on quality food from local businesses.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Easy to Use</h3>
            <p className="text-sm text-gray-600">
              Simple dashboard to manage your store, list products, and track orders. Get started in minutes.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How it works</h2>
          
          <div className="space-y-6 mb-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Upgrade to Seller Account</h3>
                <p className="text-gray-600">Click the button below to upgrade your customer account to a seller account instantly.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Create Your Store</h3>
                <p className="text-gray-600">Set up your store profile with name, location, and operating hours.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">List Your Products</h3>
                <p className="text-gray-600">Add surplus food items with photos, descriptions, and discounted prices.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Start Selling</h3>
                <p className="text-gray-600">Receive orders from customers and manage them through your seller dashboard.</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ready to get started?</h3>
            <p className="text-gray-600 mb-6">
              By becoming a seller, you agree to our Seller Terms and Conditions and commit to maintaining quality standards.
            </p>
            
            <button
              onClick={handleApply}
              disabled={loading}
              className="w-full md:w-auto px-8 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Upgrading Account..." : "Upgrade to Seller Account"}
            </button>
          </div>
        </div>
      </motion.div>
    </main>
  )
}
