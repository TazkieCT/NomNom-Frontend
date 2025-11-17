import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

type FAQItem = {
  question: string;
  answer: string;
};

const FAQ_DATA: FAQItem[] = [
  {
    question: "What is NomNom and how does it work?",
    answer:
      `NomNom is a marketplace that connects food lovers with curated, time-sensitive deals from nearby restaurants and food vendors. Restaurants post discounted offers for extra inventory or special promos. You browse deals, claim a voucher, and redeem it according to the merchant's redemption instructions. The platform makes it simple to discover new places and get great value while helping merchants reduce waste and reach more customers.`,
  },
  {
    question: "How do I claim and redeem a deal?",
    answer:
      `When you see a deal you like, click "Claim" or "Buy" (depending on the offer). You'll receive a voucher in your account and by email. Each voucher shows the merchant's redemption instructions — some require showing the voucher at checkout, others require scanning a QR code. Make sure to check any time or date restrictions on the voucher before visiting the merchant.`,
  },
  {
    question: "What payment methods are accepted?",
    answer:
      `We accept the most common payment methods available in your region (credit/debit cards and major digital wallets). For some promotions, merchants may also allow pay-at-venue redemption — that detail will be shown on the deal. All payments are processed through secure, PCI-compliant providers.`,
  },
  {
    question: "Can I get a refund if something goes wrong?",
    answer:
      `Refunds depend on the merchant's terms and the reason for the refund. If the voucher is invalid, the merchant refused redemption, or there was a technical issue on our side, reach out to our support with the voucher code and details — we'll investigate and help resolve the situation. For merchant-level issues (for example, the venue closed unexpectedly), we typically coordinate with the merchant to issue a refund or replacement offer.`,
  },
  {
    question: "How long are vouchers valid?",
    answer:
      `Each voucher has its own validity window that will be clearly displayed when you claim the deal (start/end date and any blackout hours). Some vouchers are only valid during specific times or days; others last longer. Always check the voucher details before you plan your visit.`,
  },
  {
    question: "Can I transfer or share a voucher?",
    answer:
      `Voucher transfer policies vary by merchant. Many vouchers are tied to the account that claimed them and require ID or the original purchaser to redeem. If the merchant allows transfer, that will be noted in the voucher terms. If you need to share or transfer, contact support and the merchant first to confirm.`,
  },
  {
    question: "How do restaurants join NomNom?",
    answer:
      `Restaurants can sign up via our merchant onboarding page and create deals through a simple dashboard. We guide merchants through setting availability, quantity limits, pricing, and redemption instructions. Our team can also help optimize deals for maximum reach and minimal waste. If you'd like help onboarding your restaurant, contact our sales team through the merchant link at the bottom of the site.`,
  },
  {
    question: "Is my personal data safe?",
    answer:
      `Yes — we take privacy and security seriously. We store only the information needed to operate the service, secure it using industry-standard practices, and never sell your personal data. For details, please read our Privacy Policy (link in the footer), which explains data collection, usage, retention, and your rights.`,
  },
  {
    question: "Do you offer delivery or just pickup?",
    answer:
      `Deal types vary by merchant. Some offers are pickup-only, some allow delivery through integrated partners, and others might be dine-in only. Delivery availability is displayed on each deal page. If delivery is offered, you'll see delivery fees and estimated times before confirming the order.`,
  },
  {
    question: "How can I contact support?",
    answer:
      `For fastest help, use the "Help" or "Support" link in the footer to open a support ticket — include your voucher code, a clear description of the issue, and any relevant screenshots. You can also email support@nomnom.example (replace with actual support address) for non-urgent inquiries. We strive to respond within one business day.`,
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  function toggle(index: number) {
    setOpenIndex((prev) => (prev === index ? null : index));
  }

  const contentTransition = shouldReduceMotion
    ? { duration: 0.18, ease: "easeOut" }
    : { type: "spring", stiffness: 260, damping: 24 };
  const chevronTransition = shouldReduceMotion
    ? { duration: 0.15 }
    : { type: "spring", stiffness: 320, damping: 28 };

  return (
    <div>
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px" }}>
        <section style={{ textAlign: "center", marginBottom: 28 }}>
          <h1 style={{ fontSize: 34, margin: 0, color: "red" }}>Frequently Asked Questions</h1>
          <p style={{ marginTop: 12, color: "#444", lineHeight: 1.6 }}>
            Answers to the most common questions about using NomNom from claiming deals and
            redemption to payments, refunds, and merchant policies. Can't find what you need? Our
            support team is happy to help.
          </p>
        </section>

        <section>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 10,
            }}
            aria-label="FAQ list"
          >
            {FAQ_DATA.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <motion.div
                  key={i}
                  layout
                  transition={contentTransition as any}
                  style={{
                    borderRadius: 10,
                    overflow: "hidden",
                    boxShadow: "0 6px 20px rgba(23,23,23,0.06)",
                    border: "1px solid rgba(20,20,20,0.04)",
                    background: "#fff",
                  }}
                >
                    <motion.button
                    onClick={() => toggle(i)}
                    aria-expanded={isOpen}
                    layout
                    whileHover={shouldReduceMotion ? undefined : { scale: 1.005 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.995 }}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "18px 20px",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontSize: 18, fontWeight: 600 }}>{item.question}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={chevronTransition as any}
                      style={{
                        display: "inline-block",
                        width: 22,
                        height: 22,
                        lineHeight: "22px",
                        textAlign: "center",
                        borderRadius: 6,
                        background: isOpen ? "#111" : "#f0f0f0",
                        color: isOpen ? "#fff" : "#333",
                        fontWeight: 700,
                      }}
                      aria-hidden
                    >
                      +
                    </motion.span>
                  </motion.button>

                  <AnimatePresence initial={false} mode="wait">
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={contentTransition as any}
                        style={{ overflow: "hidden" }}
                      >
                        <div style={{ padding: "18px 20px", color: "#333", lineHeight: 1.7 }}>
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
