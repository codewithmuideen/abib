import {
  Building2,
  ClipboardCheck,
  Droplets,
  Eye,
  Handshake,
  House,
  Lightbulb,
  MessageSquare,
  ShieldCheck,
  Target,
  Wrench,
  Settings2,
} from 'lucide-react'

const photo = (name) => `/images/photos/${name}.webp`

// Hero slideshow: bright, wide photography shown under a light overlay.
export const heroSlides = [
  { src: photo('hero-tradesman'), alt: 'Tradesperson in protective gear working with tools on site', position: '70% center' },
  { src: photo('team-in-home'), alt: 'Tradespeople carrying out work inside a home', position: '65% center' },
  { src: photo('builder-frame'), alt: 'Builder working on a timber frame against a blue sky', position: '60% center' },
]

export const heroTiles = [
  {
    tone: 'sky',
    icon: 'droplets',
    title: 'Plumbing Services',
    text: 'Plumbing support, repairs and installations for homes, commercial premises and managed properties.',
    to: '/services#plumbing-services',
  },
  { image: { src: photo('bright-bathroom'), alt: 'Bright modern bathroom with round mirrors, basin and freestanding bath' } },
  {
    tone: 'royal',
    icon: 'building',
    title: 'Building Management',
    text: 'Organised maintenance and building management support that keeps properties running smoothly.',
    to: '/services#building-management-solutions',
  },
  { image: { src: photo('worker-portrait'), alt: 'Tradesperson in a hard hat and safety glasses beside a service panel', position: '18% center' } },
]

export const images = {
  about: { src: photo('planning-drawings'), alt: 'Technical drawings being reviewed and annotated on a desk' },
  aboutSecondary: { src: photo('plumbing-pipework'), alt: 'Grey pipework, valves and gauges mounted on a brick wall' },
  services: { src: photo('bright-bathroom'), alt: 'Bright modern bathroom with round mirrors, basin and freestanding bath' },
  aboutHero: { src: photo('team-in-home'), alt: 'Tradespeople carrying out work inside a home' },
  contact: { src: photo('london-aerial'), alt: 'Aerial view of London and the River Thames' },
  quote: { src: photo('bright-kitchen'), alt: 'Bright white kitchen with island and mixer tap' },
  blog: { src: photo('residential-block'), alt: 'Modern multi-storey residential building against a blue sky' },
  aboutTeam: { src: photo('site-team'), alt: 'Construction team in high-visibility clothing on a building site' },
  review: { src: photo('bright-office'), alt: 'Bright office with desks beside large windows' },
  cta: { src: photo('builder-frame'), alt: 'Builder working on a timber frame against a blue sky' },
  approach: { src: photo('plans-toolbox'), alt: 'Plans being drawn up beside a toolbox and fittings' },
  privacy: { src: photo('bright-office'), alt: 'Bright office with desks beside large windows' },
}

