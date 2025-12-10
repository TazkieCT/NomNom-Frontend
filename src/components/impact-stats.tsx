"use client"

import { motion } from "framer-motion"

export default function ImpactStats() {
  const stats = [
    {
      value: "12,483",
      label: "meals saved",
      delay: 0.2,
      position: "top-left",
    },
    {
      value: "3.2 tons",
      label: "of food waste prevented",
      delay: 0.3,
      position: "top-right",
    },
    {
      value: "7,892",
      label: "happy users",
      delay: 0.4,
      position: "bottom-left",
    },
    {
      value: "134",
      label: "partner restaurants",
      delay: 0.5,
      position: "bottom-right",
    },
  ]

  return (
    <section className="py-20 md:py-28 bg-white relative">
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[120px] rotate-180">
          <path d="M0,0 Q600,120 1200,0 L1200,120 L0,120 Z" className="fill-red-600"></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-16 md:pt-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Impact</h2>
          <p className="text-gray-600 text-lg">
            Together, we're making a difference in reducing food waste and helping the community
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center items-center mb-8 md:mb-0"
          >
            <div className="relative z-10">
              <img
                src="/paperbag.png"
                alt="Food bag"
                className="w-64 h-64 md:w-80 md:h-80 object-contain drop-shadow-2xl"
              />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:hidden mt-12">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: stat.delay, duration: 0.5 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-black text-red-600 mb-2">{stat.value}</div>
                <div className="text-gray-700 font-medium text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="hidden md:block">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="absolute top-0 left-0 text-left"
            >
              <div className="max-w-xs">
                <div className="text-5xl font-black text-red-600 mb-2">{stats[0].value}</div>
                <div className="text-gray-700 font-medium text-lg">{stats[0].label}</div>
              </div>
              <svg className="absolute top-1/2 left-full w-48 h-48" style={{ transform: "translateY(-50%)" }}>
                <motion.path
                  d="M 0 0 C 60 0, 80 40, 100 60 C 110 70, 120 100, 192 120"
                  stroke="#000000"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="8,4"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                />
              </svg>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute top-0 right-0 text-right"
            >
              <div className="max-w-xs ml-auto">
                <div className="text-5xl font-black text-red-600 mb-2">{stats[1].value}</div>
                <div className="text-gray-700 font-medium text-lg">{stats[1].label}</div>
              </div>
              <svg className="absolute top-1/2 right-full w-48 h-48" style={{ transform: "translateY(-50%)" }}>
                <motion.path
                  d="M 192 0 C 132 0, 112 40, 92 60 C 82 70, 72 100, 0 120"
                  stroke="#000000"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="8,4"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                />
              </svg>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="absolute bottom-0 left-0 text-left"
            >
              <div className="max-w-xs">
                <div className="text-5xl font-black text-red-600 mb-2">{stats[2].value}</div>
                <div className="text-gray-700 font-medium text-lg">{stats[2].label}</div>
              </div>
              <svg className="absolute bottom-1/2 left-full w-48 h-48" style={{ transform: "translateY(50%)" }}>
                <motion.path
                  d="M 0 192 C 60 192, 80 152, 100 132 C 110 122, 120 92, 192 72"
                  stroke="#000000"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="8,4"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </svg>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute bottom-0 right-0 text-right"
            >
              <div className="max-w-xs ml-auto">
                <div className="text-5xl font-black text-red-600 mb-2">{stats[3].value}</div>
                <div className="text-gray-700 font-medium text-lg">{stats[3].label}</div>
              </div>
              <svg className="absolute bottom-1/2 right-full w-48 h-48" style={{ transform: "translateY(50%)" }}>
                <motion.path
                  d="M 192 192 C 132 192, 112 152, 92 132 C 82 122, 72 92, 0 72"
                  stroke="#000000"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="8,4"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                />
              </svg>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
