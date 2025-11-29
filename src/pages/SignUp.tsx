import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function SignUp() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      setLoading(false)
      return
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password)) {
      setError("Password must contain at least one letter and one number")
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username: name,
          email, 
          password,
          role: 'customer'
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      navigate('/signin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-[72vh] flex items-center justify-center px-4 py-12">
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-extrabold">Create your account</h1>
          <p className="mt-2 text-sm text-gray-600">Sign up to unlock local surplus food deals and save great meals.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Full name</span>
            <input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-100 outline-none" 
              placeholder="Jane Doe"
              required
              minLength={3}
              maxLength={20}
              disabled={loading}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Email</span>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-100 outline-none" 
              placeholder="you@example.com"
              required
              disabled={loading}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Password</span>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-100 outline-none" 
              placeholder="Create a password"
              required
              minLength={8}
              disabled={loading}
            />
            <p className="mt-1 text-xs text-gray-500">
              Must be at least 8 characters with letters and numbers
            </p>
          </label>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          By creating an account you agree to our <a className="text-red-600 hover:underline" href="#">Terms</a> and <a className="text-red-600 hover:underline" href="#">Privacy Policy</a>.
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm">Already have an account? <Link to="/signin" className="text-red-600 hover:underline">Sign in</Link></p>
        </div>
      </motion.section>
    </main>
  )
}
