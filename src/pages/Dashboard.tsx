import { useEffect, useState } from "react"
import { useLocation, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { useAuth } from "../contexts/AuthContext"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

interface Statistics {
  totalOrders: number
  pendingOrders: number
  completedOrders: number
  activeProducts: number
  totalRevenue: number
}

interface Order {
  _id: string
  status: string
  finalPrice: number
  createdAt: string
}

interface ChartData {
  date: string
  orders: number
  revenue: number
}

export default function Dashboard() {
  const [successMessage, setSuccessMessage] = useState("")
  const [hasStore, setHasStore] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Statistics>({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    activeProducts: 0,
    totalRevenue: 0
  })
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [statusData, setStatusData] = useState<{ name: string; value: number }[]>([])
  const [topCategories, setTopCategories] = useState<{ name: string; count: number }[]>([])
  const location = useLocation()
  const { user } = useAuth()

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message)
      window.history.replaceState({}, document.title)
    }
  }, [location])

  useEffect(() => {
    async function checkStore() {
      if (!user || user.role !== 'seller') {
        setLoading(false)
        return
      }

      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`${API_URL}/stores/my/store`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          setHasStore(true)
          const token = localStorage.getItem('token')
          if (token) {
            await fetchStatistics(token)
          }
        } else if (response.status === 404) {
          setHasStore(false)
        } else {
          setHasStore(false)
        }
      } catch (error) {
        console.error('Error checking store:', error)
        setHasStore(false)
      } finally {
        setLoading(false)
      }
    }

    async function fetchStatistics(token: string) {
      try {
        const [ordersRes, foodsRes, categoriesRes] = await Promise.all([
          fetch(`${API_URL}/orders`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${API_URL}/foods/my/foods`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${API_URL}/categories`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ])

        if (ordersRes.ok && foodsRes.ok) {
          const orders: Order[] = await ordersRes.json()
          const foods = await foodsRes.json()
          const categories = categoriesRes.ok ? await categoriesRes.json() : []

          const completedOrders = orders.filter((o: any) => o.status === 'completed')
          const totalRevenue = completedOrders.reduce((sum: number, order: any) => sum + order.finalPrice, 0)

          setStats({
            totalOrders: orders.length,
            pendingOrders: orders.filter((o: any) => o.status === 'pending').length,
            completedOrders: completedOrders.length,
            activeProducts: foods.filter((f: any) => f.isAvailable).length,
            totalRevenue
          })

          const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date()
            date.setDate(date.getDate() - (6 - i))
            return date.toISOString().split('T')[0]
          })

          const chartDataMap = new Map<string, { orders: number; revenue: number }>()
          last7Days.forEach(date => {
            chartDataMap.set(date, { orders: 0, revenue: 0 })
          })

          orders.forEach((order: Order) => {
            const orderDate = new Date(order.createdAt).toISOString().split('T')[0]
            if (chartDataMap.has(orderDate)) {
              const data = chartDataMap.get(orderDate)!
              data.orders += 1
              if (order.status === 'completed') {
                data.revenue += order.finalPrice
              }
            }
          })

          const formattedChartData: ChartData[] = last7Days.map(date => ({
            date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            orders: chartDataMap.get(date)!.orders,
            revenue: chartDataMap.get(date)!.revenue
          }))

          setChartData(formattedChartData)

          const statusCount = orders.reduce((acc: any, order: Order) => {
            acc[order.status] = (acc[order.status] || 0) + 1
            return acc
          }, {})

          setStatusData(Object.entries(statusCount).map(([name, value]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value: value as number
          })))

          const categoryCount: Record<string, number> = {}
          const categoryNames = new Map(categories.map((c: any) => [c._id, c.name]))

          orders.forEach((order: any) => {
            if (order.items && Array.isArray(order.items)) {
              order.items.forEach((item: any) => {
                const food = item.foodId
                if (food && food.category) {
                  const categoryId = typeof food.category === 'string' 
                    ? food.category 
                    : food.category._id || food.category
                  
                  let categoryName = categoryNames.get(categoryId)
                  
                  if (!categoryName && typeof food.category === 'object' && food.category.name) {
                    categoryName = food.category.name
                  }
                  
                  if (categoryName) {
                    categoryCount[categoryName as string] = (categoryCount[categoryName as string] || 0) + (item.quantity || 1)
                  }
                }
              })
            }
          })

          console.log('Category Count:', categoryCount)

          const sortedCategories = Object.entries(categoryCount)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5)

          setTopCategories(sortedCategories)
        }
      } catch (error) {
        console.error('Error fetching statistics:', error)
      }
    }

    checkStore()
  }, [user])

  return (
    <main className="min-h-[72vh] py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="max-w-7xl mx-auto"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Seller Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {user?.username}! Manage your store and products here.
          </p>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-600">{successMessage}</p>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/seller-orders"
            className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Total Orders</h3>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
            <p className="text-sm text-gray-500 mt-1">
              {stats.pendingOrders > 0 ? `${stats.pendingOrders} pending` : 'All processed'}
            </p>
          </Link>

          <Link
            to="/manage-products"
            className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Active Products</h3>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.activeProducts}</p>
            <p className="text-sm text-gray-500 mt-1">
              {stats.activeProducts === 0 ? 'Add your first product' : 'Available for sale'}
            </p>
          </Link>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              Rp {stats.totalRevenue.toLocaleString('id-ID')}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {stats.completedOrders} completed {stats.completedOrders === 1 ? 'order' : 'orders'}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
              </div>
            ) : hasStore === false ? (
              <>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Create your store first!
                </h2>
                <p className="text-gray-600 mb-6">
                  Before you can add products, you need to set up your store with name, location, and operating hours.
                </p>
                <Link
                  to="/create-store"
                  className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create Your Store
                </Link>
              </>
            ) : (
              <>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend (Last 7 Days)</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={chartData} margin={{ left: 10, right: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis 
                          width={80}
                          tickFormatter={(value) => {
                            if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
                            if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
                            return value.toString()
                          }}
                        />
                        <Tooltip formatter={(value: number) => `Rp ${value.toLocaleString('id-ID')}`} />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" stroke="#dc2626" strokeWidth={2} name="Revenue" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders (Last 7 Days)</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="orders" fill="#dc2626" name="Orders" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status Distribution</h3>
                    <div className="space-y-3">
                      {statusData.map((status, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-gray-700 font-medium">{status.name}</span>
                          <div className="flex items-center gap-3">
                            <div className="w-48 bg-gray-200 rounded-full h-4">
                              <div
                                className="bg-red-600 h-4 rounded-full"
                                style={{ width: `${(status.value / stats.totalOrders) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-gray-600 text-sm w-12 text-right">{status.value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Categories</h3>
                    <div className="space-y-3">
                      {topCategories.length > 0 ? (
                        topCategories.map((category, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-red-600">#{index + 1}</span>
                              <span className="text-gray-700 font-medium">{category.name}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-32 bg-gray-200 rounded-full h-4">
                                <div
                                  className="bg-red-600 h-4 rounded-full"
                                  style={{ 
                                    width: `${topCategories[0] ? (category.count / topCategories[0].count) * 100 : 0}%` 
                                  }}
                                ></div>
                              </div>
                              <span className="text-gray-600 text-sm w-12 text-right">{category.count}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-4">No sales data yet</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <Link
                        to="/add-product"
                        className="flex items-center gap-3 p-4 bg-red-50 hover:bg-red-100 rounded-lg transition"
                      >
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span className="font-medium text-gray-900">Add New Product</span>
                      </Link>
                      <Link
                        to="/manage-products"
                        className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
                      >
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <span className="font-medium text-gray-900">Manage Products</span>
                      </Link>
                      <Link
                        to="/seller-orders"
                        className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
                      >
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <span className="font-medium text-gray-900">View Orders</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </main>
  )
}
