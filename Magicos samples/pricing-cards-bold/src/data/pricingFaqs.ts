export type FaqCategory = 'Billing' | 'Plans' | 'Refunds & terms' | 'Security & data'

export type PricingFaq = {
  category: FaqCategory
  question: string
  answer: string
}

export const faqCategories: Array<'All' | FaqCategory> = [
  'All',
  'Billing',
  'Plans',
  'Refunds & terms',
  'Security & data',
]

export const pricingFaqs: PricingFaq[] = [
  {
    category: 'Billing',
    question: 'How much do I save by paying annually?',
    answer:
      'Annual billing saves you 20% compared to paying month to month. You are billed once for the full year, and the equivalent monthly price is shown on each plan.',
  },
  {
    category: 'Billing',
    question: 'Which payment methods do you accept?',
    answer:
      'We accept all major credit and debit cards. Enterprise customers can also pay by invoice or bank transfer with net-30 terms.',
  },
  {
    category: 'Plans',
    question: 'Can I switch plans or billing periods later?',
    answer:
      'Yes. You can upgrade at any time and the change takes effect immediately, with the remaining balance prorated. Downgrades and switches from annual to monthly take effect at the end of your current billing period.',
  },
  {
    category: 'Plans',
    question: 'Do you offer a free trial?',
    answer:
      'Starter and Professional include a 14-day free trial with full access to every feature in the plan. No credit card is required to start.',
  },
  {
    category: 'Plans',
    question: 'Can I add more users to my plan?',
    answer:
      'Yes. Seats can be added at any time from your workspace settings and are prorated for the rest of your billing period.',
  },
  {
    category: 'Refunds & terms',
    question: 'What is your refund policy?',
    answer:
      'Monthly plans can be cancelled at any time and will not renew, but partial months are not refunded. Annual plans are eligible for a full refund within 14 days of purchase, and a prorated refund for unused months after that.',
  },
  {
    category: 'Refunds & terms',
    question: 'Are there contracts or minimum terms?',
    answer:
      'Starter and Professional plans have no minimum term beyond your chosen billing period. Enterprise agreements are tailored to your organization and typically run for 12 months or longer — our sales team can walk you through the details.',
  },
  {
    category: 'Security & data',
    question: 'What happens to my data if I cancel?',
    answer:
      'Your data stays encrypted and available for export for 30 days after your subscription ends. After that window, it is permanently deleted from our systems and backups.',
  },
  {
    category: 'Security & data',
    question: 'How is my data encrypted?',
    answer:
      'All data is encrypted in transit with TLS 1.3 and at rest with AES-256. Enterprise plans can bring their own keys for full control over encryption.',
  },
  {
    category: 'Security & data',
    question: 'Where is my data stored?',
    answer:
      'Data is hosted in SOC 2 and ISO 27001 certified data centers in the US and EU. Enterprise customers can choose a specific region for data residency.',
  },
]
