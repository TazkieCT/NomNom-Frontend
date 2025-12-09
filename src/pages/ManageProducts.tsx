import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

interface Food {
  _id: string
  name: string
  description: string
  price: number
  categoryId: { _id: string; name: string }
  isAvailable: boolean
  images: string[]
  filters: { _id: string; name: string }[]
}

export default function ManageProducts() {
  const [foods, setFoods] = useState<Food[]>([])
  const [loading, setLoading] = useState(true)
  const [successMessage, setSuccessMessage] = useState("")
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message)
      window.history.replaceState({}, document.title)
      setTimeout(() => setSuccessMessage(""), 5000)
    }
  }, [location])

  useEffect(() => {
    fetchFoods()
  }, [])

  const fetchFoods = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/foods/my/foods`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setFoods(data)
      }
    } catch (error) {
      console.error('Error fetching foods:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/foods/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setFoods(foods.filter(food => food._id !== id))
        setSuccessMessage('Product deleted successfully!')
        setTimeout(() => setSuccessMessage(""), 5000)
      }
    } catch (error) {
      console.error('Error deleting food:', error)
    } finally {
      setDeleteConfirm(null)
    }
  }

  const toggleAvailability = async (food: Food) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/foods/${food._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          isAvailable: !food.isAvailable
        })
      })

      if (response.ok) {
        const updatedFood = await response.json()
        setFoods(foods.map(f => f._id === food._id ? updatedFood : f))
      }
    } catch (error) {
      console.error('Error updating availability:', error)
    }
  }

  if (loading) {
    return (
      <main className="min-h-[72vh] py-12 px-4 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </main>
    )
  }

  return (
    <main className="min-h-[72vh] py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="max-w-7xl mx-auto"
      >
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center cursor-pointer text-gray-600 hover:text-gray-900 mb-4 transition"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                Manage Products
              </h1>
              <p className="text-gray-600">
                View, edit, and manage your food items
              </p>
            </div>
            <Link
              to="/add-product"
              className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Product
            </Link>
          </div>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-600">{successMessage}</p>
          </div>
        )}

        {foods.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              No products yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start by adding your first product to the marketplace
            </p>
            <Link
              to="/add-product"
              className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Your First Product
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {foods.map((food) => (
              <div key={food._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="relative h-48 bg-gray-200">
                  {food.images && food.images.length > 0 && food.images[0] ? (
                    <img
                      src={food.images[0]}
                      alt={food.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => toggleAvailability(food)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        food.isAvailable
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-500 text-white'
                      }`}
                    >
                      {food.isAvailable ? 'Available' : 'Unavailable'}
                    </button>
                  </div>
                </div>

                <div className="p-5">
                  <div className="mb-3">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {food.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {food.categoryId.name}
                    </p>
                  </div>

                  {food.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {food.description}
                    </p>
                  )}

                  {food.filters && food.filters.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {food.filters.map((filter) => (
                        <span
                          key={filter._id}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {filter.name}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-red-600">
                      Rp {food.price}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/edit-product/${food._id}`}
                      className="flex-1 px-4 py-2 bg-red-600 text-white text-center rounded-lg font-medium hover:bg-red-700 transition text-sm"
                    >
                      Edit
                    </Link>
                    {deleteConfirm === food._id ? (
                      <div className="flex-1 flex gap-2">
                        <button
                          onClick={() => handleDelete(food._id)}
                          className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition text-sm"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="flex-1 px-3 py-2 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400 transition text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(food._id)}
                        className="flex-1 px-4 py-2 border border-red-600 text-red-600 rounded-lg font-medium hover:bg-red-50 transition text-sm"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </main>
  )
}
