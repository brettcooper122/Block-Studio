import React, { useState } from 'react'
import { faqCategories, pricingFaqs } from '../../data/pricingFaqs'
import { BoldFaqItem } from './BoldFaqItem'

type Category = (typeof faqCategories)[number]

export function BoldFaq() {
  const [category, setCategory] = useState<Category>('All')
  const [openQuestion, setOpenQuestion] = useState<string | null>(
    pricingFaqs[0]?.question ?? null,
  )

  const visibleFaqs =
    category === 'All' ? pricingFaqs : pricingFaqs.filter((faq) => faq.category === category)

  const handleCategoryChange = (next: Category) => {
    setCategory(next)
    const first = next === 'All' ? pricingFaqs[0] : pricingFaqs.find((faq) => faq.category === next)
    setOpenQuestion(first?.question ?? null)
  }

  return (
    <section
      id="faq"
      aria-labelledby="bold-faq-heading"
      className="bg-primitives-colours-brand-white px-padding-l py-padding-xl"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-[380px_1fr] gap-spacing-xxl">
        <div data-reveal className="self-start">
          <h2
            id="bold-faq-heading"
            className="text-6xl font-medium leading-none tracking-tighter text-primitives-colours-brand-charcoal100"
          >
            Questions, answered.
          </h2>
          <p className="mt-spacing-m text-base text-primitives-colours-brand-charcoal400">
            Billing, plans, refunds and how we look after your data.
          </p>
          <div
            role="tablist"
            aria-label="Filter questions by topic"
            className="mt-spacing-l flex flex-wrap gap-spacing-xsm"
          >
            {faqCategories.map((item) => {
              const active = item === category
              return (
                <button
                  key={item}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls="bold-faq-list"
                  onClick={() => handleCategoryChange(item)}
                  className={`flex h-10 items-center rounded-radius-xxl border px-padding-sm text-sm font-medium transition-colors duration-150 ease-out active:scale-[0.96] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primitives-colours-brand-orange300 focus-visible:ring-offset-2 ${
                    active
                      ? 'border-primitives-colours-brand-charcoal100 bg-primitives-colours-brand-charcoal100 text-primitives-colours-brand-white'
                      : 'border-primitives-colours-brand-charcoal900 bg-primitives-colours-brand-white text-primitives-colours-brand-charcoal400 hover:border-primitives-colours-brand-charcoal800 hover:text-primitives-colours-brand-charcoal100'
                  }`}
                >
                  {item}
                </button>
              )
            })}
          </div>
        </div>

        <ul id="bold-faq-list" role="tabpanel" data-reveal className="space-y-spacing-sm">
          {visibleFaqs.map((faq, index) => (
            <BoldFaqItem
              key={faq.question}
              id={`bold-faq-${index}`}
              question={faq.question}
              answer={faq.answer}
              isOpen={openQuestion === faq.question}
              onToggle={() =>
                setOpenQuestion(openQuestion === faq.question ? null : faq.question)
              }
            />
          ))}
        </ul>
      </div>
    </section>
  )
}
