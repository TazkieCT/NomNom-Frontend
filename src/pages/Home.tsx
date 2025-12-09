import AvailableDeals from "../components/available-deals";
import Hero from "../components/hero";
import HowItWorks from "../components/how-it-works";
import CustomerReviews from "../components/customer-reviews";
import RatingTab from "../components/RatingTab";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div>
      <Hero />
      <HowItWorks />
      <AvailableDeals />
      <CustomerReviews />
      
      <section className="py-24 bg-white">
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

      <RatingTab />
    </div>
  )
}