export const services = [
  {
    slug: 'plumbing-services',
    title: 'Plumbing Services',
    icon: Droplets,
    image: { src: photo('plumbing-pipework'), alt: 'Pipework, valves and pressure gauges installed on a wall' },
    summary: 'Plumbing support for homes, commercial premises and managed properties, planned around how each building is used.',
    detail:
      'From day-to-day plumbing needs to planned improvements, we work with property owners, occupiers and managers to keep water systems working as they should. We take time to understand the property and agree a sensible approach before work begins.',
    points: ['Domestic and commercial properties', 'Planned and responsive work', 'Clear scope agreed before starting'],
  },
  {
    slug: 'building-maintenance',
    title: 'Building Maintenance',
    icon: Building2,
    image: { src: photo('building-site'), alt: 'Building team carrying out works on a construction site' },
    summary: 'Practical maintenance that helps buildings stay safe, presentable and fully operational throughout the year.',
    detail:
      'Buildings need ongoing care to perform well. We help clients organise and carry out maintenance tasks so issues are dealt with properly and properties remain fit for the people who use them.',
    points: ['Routine and reactive tasks', 'Communal and shared areas', 'Organised, tidy working'],
  },
  {
    slug: 'property-maintenance',
    title: 'Property Maintenance',
    icon: House,
    image: { src: photo('property-interior'), alt: 'Bright, well-kept open-plan living space in a modern property' },
    summary: 'Responsive and preventative upkeep for residential and commercial premises, helping protect the value of each property.',
    detail:
      'Whether you manage a single home or a wider portfolio, we can help with the general upkeep that keeps properties in good order, and keep you informed about what has been done.',
    points: ['Residential and commercial premises', 'Preventative upkeep', 'Straightforward updates'],
  },
  {
    slug: 'plumbing-repairs',
    title: 'Plumbing Repairs',
    icon: Wrench,
    image: { src: photo('tap-repair'), alt: 'Close-up of a chrome tap and basin being assessed for repair' },
    summary: 'Professional repairs for leaks, fixtures, fittings and other plumbing faults that need attention.',
    detail:
      'When something goes wrong, you need it looked at properly. We assess the issue, explain what we find and carry out the agreed repair with care for your property.',
    points: ['Leaks, taps and fittings', 'Fault assessment', 'Explained before work begins'],
  },
  {
    slug: 'installation-services',
    title: 'Installation Services',
    icon: Settings2,
    image: { src: photo('bathroom-installation'), alt: 'Newly fitted bathroom with shower enclosure, basin and vanity' },
    summary: 'Installation work for plumbing systems, fixtures and building improvements, tailored to the property.',
    detail:
      'New fixtures and systems should be installed neatly and correctly. We plan installation work around the space, the client’s requirements and the practicalities of the building.',
    points: ['Fixtures and fittings', 'Bathroom and kitchen plumbing', 'Planned around the space'],
  },
  {
    slug: 'building-management-solutions',
    title: 'Building Management Solutions',
    icon: ClipboardCheck,
    image: { src: photo('modern-building'), alt: 'Modern building with timber cladding and large windows' },
    summary: 'Organised building management support that keeps operational needs and property upkeep moving forward.',
    detail:
      'Managing a building involves many moving parts. We support owners and managers with the coordination of maintenance and building-related work so that properties keep running smoothly.',
    points: ['Coordination of works', 'Single point of contact', 'Clear communication throughout'],
  },
]

export const values = [
  {
    title: 'Professional Approach',
    icon: ShieldCheck,
    text: 'We treat every property and every client with care, courtesy and respect.',
  },
  {
    title: 'Reliable Communication',
    icon: MessageSquare,
    text: 'You will know what is happening, what we have found and what comes next.',
  },
  {
    title: 'Quality-Focused Work',
    icon: Target,
    text: 'We aim to do the job properly, with attention to how the finished work performs.',
  },
  {
    title: 'Practical Solutions',
    icon: Lightbulb,
    text: 'Sensible recommendations that suit the property, the budget and the timescale.',
  },
  {
    title: 'Customer-Focused Service',
    icon: Handshake,
    text: 'We listen first, so the work reflects what you actually need.',
  },
  {
    title: 'Attention to Detail',
    icon: Eye,
    text: 'The small things matter, from a tidy site to a clear handover.',
  },
]

export const approach = [
  { number: '01', title: 'Understand', text: 'Understand the client’s property requirements and expectations.' },
  { number: '02', title: 'Assess', text: 'Review the requirements and determine an appropriate solution.' },
  { number: '03', title: 'Deliver', text: 'Carry out the agreed work professionally.' },
  { number: '04', title: 'Support', text: 'Maintain clear communication throughout the process.' },
]

// Illustrative imagery only. Replace with genuine Abib project photography when available.
export const portfolio = [
  { title: 'Plumbing installations', category: 'Plumbing', src: photo('kitchen-tap'), alt: 'Water running from a modern kitchen mixer tap', span: 'lg:col-span-5 lg:row-span-2' },
  { title: 'Commercial building environments', category: 'Commercial', src: photo('residential-block'), alt: 'Multi-storey residential and commercial building', span: 'lg:col-span-4' },
  { title: 'Property improvements', category: 'Property', src: photo('bathroom-modern'), alt: 'Freestanding bath and basin in a light, modern bathroom', span: 'lg:col-span-3' },
  { title: 'Building maintenance', category: 'Maintenance', src: photo('site-team'), alt: 'Building team in high-visibility clothing on site', span: 'lg:col-span-7' },
]
