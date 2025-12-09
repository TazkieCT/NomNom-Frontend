import AvailableDeals from "../components/available-deals";
import Hero from "../components/hero";
import HowItWorks from "../components/how-it-works";
import CustomerReviews from "../components/customer-reviews";
import RatingTab from "../components/RatingTab";

export default function Home() {
  return (
    <div>
      <Hero />
      <HowItWorks />
      <AvailableDeals />
      <CustomerReviews />
      <RatingTab />
    </div>
  )
}
