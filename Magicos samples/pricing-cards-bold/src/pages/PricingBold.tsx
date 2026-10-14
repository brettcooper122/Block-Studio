import React, { useRef, useState } from 'react'
import { PillHeader } from '../components/pricing-bold/PillHeader'
import { BoldHero } from '../components/pricing-bold/BoldHero'
import { LogoMarquee } from '../components/pricing-bold/LogoMarquee'
import { BoldBillingSwitch } from '../components/pricing-bold/BoldBillingSwitch'
import { BoldPlanCard } from '../components/pricing-bold/BoldPlanCard'
import { BoldFaq } from '../components/pricing-bold/BoldFaq'
import { pricingPlans } from '../data/pricingPlans'
import { useDirectionalReveal } from '../hooks/useDirectionalReveal'
import { useVelocitySkew } from '../hooks/useVelocitySkew'

export function PricingBold() {
  // `?billing=yearly` opens the page on yearly prices.
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>(() =>
    new URLSearchParams(window.location.search).get('billing') === 'yearly' ? 'yearly' : 'monthly',
  )
  const pageRef = useRef<HTMLDivElement>(null)

  useDirectionalReveal(pageRef)
  useVelocitySkew(pageRef)

  return (
    <div
      ref={pageRef}
      className="w-full min-w-[1440px] min-h-screen bg-primitives-colours-brand-orange900 font-host"
    >
      <PillHeader />
      <main>
        <BoldHero />
        <LogoMarquee />

        <section
          id="plans"
          aria-labelledby="bold-plans-heading"
          className="bg-primitives-colours-brand-orange900 px-padding-l py-padding-xl"
        >
          <div className="mx-auto max-w-7xl">
            <div data-reveal className="flex flex-col items-center text-center">
              <h2
                id="bold-plans-heading"
                className="text-5xl font-medium tracking-tighter text-primitives-colours-brand-orange100"
              >
                Pick the plan that fits.
              </h2>
              <div className="mt-spacing-l">
                <BoldBillingSwitch
                  selected={billingPeriod}
                  onChange={setBillingPeriod}
                  yearlyDiscountLabel="Save 20%"
                />
              </div>
            </div>

            <div className="mt-spacing-xl grid grid-cols-3 items-stretch gap-spacing-m">
              {pricingPlans.map((plan) => (
                <div key={plan.id} data-skew className="h-full">
                  <div data-reveal className="h-full">
                    <BoldPlanCard plan={plan} billingPeriod={billingPeriod} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <BoldFaq />
      </main>
    </div>
  )
}
