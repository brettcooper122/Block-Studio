import React from 'react'
import { CheckIcon } from 'lucide-react'
import { PricingPlan } from '../../data/pricingPlans'
import { RollingNumber } from './RollingNumber'
import { MagneticButton } from './MagneticButton'

interface BoldPlanCardProps {
  plan: PricingPlan
  billingPeriod: 'monthly' | 'yearly'
}

export function BoldPlanCard({ plan, billingPeriod }: BoldPlanCardProps) {
  const isYearly = billingPeriod === 'yearly'
  const hl = Boolean(plan.highlighted)
  const yearlySavings = plan.monthlyPrice * 12 - plan.yearlyTotal
  const displayPrice = isYearly ? Math.round(plan.yearlyTotal / 12) : plan.monthlyPrice

  const strong = hl ? 'text-primitives-colours-brand-white' : 'text-primitives-colours-brand-orange100'
  const muted = hl ? 'text-primitives-colours-brand-orange800' : 'text-primitives-colours-brand-charcoal400'

  return (
    <article
      aria-label={`${plan.name} plan`}
      className={`flex h-full flex-col rounded-radius-xl p-padding-m ${
        hl ? 'bg-primitives-colours-brand-orange200' : 'bg-primitives-colours-brand-white'
      }`}
    >
      <div className="flex h-8 items-center justify-between gap-spacing-sm">
        <h3 className={`text-2xl font-medium ${strong}`}>{plan.name}</h3>
        {plan.badge && (
          <span className="flex h-8 items-center rounded-radius-xxl bg-primitives-colours-brand-white px-padding-sm font-caption text-xs font-semibold text-primitives-colours-brand-orange100">
            {plan.badge}
          </span>
        )}
      </div>
      <p className={`mt-spacing-xsm min-h-[48px] text-base ${muted}`}>{plan.description}</p>

      <div className="mt-spacing-l flex items-baseline gap-spacing-xsm">
        <span className={`inline-flex items-start text-6xl font-medium leading-none tracking-tighter ${strong}`}>
          $<RollingNumber value={displayPrice} />
        </span>
        <span className={`text-base ${muted}`}>/month</span>
      </div>
      <p className={`mt-spacing-xsm text-sm ${muted}`}>
        {isYearly ? `Billed $${plan.yearlyTotal.toLocaleString()} annually` : 'Billed monthly'}
      </p>
      <div className="mt-spacing-sm">
        <span
          className={`inline-flex h-7 items-center rounded-radius-xxl px-padding-sm font-caption text-xs font-semibold ${
            hl
              ? 'bg-primitives-colours-brand-orange100 text-primitives-colours-brand-white'
              : 'bg-primitives-colours-brand-orange900 text-primitives-colours-brand-orange100'
          }`}
        >
          {isYearly
            ? `You save $${yearlySavings.toLocaleString()} a year`
            : `Save $${yearlySavings.toLocaleString()} a year with yearly`}
        </span>
      </div>

      <div
        className={`my-spacing-l border-t ${
          hl ? 'border-primitives-colours-brand-orange300' : 'border-primitives-colours-brand-charcoal900'
        }`}
      />

      <p className={`text-sm font-medium ${strong}`}>{plan.featuresIntro}</p>
      <ul className="mt-spacing-m grow space-y-spacing-sm">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-spacing-sm">
            <span
              aria-hidden="true"
              className={`mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                hl
                  ? 'bg-primitives-colours-brand-white text-primitives-colours-brand-orange200'
                  : 'bg-primitives-colours-brand-orange900 text-primitives-colours-brand-orange200'
              }`}
            >
              <CheckIcon className="h-3 w-3" strokeWidth={3} />
            </span>
            <span className={`text-sm ${hl ? 'text-primitives-colours-brand-white' : 'text-primitives-colours-brand-charcoal100'}`}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-spacing-xl flex flex-col gap-spacing-xsm">
        <MagneticButton variant={hl ? 'inverse' : 'primary'} fullWidth>
          {plan.ctaLabel}
        </MagneticButton>
        {plan.secondaryCtaLabel && (
          <MagneticButton variant="outline" fullWidth>
            {plan.secondaryCtaLabel}
          </MagneticButton>
        )}
      </div>
    </article>
  )
}
