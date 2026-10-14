import type { ComponentType } from 'react'
import {
  Activity,
  BookOpen01,
  Building02,
  Building07,
  CheckVerified01,
  ClockRewind,
  Code02,
  CreditCard01,
  Edit05,
  File06,
  Globe01,
  Heart,
  Key01,
  LifeBuoy01,
  Link01,
  Lock01,
  MessageChatCircle,
  Rocket01,
  Server01,
  Shield01,
  ShieldTick,
  Signal01,
  Users01,
  Announcement01,
} from '@untitledui/icons'

type IconComponent = ComponentType<{ className?: string }>

export type NavLink = {
  label: string
  description: string
  href: string
  icon: IconComponent
}

export type NavGroup = {
  heading?: string
  links: NavLink[]
}

export type NavItem = {
  id: string
  label: string
  href?: string
  groups?: NavGroup[]
}

export const announcement = {
  text: 'New: automated SOC 2 evidence collection is live',
  linkLabel: 'Learn more',
  href: '#',
}

export const navigationItems: NavItem[] = [
  {
    id: 'platform',
    label: 'Platform',
    groups: [
      {
        links: [
          { label: 'Secure Vault', description: 'Encrypted storage for every record', href: '#', icon: Lock01 },
          { label: 'Access Control', description: 'Roles, SSO and fine-grained policies', href: '#', icon: Key01 },
          { label: 'Threat Detection', description: 'Real-time anomaly alerts', href: '#', icon: Activity },
          { label: 'Audit Logs', description: 'Tamper-proof history of every action', href: '#', icon: ClockRewind },
          { label: 'Integrations', description: 'Connect your cloud, HR and ticketing tools', href: '#', icon: Link01 },
        ],
      },
    ],
  },
  {
    id: 'solutions',
    label: 'Solutions',
    groups: [
      {
        heading: 'By size',
        links: [
          { label: 'Startups', description: 'Ship secure from day one', href: '#', icon: Rocket01 },
          { label: 'Mid-market', description: 'Scale controls as you grow', href: '#', icon: Building02 },
          { label: 'Enterprise', description: 'Custom policies and dedicated support', href: '#', icon: Building07 },
        ],
      },
      {
        heading: 'By industry',
        links: [
          { label: 'Healthcare', description: 'Protect patient data end to end', href: '#', icon: Heart },
          { label: 'Financial services', description: 'Meet strict regulatory demands', href: '#', icon: CreditCard01 },
          { label: 'Public sector', description: 'Sovereign, auditable infrastructure', href: '#', icon: Globe01 },
        ],
      },
    ],
  },
  {
    id: 'resources',
    label: 'Resources',
    groups: [
      {
        links: [
          { label: 'Documentation', description: 'Guides to set up and configure', href: '#', icon: BookOpen01 },
          { label: 'API reference', description: 'Endpoints, SDKs and examples', href: '#', icon: Code02 },
          { label: 'Security blog', description: 'Research and best practices', href: '#', icon: Edit05 },
          { label: 'Customer stories', description: 'How teams protect their data', href: '#', icon: Users01 },
          { label: 'Changelog', description: 'Latest product updates', href: '#', icon: Announcement01 },
          { label: 'System status', description: 'Live uptime and incidents', href: '#', icon: Signal01 },
        ],
      },
    ],
  },
  {
    id: 'compliance',
    label: 'Compliance',
    groups: [
      {
        links: [
          { label: 'SOC 2', description: 'Type II controls, continuously monitored', href: '#', icon: CheckVerified01 },
          { label: 'ISO 27001', description: 'Certified information security', href: '#', icon: Shield01 },
          { label: 'HIPAA', description: 'Safeguards for health information', href: '#', icon: Heart },
          { label: 'GDPR', description: 'Privacy rights and data residency', href: '#', icon: File06 },
          { label: 'Trust Center', description: 'Reports, policies and subprocessors', href: '#', icon: ShieldTick },
        ],
      },
    ],
  },
  { id: 'pricing', label: 'Pricing', href: '#' },
  {
    id: 'contact',
    label: 'Contact',
    groups: [
      {
        links: [
          { label: 'Talk to sales', description: 'Plans, pricing and demos', href: '#', icon: MessageChatCircle },
          { label: 'Customer support', description: 'Get help from our team', href: '#', icon: LifeBuoy01 },
          { label: 'Partner program', description: 'Resell or integrate with us', href: '#', icon: Server01 },
          { label: 'Press', description: 'Media kit and inquiries', href: '#', icon: Announcement01 },
        ],
      },
    ],
  },
]
