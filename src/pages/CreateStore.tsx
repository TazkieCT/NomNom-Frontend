import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { useAuth } from "../contexts/AuthContext"

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function CreateStore() {
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [mapsLink, setMapsLink] = useState("")
  const [openHours, setOpenHours] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message)
      window.history.replaceState({}, document.title)
    }
  }, [location])

  useEffect(() => {
    if (user && user.role !== 'seller') {
      navigate('/become-seller', { replace: true })
    }
  }, [user, navigate])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const token = localStorage.getItem('token')
      const storeData: any = {
        name: name.trim(),
        address: address.trim(),
        openHours: openHours.trim()
      }

      if (mapsLink) {
        storeData.mapsLink = mapsLink.trim()
      }

      const response = await fetch(`${API_URL}/stores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(storeData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create store')
      }

      navigate('/dashboard', { 
        state: { message: 'Store created successfully! Start adding your products.' } 
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (!user || user.role !== 'seller') {
    return null
  }

  return (
    <main className="min-h-[72vh] py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="max-w-2xl mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Create Your Store
          </h1>
          <p className="text-gray-600">
            Set up your store profile to start selling on NomNom
          </p>
        </div>

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

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 outline-none"
                placeholder="e.g., Rocky Rooster"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address <span className="text-red-600">*</span>
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 outline-none"
                placeholder="123 Main St, New York, NY 10001"
                rows={3}
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Google Maps Link (Optional)
              </label>
              <input
                type="url"
                value={mapsLink}
                onChange={(e) => setMapsLink(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 outline-none"
                placeholder="https://www.google.com/maps/embed?pb=..."
                disabled={loading}
              />
              <p className="mt-1 text-xs text-gray-500">
                Go to Google Maps → Share → Embed a map → Copy the iframe src URL
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Opening Hours <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={openHours}
                onChange={(e) => setOpenHours(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 outline-none"
                placeholder="e.g., Mon-Fri: 8AM-9PM, Sat-Sun: 9AM-10PM"
                required
                disabled={loading}
              />
              <p className="mt-1 text-xs text-gray-500">
                Describe your operating hours in a format customers can easily understand
              </p>
            </div>

            <div className="border-t pt-6">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating Store..." : "Create Store"}
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 Tips for success</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Choose a clear, memorable name for your store</li>
            <li>• Provide accurate address information for customer pickup</li>
            <li>• Keep your opening hours up to date</li>
            <li>• Adding a Google Maps link helps customers find you easily</li>
          </ul>
        </div>
      </motion.div>
    </main>
  )
}
