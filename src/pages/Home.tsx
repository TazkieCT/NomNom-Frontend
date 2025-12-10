import ImpactStats from "../components/impact-stats";
import Hero from "../components/hero";
import HowItWorks from "../components/how-it-works";
import CustomerReviews from "../components/customer-reviews";
import RatingTab from "../components/RatingTab";
import CTASection from "../components/cta-section";

export default function Home() {
  return (
    <div>
      <Hero />
      <HowItWorks />
      <ImpactStats />
      <CustomerReviews />
      <CTASection />
      <RatingTab />
    </div>
  )
}
