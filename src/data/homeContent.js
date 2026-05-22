import { images } from '../assets/images'

export const navLinks = [
  { label: 'Home', href: '#home', active: true },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Resources', href: '#' },
  { label: 'Events', href: '#' },
  { label: 'Career', href: '#' },
  { label: 'Contact', href: '#contact' },
]

export const aboutFeatures = [
  {
    title: 'SUBJECT MATTER EXPERT',
    items: ['Service Delivery', 'Tactical and Emergency Response', 'Research and Development'],
    icon: images.icons.expert,
  },
  {
    title: 'DEDICATED CUSTOMER SERVICE',
    items: ['Concierge', 'Support', 'Customer Delight'],
    icon: images.icons.service,
  },
  {
    title: 'PROVIDE INNOVATIVE SOLUTION',
    items: ['Alliances', 'Turnkey Solutions'],
    icon: images.icons.innovation,
  },
  {
    title: 'MARKET SHARE',
    items: ['Partner Friendly', 'Client References'],
    icon: images.icons.market,
  },
]

export const clientIndustries = [
  { label: 'Oil and Gas', icon: images.clients.oil },
  { label: 'Power and Energy', icon: images.clients.power },
  { label: 'Law Firms', icon: images.clients.law },
  { label: 'Government', icon: images.clients.gov },
  { label: 'Conglomerate', icon: images.clients.conglomerate },
]

export const services = [
  {
    code: 'VAPT',
    title: 'VULNERABIITY ASSESSMENT AND PENETRATIION TESTING',
    description:
      'We assess security for mobile, network, and web apps, finding vulnerabilities and recommending fixes.',
    icon: images.services.vapt,
  },
  {
    code: 'DFIR',
    title: 'DIGITAL FORENSIC AND INCIDENT RESPONSE',
    description:
      'Process of investigating and responding to cyber incidents by collecting and analyzing digital data to mitigate the impact and prevent future attacks.',
    icon: images.services.dfir,
  },
  {
    code: 'BRS',
    title: 'BRAND REPUTATION SERVICES',
    description:
      'Help businesses manage their online reputation by monitoring and addressing negative feedback to maintain a positive image and build customer trust.',
    icon: images.services.brs,
  },
  {
    code: 'CTI',
    title: 'CYBER THREAT INTELLIGENCE',
    description:
      'Collection, analysis, and sharing of information about cyber threats to develop strategies and enhance cybersecurity posture and protect against cyber threats.',
    icon: images.services.cti,
  },
  {
    code: 'SOC',
    title: 'SECURITY OPERATIONS CENTER',
    description:
      'Centralized facility that monitors and responds to security incidents in real-time to provide continuous defense against cyber threats.',
    icon: images.services.soc,
  },
  {
    code: 'CERT',
    title: 'COMPUTER EMERGENCY RESPONSE TEAM',
    description:
      'Dedicated cybersecurity experts ready to respond swiftly to security incidents, provide guidance, and develop best practices to enhance your posture.',
    icon: images.services.cert,
  },
]

export const whyChooseUs = [
  {
    title: 'Decade-long Expertise',
    description:
      "Our team comprises seasoned practitioners from diverse backgrounds, boasting over a decade of hands-on experience in the cybersecurity trenches. We've honed our skills, equipping clients with cutting-edge technologies and methodologies to combat a myriad of threats effectively.",
  },
  {
    title: 'End-to-End Solutions',
    description:
      "We prioritize delivering turnkey solutions, ensuring seamless end-to-end design and implementation of projects. From inception to execution, we're committed to providing comprehensive support, empowering clients with robust defenses against evolving cyber threats.",
  },
  {
    title: 'World-Class N/SOC Operations',
    description:
      'Our team of experts and partners has spearheaded the design, construction, and operation of world-class Network and Security Operations Centers (N/SOC). We offer a structured transition and development plan, ensuring clients and their staff are adept at leveraging these centers effectively.',
  },
  {
    title: 'Crisis Management Specialists',
    description:
      'We specialize in crisis management and risk aversion strategies, safeguarding your brand and business interests. With skilled strategists and investigators, we identify gaps and formulate a comprehensive plan of action to mitigate risks.',
  },
]

export const testimonials = [
  {
    quote:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
    name: 'Danny Wong',
    role: 'IT Head',
    avatar: images.avatars[0],
  },
  {
    quote:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
    name: 'Danny Wong',
    role: 'IT Head',
    avatar: images.avatars[1],
  },
]

export const blogPosts = [
  {
    title: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
    date: 'FEBRUARY 20, 2024',
    author: 'Willian Deguso',
    image: images.blog[0],
  },
  {
    title: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
    date: 'FEBRUARY 20, 2024',
    author: 'Willian Deguso',
    image: images.blog[1],
  },
  {
    title: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
    date: 'FEBRUARY 20, 2024',
    author: 'Willian Deguso',
    image: images.blog[2],
  },
]

export const footerServices = [
  'VULNERABIITY ASSESSMENT AND PENETRATIION TESTING',
  'DIGITAL FORENSIC AND INCIDENT RESPONSE',
  'BRAND REPUTATION SERVICES',
  'CYBER THREAT INTELLIGENCE',
]
