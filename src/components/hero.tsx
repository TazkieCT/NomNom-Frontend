"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

export default function Hero() {
  const heroImg = [
      "/hero1.jpg",
      "/hero2.jpg",
      "/hero3.jpg"
  ]

  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
  const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImg.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (    
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        {heroImg.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center animate-slow-zoom transition-opacity duration-1000 ${
                index === currentImage ? "opacity-100 animate-fade-in" : "opacity-0"
              }`}
              style={{
                backgroundImage: `url('${image}')`,
              }}
            ></div>
          ))}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-center">
            <span className="text-red-500">Delicious</span>
            <span className="text-white"> Food</span>
          </h1>
          <p className="text-gray-200 text-lg md:text-base mb-8 text-center">
            Save money while saving the planet. Buy surplus food from local restaurants at up to 70% off. Pick up
            yourself and enjoy quality meals that would otherwise go to waste.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="marketplace">
              <button className="px-8 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all hover:scale-105 font-medium shadow-lg">
                Browse Deals
              </button>
            </Link>
            <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-lg hover:bg-white/20 transition-all font-medium">
              Learn More
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-[120px]"
        >
          <path
            d="M0,0 Q600,120 1200,0 L1200,120 L0,120 Z"
            className="fill-red-600"
          ></path>
        </svg>
      </div>
    </section>
  )
}
