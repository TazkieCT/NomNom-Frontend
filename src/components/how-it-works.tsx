"use client"

import { Search, CreditCard, ShoppingBag } from "lucide-react"
import { useState } from "react"

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    {
      icon: Search,
      title: "Browse Deals",
      description: "Explore surplus food from nearby restaurants at discounted prices",
      image: "/how_it_works1.jpeg"
    },
    {
      icon: CreditCard,
      title: "Reserve & Pay",
      description: "Select your meals and complete your purchase securely online",
      image: "/how_it_works2.jpeg"
    },
    {
      icon: ShoppingBag,
      title: "Pick Up",
      description: "Collect your delicious food during the specified pickup window",
      image: "/how_it_works3.jpeg"
    },
  ]

  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-red-600 relative">
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-[120px] rotate-180"
        >
          <path
            d="M0,0 Q600,120 1200,0 L1200,120 L0,120 Z"
            className="fill-red-600"
          ></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">How It Works</h2>
          <p className="text-red-50 text-lg">Save money and reduce food waste in three simple steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            {steps.map((step, index) => {
              const IconComponent = step.icon
              const isActive = activeStep === index
              return (
                <div
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${
                    isActive 
                      ? 'bg-white text-red-600 shadow-lg scale-105' 
                      : 'bg-red-700 text-white hover:shadow-md hover:scale-102'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${isActive ? 'bg-red-600' : 'bg-red-800'}`}>
                      <IconComponent 
                        className={`w-8 h-8 text-white`} 
                        strokeWidth={1.5} 
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                      <p className={`${isActive ? 'text-gray-700' : 'text-red-50'}`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="sticky top-8">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={steps[activeStep].image}
                alt={steps[activeStep].title}
                className="w-full h-[500px] object-cover transition-opacity duration-300"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent p-6">
                <p className="text-white text-lg font-semibold">
                  Step {activeStep + 1}: {steps[activeStep].title}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-[120px] rotate-180"
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
