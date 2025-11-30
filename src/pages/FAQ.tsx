import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

type FAQItem = {
  question: string
  answer: string
}

const FAQ_DATA: FAQItem[] = [
  {
    question: "What is NomNom and how does it work?",
    answer:
      "NomNom is a marketplace that connects food lovers with curated, time-sensitive deals from nearby restaurants and food vendors. Restaurants post discounted offers for extra inventory or special promos. You browse deals, claim a voucher, and redeem it according to the merchant's redemption instructions. The platform makes it simple to discover new places and get great value while helping merchants reduce waste and reach more customers.",
  },
  {
    question: "How do I claim and redeem a deal?",
    answer:
      'When you see a deal you like, click "Claim" or "Buy" (depending on the offer). You\'ll receive a voucher in your account and by email. Each voucher shows the merchant\'s redemption instructions — some require showing the voucher at checkout, others require scanning a QR code. Make sure to check any time or date restrictions on the voucher before visiting the merchant.',
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "We accept the most common payment methods available in your region (credit/debit cards and major digital wallets). For some promotions, merchants may also allow pay-at-venue redemption — that detail will be shown on the deal. All payments are processed through secure, PCI-compliant providers.",
  },
  {
    question: "Can I get a refund if something goes wrong?",
    answer:
      "Refunds depend on the merchant's terms and the reason for the refund. If the voucher is invalid, the merchant refused redemption, or there was a technical issue on our side, reach out to our support with the voucher code and details — we'll investigate and help resolve the situation. For merchant-level issues (for example, the venue closed unexpectedly), we typically coordinate with the merchant to issue a refund or replacement offer.",
  },
  {
    question: "How long are vouchers valid?",
    answer:
      "Each voucher has its own validity window that will be clearly displayed when you claim the deal (start/end date and any blackout hours). Some vouchers are only valid during specific times or days; others last longer. Always check the voucher details before you plan your visit.",
  },
  {
    question: "Can I transfer or share a voucher?",
    answer:
      "Voucher transfer policies vary by merchant. Many vouchers are tied to the account that claimed them and require ID or the original purchaser to redeem. If the merchant allows transfer, that will be noted in the voucher terms. If you need to share or transfer, contact support and the merchant first to confirm.",
  },
  {
    question: "How do restaurants join NomNom?",
    answer:
      "Restaurants can sign up via our merchant onboarding page and create deals through a simple dashboard. We guide merchants through setting availability, quantity limits, pricing, and redemption instructions. Our team can also help optimize deals for maximum reach and minimal waste. If you'd like help onboarding your restaurant, contact our sales team through the merchant link at the bottom of the site.",
  },
  {
    question: "Is my personal data safe?",
    answer:
      "Yes — we take privacy and security seriously. We store only the information needed to operate the service, secure it using industry-standard practices, and never sell your personal data. For details, please read our Privacy Policy (link in the footer), which explains data collection, usage, retention, and your rights.",
  },
  {
    question: "Do you offer delivery or just pickup?",
    answer:
      "Deal types vary by merchant. Some offers are pickup-only, some allow delivery through integrated partners, and others might be dine-in only. Delivery availability is displayed on each deal page. If delivery is offered, you'll see delivery fees and estimated times before confirming the order.",
  },
  {
    question: "How can I contact support?",
    answer:
      'For fastest help, use the "Help" or "Support" link in the footer to open a support ticket — include your voucher code, a clear description of the issue, and any relevant screenshots. You can also email support@nomnom.example (replace with actual support address) for non-urgent inquiries. We strive to respond within one business day.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  function toggle(index: number) {
    setOpenIndex((prev) => (prev === index ? null : index))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Frequently Asked <span className="text-red-600">Questions</span>
            </h1>
            
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Answers to the most common questions about using NomNom from claiming deals and
              redemption to payments, refunds, and merchant policies. Can't find what you need? Our
              support team is happy to help.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4" role="list" aria-label="FAQ list">
            {FAQ_DATA.map((item, i) => {
              const isOpen = openIndex === i
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <motion.button
                    onClick={() => toggle(i)}
                    aria-expanded={isOpen}
                    whileHover={{ scale: 1.002 }}
                    whileTap={{ scale: 0.998 }}
                    className="w-full text-left px-6 py-5 bg-transparent border-none cursor-pointer flex justify-between items-center gap-4"
                  >
                    <span className="text-lg font-semibold text-gray-900 pr-4">
                      {item.question}
                    </span>
                    
                    <motion.div
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ type: "spring", stiffness: 320, damping: 28 }}
                      className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-lg font-bold transition-colors ${
                        isOpen 
                          ? "bg-red-600 text-white" 
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      +
                    </motion.div>
                  </motion.button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 24 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-2 text-gray-700 leading-relaxed">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Still have questions?
            </h2>
            <p className="text-gray-600 mb-6">
              Our support team is here to help you with any inquiries
            </p>
            <a
              href="mailto:support@nomnom.example"
              className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-semibold shadow-lg hover:shadow-xl"
            >
              Contact Support
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
