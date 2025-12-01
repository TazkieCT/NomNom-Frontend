import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Users, Store, Leaf, ArrowRight } from "lucide-react"

export default function AboutUs() {
  const stats = [
    { label: "Weekly Deals", value: "1,200+", suffix: "deals" },
    { label: "Meals Saved", value: "35k+", suffix: "meals" },
    { label: "Happy Users", value: "4.8★", suffix: "rating" },
  ]

  const features = [
    {
      icon: Users,
      title: "For Diners",
      description: "Discover high-value meals nearby and help reduce food waste. Great for budget-conscious eaters who love variety.",
    },
    {
      icon: Store,
      title: "For Restaurants",
      description: "Turn unsold inventory into revenue with targeted promotions and simple redemption flows.",
    },
    {
      icon: Leaf,
      title: "For Communities",
      description: "Support local businesses while improving food access and lowering environmental impact.",
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-red-100 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-20" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
                Food that
                <br />
                <span className="italic text-red-600">deserves</span> a plate
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed mb-8 max-w-lg">
                We connect hungry people with surplus food from local restaurants. 
                Less waste, more taste, better prices.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/marketplace"
                  className="group inline-flex items-center gap-2 px-7 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-bold shadow-lg hover:shadow-xl"
                >
                  Explore Deals
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/become-seller"
                  className="inline-flex items-center gap-2 px-7 py-4 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-all font-bold"
                >
                  Become a Partner
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="grid grid-cols-2 gap-6"
            >
              {stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + idx * 0.1, duration: 0.5 }}
                  className={`${
                    idx === 2 ? 'col-span-2' : ''
                  } bg-gray-50 rounded-3xl p-8 border-2 border-gray-200 hover:border-red-600 transition-all`}
                >
                  <div className="text-5xl font-black text-gray-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500 uppercase tracking-wide font-semibold">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative py-24 bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-1 h-full bg-white transform -rotate-12" />
          <div className="absolute top-0 left-1/2 w-1 h-full bg-white transform -rotate-12" />
          <div className="absolute top-0 left-3/4 w-1 h-full bg-white transform -rotate-12" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Built for <span className="italic text-red-500">everyone</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Food lovers, restaurants, and communities all win
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                  className="relative group"
                >
                  <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 group-hover:border-red-500 transition-all h-full">
                    <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all">
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold mb-4">
                      {feature.title}
                    </h3>

                    <p className="text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="md:row-span-2 bg-red-600 rounded-3xl p-12 text-white relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-4xl font-black mb-6">
                  Our Mission
                </h2>
                <p className="text-xl leading-relaxed opacity-90">
                  We believe delicious food should find a plate — not the bin. 
                  Our platform makes discovery, claiming, and redemption quick and reliable 
                  for both diners and merchants.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-gray-100 rounded-3xl p-8"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Reduce Waste
              </h3>
              <p className="text-gray-700">
                Help restaurants minimize food waste while enjoying quality meals at great prices
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gray-100 rounded-3xl p-8"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Support Local
              </h3>
              <p className="text-gray-700">
                Every deal claimed helps local restaurants thrive and reach new customers
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              Ready to save
              <br />
              <span className="italic text-red-600">food & money?</span>
            </h2>
            
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-3 px-10 py-5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-bold text-xl shadow-2xl hover:shadow-3xl"
            >
              Get Started Now
              <ArrowRight className="w-6 h-6" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
