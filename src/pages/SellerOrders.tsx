import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Store,
  Calendar,
  User,
  Package
} from "lucide-react"
import { useAuth } from "../contexts/AuthContext"

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

interface OrderItem {
  foodId: {
    _id: string
    name: string
    price: number
    images: string[]
  }
  quantity: number
}

interface Order {
  _id: string
  customerId: {
    _id: string
    username: string
  }
  storeId: {
    _id: string
    name: string
  }
  items: OrderItem[]
  totalPrice: number
  finalPrice: number
  status: 'pending' | 'completed' | 'cancelled'
  couponCode?: string
  createdAt: string
}

const statusConfig = {
  pending: { 
    label: 'Pending', 
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    icon: Clock 
  },
  completed: { 
    label: 'Completed', 
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: CheckCircle2 
  },
  cancelled: { 
    label: 'Cancelled', 
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: XCircle 
  }
}

export default function SellerOrders() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest')
  const [processingOrder, setProcessingOrder] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      navigate('/signin', { state: { from: '/seller-orders' } })
      return
    }

    if (user.role !== 'seller') {
      navigate('/')
      return
    }

    fetchOrders()
  }, [user, navigate])

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setOrders(data.sort((a: Order, b: Order) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ))
      } else {
        setError("Failed to load orders")
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      setError("An error occurred while loading orders")
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteOrder = async (orderId: string) => {
    setProcessingOrder(orderId)
    setError("")

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'completed' })
      })

      if (response.ok) {
        await fetchOrders()
      } else {
        const data = await response.json()
        setError(data.message || 'Failed to update order status')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setProcessingOrder(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const filteredAndSortedOrders = orders
    .filter(order => statusFilter === 'all' || order.status === statusFilter)
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB
    })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
              <Package className="w-6 h-6 text-red-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900">Store Orders</h1>
          </div>
          <p className="text-gray-600 mb-6">Manage and process customer orders</p>
          
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 cursor-pointer rounded-lg font-semibold text-sm transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Orders
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-4 py-2 cursor-pointer rounded-lg font-semibold text-sm transition-colors ${
                  statusFilter === 'pending'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`px-4 py-2 cursor-pointer rounded-lg font-semibold text-sm transition-colors ${
                  statusFilter === 'completed'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setStatusFilter('cancelled')}
                className={`px-4 py-2 cursor-pointer rounded-lg font-semibold text-sm transition-colors ${
                  statusFilter === 'cancelled'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Cancelled
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
                className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg font-semibold text-sm text-gray-700 hover:border-gray-300 transition-colors cursor-pointer focus:outline-none focus:border-red-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {filteredAndSortedOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {orders.length === 0 ? 'No orders yet' : 'No orders found'}
            </h2>
            <p className="text-gray-600">
              {orders.length === 0 
                ? 'Orders from customers will appear here.'
                : 'Try adjusting your filters to see more orders.'}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredAndSortedOrders.length}</span> {filteredAndSortedOrders.length === 1 ? 'order' : 'orders'}
              </p>
            </div>
            <div className="space-y-4">
              {filteredAndSortedOrders.map((order, index) => {
              const StatusIcon = statusConfig[order.status].icon
              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="w-5 h-5 text-gray-500" />
                          <h3 className="text-xl font-bold text-gray-900">{order.customerId.username}</h3>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(order.createdAt)}</span>
                        </div>
                      </div>
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 font-semibold text-sm ${statusConfig[order.status].color}`}>
                        <StatusIcon className="w-4 h-4" />
                        {statusConfig[order.status].label}
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                            {item.foodId.images && item.foodId.images[0] ? (
                              <img
                                src={item.foodId.images[0]}
                                alt={item.foodId.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-medium text-center px-1">
                                {item.foodId.name}
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{item.foodId.name}</p>
                            <p className="text-sm text-gray-600">
                              Quantity: {item.quantity} × Rp {item.foodId.price.toLocaleString('id-ID')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">
                              Rp {(item.foodId.price * item.quantity).toLocaleString('id-ID')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-semibold text-gray-900">
                          Rp {order.totalPrice.toLocaleString('id-ID')}
                        </span>
                      </div>
                      {order.couponCode && (
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-green-600 text-sm">Coupon ({order.couponCode})</span>
                          <span className="font-semibold text-green-600">
                            -Rp {(order.totalPrice - order.finalPrice).toLocaleString('id-ID')}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                        <span className="text-lg font-bold text-gray-900">Total</span>
                        <span className="text-2xl font-black text-gray-900">
                          Rp {order.finalPrice.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>

                    {order.status === 'pending' && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => handleCompleteOrder(order._id)}
                          disabled={processingOrder === order._id}
                          className="w-full py-3 px-4 cursor-pointer bg-green-50 border-2 border-green-200 text-green-700 rounded-xl font-semibold hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                          {processingOrder === order._id ? 'Processing...' : 'Mark as Completed'}
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
