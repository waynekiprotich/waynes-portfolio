export const PROJECT_TYPES = [
  { id: 'business-website', label: 'Business Website' },
  { id: 'landing-page', label: 'Landing Page' },
  { id: 'portfolio', label: 'Portfolio Website' },
  { id: 'ecommerce', label: 'E-commerce Store' },
  { id: 'saas', label: 'SaaS Platform' },
  { id: 'marketplace', label: 'Marketplace' },
  { id: 'mobile-app', label: 'Mobile App' },
  { id: 'custom-web-app', label: 'Custom Web Application' },
  { id: 'other', label: 'Other' },
]

export const TIMELINES = [
  { id: 'asap', label: 'ASAP' },
  { id: '1-month', label: '1 Month' },
  { id: '2-months', label: '2 Months' },
  { id: '3-months', label: '3+ Months' },
  { id: 'flexible', label: 'Flexible' },
]

export const BUDGETS = [
  'Under KES 10,000',
  'KES 10,000 – 30,000',
  'KES 30,000 – 100,000',
  'KES 100,000 – 250,000',
  'KES 250,000+',
]

export const WIZARD_STEPS = [
  { id: 1, title: 'Contact', eyebrow: 'Step 1' },
  { id: 2, title: 'Project Details', eyebrow: 'Step 2' },
  { id: 3, title: 'Timeline & Budget', eyebrow: 'Step 3' },
]

export const INITIAL_ESTIMATOR_DATA = {
  contact: {
    fullName: '',
    email: '',
    phone: '',
  },
  projectType: '',
  description: '',
  timeline: '',
  budget: '',
}