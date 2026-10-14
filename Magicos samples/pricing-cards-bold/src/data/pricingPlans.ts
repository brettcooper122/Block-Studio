export type PricingPlan = {
  id: string
  name: string
  description: string
  monthlyPrice: number
  yearlyTotal: number
  featuresIntro: string
  features: string[]
  ctaLabel: string
  secondaryCtaLabel?: string
  highlighted?: boolean
  badge?: string
}

export const pricingPlans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Core protection for small teams getting started with secure data.',
    monthlyPrice: 34,
    yearlyTotal: 326,
    featuresIntro: 'Includes:',
    features: [
      'End-to-end encryption for all data',
      'Daily data backups',
      'Basic compliance certifications',
      'Standard access controls',
      '30-day audit logs',
      'Two-factor authentication',
    ],
    ctaLabel: 'Choose Starter',
  },
  {
    id: 'pro',
    name: 'Professional',
    description: 'Advanced security and compliance for growing businesses.',
    monthlyPrice: 54,
    yearlyTotal: 518,
    featuresIntro: 'Everything in Starter, plus:',
    features: [
      'Enterprise-grade encryption',
      'Hourly data backups',
      'Advanced compliance certifications',
      'Role-based access controls',
      '90-day audit logs',
      'Multi-factor authentication',
      'Data breach alerts',
      'Vulnerability scanning',
    ],
    ctaLabel: 'Choose Professional',
    highlighted: true,
    badge: 'Best value',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Custom security, dedicated support, and full compliance coverage.',
    monthlyPrice: 150,
    yearlyTotal: 1440,
    featuresIntro: 'Everything in Professional, plus:',
    features: [
      'Military-grade encryption protocols',
      'Real-time data backups',
      'Comprehensive compliance suite',
      'Custom access control policies',
      'Unlimited audit history',
      'Biometric authentication options',
      'Advanced threat detection',
      '24/7 security monitoring',
      'Dedicated security team',
      'Custom security policies',
    ],
    ctaLabel: 'Choose Enterprise',
    secondaryCtaLabel: 'Contact sales',
  },
]
