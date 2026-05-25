import { images } from '../assets/images'

const defaultHero = images.serviceDetailHeroDefault
const cardIcons = {
  target: images.serviceTargetIcon,
  benefits: images.serviceBenefitsIcon,
  features: images.serviceFeaturesIcon,
}

export const serviceTopics = [
  {
    slug: 'vapt',
    code: 'VAPT',
    title: 'Vulnerability Assessment and Penetration Testing (VAPT)',
    summary: 'We assess security for mobile, network, and web apps, finding vulnerabilities and recommending fixes.',
    overview: `Our VAPT service understand the critical importance of securing software throughout its lifecycle. Our expert practitioners specialize in educating and implementing secure software development practices, whether it's following agile methodologies or traditional waterfall approaches. With their guidance, your organization can cultivate a robust application lifecycle that prioritizes security from conception to deployment.

Our consultants offer a comprehensive suite of services to fortify your applications against cyber threats. From conducting penetration testing and source code reviews to analyzing vulnerabilities in web and mobile applications, we leave no stone unturned in ensuring your digital assets remain protected. Our assessments align with industry best practices, including the OWASP Top 10 Risk Vulnerabilities, Logical Flaw Testing, Business Logic Flaw identification, and Source Code Review, among others.

With our VAPT service, you can proactively identify and address security vulnerabilities before they're exploited by malicious actors, safeguarding your organization's reputation and data integrity. Don't leave your software's security to chance-partner with us today to fortify your defenses and achieve peace of mind.`,
    heroImage: defaultHero,
    icon: images.services.vapt,
    cards: [
      {
        title: 'Primary Target Market',
        icon: cardIcons.target,
        items: [
          'Small and medium-sized businesses',
          'Large enterprises',
          'Government agencies',
          'Healthcare providers',
          'Financial institutions',
        ],
      },
      {
        title: 'Key Benefits',
        icon: cardIcons.benefits,
        items: [
          'Identify Security Vulnerabilities',
          'Ensure Regulatory Compliance',
          'Improve Security Posture',
          'Test Incident Response Plans',
          'Protect Customer Data',
        ],
      },
      {
        title: 'Features',
        icon: cardIcons.features,
        items: [
          'Assessment Planning',
          'Vulnerability Scanning',
          'Penetration Testing',
          'Risk Assessment',
          'Remediation Recommendations',
          'Compliance Reporting',
          'Ongoing Monitoring',
        ],
      },
    ],
  },
  {
    slug: 'dfir',
    code: 'DFIR',
    title: 'Digital Forensic and Incident Response (DFIR) service',
    summary: 'Process of investigating and responding to cyber incidents by collecting and analyzing digital data to mitigate the impact and prevent future attacks.',
    overview: `**DFIR** help respond to various cyber incident response engagements. Our team of forensicators and litigation experts have years of personal experience on the various cyber and data privacy laws to investigate, collect evidence and persecute the perpetrators.

Our reverse engineers can provide the full details of the malware capabilities; from how it was executed, creation of its persistence mechanisms and commands available to determine the kill chain model used by the threat actor. Knowing the attacker's strategy, we can fully determine the next steps required to do planning and remediation, then proper planning of the road map achieving resiliency.

Our intel analysts will try to provide attribution to understand further the persons of interest (POI), organizations they are affiliated with and ICT infrastructures.`,
    heroImage: images.serviceDetailHeroDfir,
    icon: images.services.dfir,
    cards: [
      {
        title: 'Primary Target Market',
        icon: cardIcons.target,
        items: ['Financial services', 'Healthcare', 'Government', 'Technology', 'E-commerce'],
      },
      {
        title: 'Key Benefits',
        icon: cardIcons.benefits,
        items: [
          'Faster Incident Response',
          'Expertise and Experience',
          'Evidence Preservation',
          'Threat Intelligence',
          'Compliance',
          'Reputation Management',
        ],
      },
      {
        title: 'Features',
        icon: cardIcons.features,
        items: [
          'Security Investigation',
          'Evidence Collection',
          'Analysis',
          'Incident Response',
          'Threat Intelligence',
          'Forensic Tools',
          'Reporting',
        ],
      },
    ],
  },
  {
    slug: 'brs',
    code: 'BRS',
    title: 'Brand Reputation Services (BRS)',
    summary: 'We assess security for mobile, network, and web apps, finding vulnerabilities and recommending fixes.',
    overview: `In today's digital landscape, maintaining a strong brand reputation is essential for success. At our Brand Reputation Services, we specialize in assessing the security of your mobile, network, and web applications, ensuring they are fortified against potential threats. Our expert team meticulously examines each aspect of your applications, identifying vulnerabilities and providing comprehensive recommendations for fixes.

Whether it's vulnerabilities in your mobile app's code, weaknesses in your network infrastructure, or potential threats lurking within your web applications, we leave no stone unturned in safeguarding your brand's reputation. Our thorough assessments aim to mitigate risks and enhance the overall security posture of your digital assets.

By partnering with our Brand Reputation Services, you can rest assured that your applications are fortified against cyber threats, preserving your brand's integrity and fostering trust among your customers. Don't let security vulnerabilities tarnish your reputation-reach out to us today to elevate your brand's defenses and safeguard its reputation for years to come.`,
    heroImage: defaultHero,
    icon: images.services.brs,
    cards: [
      {
        title: 'Primary Target Market',
        icon: cardIcons.target,
        items: [
          'Healthcare',
          'Finance',
          'Hospitality',
          'Government Agencies',
          'Consumer Goods',
          'Nonprofit Organizations',
          'Public Figures and Celebrities',
          'SMEs and Large Corporations',
        ],
      },
      {
        title: 'Key Benefits',
        icon: cardIcons.benefits,
        items: [
          'Protecting and Managing Online Reputation',
          'Mitigating Negative Publicity',
          'Maintaining Customer Trust',
          'Increasing Sales and Revenue',
        ],
      },
      {
        title: 'Features',
        icon: cardIcons.features,
        items: [
          'Monitoring and Analysis',
          'Reputation Management',
          'Crisis Management',
          'Brand Strategy',
          'Reporting and Analytics',
        ],
      },
    ],
  },
  {
    slug: 'cti',
    code: 'CTI',
    title: 'Cyber Threat Intelligence (CTI)',
    summary: 'Collection, analysis, and sharing of information about cyber threats to develop strategies and enhance cybersecurity posture and protect against cyber threats.',
    overview: `In today's ever-evolving digital landscape, staying ahead of cyber threats is paramount to safeguarding your organization's assets and reputation. Our Cyber Threat Intelligence service specializes in the collection, analysis, and sharing of crucial information about cyber threats. By leveraging our expertise, you can develop proactive strategies to enhance your cybersecurity posture and effectively protect against potential cyber attacks.

Our team is dedicated to securing the vast digital ecosystem for insights into emerging threats, malicious actors, and evolving attack techniques. Through meticulous analysis, we distill complex data into actionable intelligence that empowers you to make informed decisions and implement targeted security measures.

By partnering with our Cyber Threat Intelligence service, you gain access to a wealth of knowledge and expertise that helps you stay one step ahead of cyber adversaries. From threat detection and risk assessment to incident response planning, we provide the insights and support you need to fortify your defenses and protect your organization's digital assets. Don't wait until it's too late-take proactive steps to enhance your cybersecurity posture with our Cyber Threat Intelligence service. Contact us today to learn more about how we can help you mitigate risks, defend against cyber threats, and safeguard your organization's future.`,
    heroImage: defaultHero,
    icon: images.services.cti,
    cards: [
      {
        title: 'Primary Target Market',
        icon: cardIcons.target,
        items: ['Financial institutions', 'Healthcare', 'Energy', 'Water', 'Technology', 'Government'],
      },
      {
        title: 'Key Benefits',
        icon: cardIcons.benefits,
        items: [
          'Improved Threat Detection and Response',
          'Enhance Situational Awareness',
          'Compliance with Regulations',
          'Protection of Intellectual Property',
        ],
      },
      {
        title: 'Features',
        icon: cardIcons.features,
        items: [
          'Monitoring and Analysis',
          'Reputation Management',
          'Crisis Management',
          'Brand Strategy',
          'Reporting and Analytics',
        ],
      },
    ],
  },
  {
    slug: 'soc',
    code: 'SOC',
    title: 'Security Operations Center',
    summary: 'Centralized facility that monitors and responds to security incidents in real-time to provide continuous defense against cyber threats.',
    overview: `In today's digital age, the threat landscape is constantly evolving, making it crucial to have a robust defense against cyber threats. Our Security Operations Center (SOC) is your centralized facility dedicated to monitoring and responding to security incidents in real-time. With our proactive approach, we provide continuous defense to safeguard your organization against a wide range of cyber threats.

At our SOC, we combine cutting-edge technology with expert human analysis to ensure comprehensive threat detection and rapid response. Our team of skilled analysts is constantly vigilant, monitoring your network, systems, and applications around the clock. With real-time monitoring capabilities, we swiftly identify and mitigate security incidents, minimizing their impact on your organization.

By partnering with our SOC, you gain access to a dedicated team of security experts who are committed to protecting your digital assets and preserving your organization's reputation. Whether it's detecting unauthorized access attempts, thwarting malware infections, or responding to data breaches, we're here to provide the continuous defense you need to stay one step ahead of cyber threats.

Don't wait until it's too late-invest in proactive cybersecurity with our Security Operations Center. Contact us today to learn more about how we can help you fortify your defenses and achieve peace of mind in an increasingly complex threat landscape.`,
    heroImage: defaultHero,
    icon: images.services.soc,
    cards: [
      {
        title: 'Primary Target Market',
        icon: cardIcons.target,
        items: ['Financial institutions', 'Healthcare', 'Energy', 'Water', 'Technology', 'Government'],
      },
      {
        title: 'Key Benefits',
        icon: cardIcons.benefits,
        items: [
          'Improved Threat Detection and Response',
          'Enhance Situational Awareness',
          'Compliance with Regulations',
          'Protection of Intellectual Property',
        ],
      },
      {
        title: 'Features',
        icon: cardIcons.features,
        items: [
          'Monitoring and Analysis',
          'Reputation Management',
          'Crisis Management',
          'Brand Strategy',
          'Reporting and Analytics',
        ],
      },
    ],
  },
  {
    slug: 'cert',
    code: 'CERT',
    title: 'Computer Emergency Response Team (CERT)',
    summary: 'Group of cybersecurity experts that respond to security incidents, provide guidance and support to affected organizations, and develop best practices to enhance cybersecurity posture.',
    overview: `In today's fast-paced digital world, cyber threats can strike at any moment, posing serious risks to organizations of all sizes. Our Computer Emergency Response Team (CERT) is your dedicated group of cybersecurity experts ready to respond swiftly to security incidents, provide invaluable guidance and support to affected organizations, and develop best practices to enhance your cybersecurity posture.

At our CERT, we understand the urgency of cybersecurity incidents, which is why our team is available around the clock to provide rapid response and resolution. Whether it's mitigating the effects of a data breach, thwarting a malware attack, or responding to a sophisticated cyber threat, our experts have the knowledge and experience to handle any situation with precision and efficiency.

In addition to incident response, our CERT is committed to developing and sharing best practices to help organizations strengthen their cybersecurity defenses. By leveraging our expertise and insights, you can proactively identify and address vulnerabilities, implement robust security measures, and stay ahead of emerging threats.

Partnering with our CERT means gaining access to a dedicated team of cybersecurity professionals who are passionate about protecting your organization's digital assets and reputation. With our guidance and support, you can navigate the complex landscape of cyber threats with confidence, knowing that you have a trusted ally by your side.

Don't wait until it's too late-invest in proactive cybersecurity with our Computer Emergency Response Team. Contact us today to learn more about how we can help you safeguard your organization against cyber threats and achieve peace of mind in an ever-changing digital world.`,
    heroImage: defaultHero,
    icon: images.services.cert,
    cards: [
      {
        title: 'Primary Target Market',
        icon: cardIcons.target,
        items: [
          'Financial Services',
          'Healthcare',
          'Government',
          'SMEs',
          'Energy',
          'Transportation',
          'Telecommunications',
        ],
      },
      {
        title: 'Key Benefits',
        icon: cardIcons.benefits,
        items: [
          'Rapid Response to Cyber Threats',
          'Proactive Cybersecurity Measures',
          'Cost-Effective Solutions',
          'Compliance with Regulations',
        ],
      },
      {
        title: 'Features',
        icon: cardIcons.features,
        items: [
          'Incident Response',
          'Threat Intelligence',
          'Vulnerability Assessment',
          'Penetration Testing',
          'Compliance and Risk Management',
        ],
      },
    ],
  },
  {
    slug: 'tert',
    code: 'TERT',
    title: 'Tactical Emergency Response Team (TERT)',
    summary: 'Frontline defenders in the face of extreme danger, employing their specialized training to mitigate threats and protect lives.',
    overview: `In moments of extreme danger, having a dedicated team of frontline defenders is essential to mitigate threats and protect lives. Our Tactical Emergency Response Team (TERT) is comprised of highly trained professionals who specialize in responding to critical incidents with precision and expertise.

As frontline defenders, our TERT members are equipped with specialized training and resources to confront and neutralize threats effectively. Whether it's responding to active shooter situations, hostage crises, or other high-risk scenarios, our team is ready to spring into action at a moment's notice.

At the heart of our TERT is a commitment to saving lives and ensuring the safety of all involved. Our members undergo rigorous training and preparation to handle even the most challenging situations with calmness and efficiency, minimizing the impact of emergencies and protecting those in harm's way.

By partnering with our TERT, you gain access to a dedicated team of professionals who are dedicated to preserving life and maintaining public safety. With our expertise and unwavering commitment to excellence, you can trust us to provide the swift and effective response needed to mitigate threats and protect lives.

Don't wait until it's too late-invest in the safety and security of your organization with our Tactical Emergency Response Team. Contact us today to learn more about how we can help you prepare for and respond to critical incidents with confidence and peace of mind.`,
    heroImage: defaultHero,
    icon: images.services.tert,
    cards: [
      {
        title: 'Primary Target Market',
        icon: cardIcons.target,
        items: [
          'Law Enforcement Agencies',
          'Government',
          'Emergency Services and First Responders',
          'Public Events and Critical Infrastructure',
        ],
      },
      {
        title: 'Key Benefits',
        icon: cardIcons.benefits,
        items: [
          'Swift and Effective Crisis Resolution',
          'Specialized Expertise',
          'Enhanced Public Safety',
          'Interagency Collaboration',
        ],
      },
      {
        title: 'Features',
        icon: cardIcons.features,
        items: [
          'Specialized Training',
          'Advanced Equipment and Gear',
          'Strategic Planning and Coordination',
          'Rapid Response Capability',
          'Versatility and Adaptability',
        ],
      },
    ],
  },
  {
    slug: 'dpc',
    code: 'DPC',
    title: 'Data Privacy Compliance (DPC)',
    summary: 'Offer expert guidance, audits, and tailored strategies to safeguard sensitive information, protect customer trust, and meet legal requirements.',
    overview: `In today's digital age, safeguarding sensitive information and protecting customer trust are paramount. At our Data Privacy Compliance service, we offer expert guidance, audits, and tailored strategies to ensure your organization meets legal requirements and upholds the highest standards of data privacy.

Our team of seasoned professionals specializes in helping organizations navigate the complex landscape of data privacy regulations. Whether it's GDPR, CCPA, or other local and international laws, we provide comprehensive guidance to ensure compliance and mitigate the risk of costly penalties.

Through meticulous audits and assessments, we identify areas of vulnerability and develop tailored strategies to safeguard sensitive information. From implementing robust data protection measures to enhancing transparency and accountability, we help you build a culture of privacy that instills confidence in your customers and stakeholders.

By partnering with our Data Privacy Compliance service, you gain access to a wealth of expertise and resources dedicated to protecting your organization's most valuable asset-data. With our guidance and support, you can navigate the intricacies of data privacy regulations with confidence, knowing that you're taking proactive steps to protect your customers and your reputation.

Don't leave data privacy compliance to chance-trust our experts to help you navigate the complexities and ensure your organization remains compliant and trusted. Contact us today to learn more about how we can tailor our services to meet your specific needs and safeguard your organization's future.`,
    heroImage: defaultHero,
    icon: images.services.dpc,
    cards: [
      {
        title: 'Primary Target Market',
        icon: cardIcons.target,
        items: [
          'Law Enforcement Agencies',
          'Government',
          'Emergency Services and First Responders',
          'Public Events and Critical Infrastructure',
        ],
      },
      {
        title: 'Key Benefits',
        icon: cardIcons.benefits,
        items: [
          'Swift and Effective Crisis Resolution',
          'Specialized Expertise',
          'Enhanced Public Safety',
          'Interagency Collaboration',
        ],
      },
      {
        title: 'Features',
        icon: cardIcons.features,
        items: [
          'Specialized Training',
          'Advanced Equipment and Gear',
          'Strategic Planning and Coordination',
          'Rapid Response Capability',
          'Versatility and Adaptability',
        ],
      },
    ],
  },
  {
    slug: 'rnd',
    code: 'R&D',
    title: 'Research and Development (R&D)',
    summary: 'Create secure, top-quality and high-tech solutions, including software and hardware, for our clients through the Security Market Place (SMP).',
    overview: `At our R&D division, we're dedicated to creating secure, top-quality, and high-tech solutions for our clients through the Security Market Place (SMP). Our team of experts specializes in developing cutting-edge software and hardware solutions that meet the evolving needs of our clients and exceed industry standards.

With a focus on innovation and excellence, we harness the latest technologies and methodologies to deliver bespoke solutions tailored to your unique requirements. From conceptualization to execution, we collaborate closely with our clients to ensure that our solutions not only meet but exceed their expectations.

Our R&D efforts are driven by a commitment to security, quality, and performance. We prioritize rigorous testing and validation processes to ensure that our solutions are robust, reliable, and resilient against emerging threats.

By partnering with our R&D division, you gain access to a team of passionate innovators who are dedicated to pushing the boundaries of what's possible. Whether you're looking to develop custom software applications, integrate cutting-edge hardware solutions, or explore new avenues of technological advancement, we're here to help you bring your vision to life. \n\n Don't settle for off-the-shelf solutions-trust our R&D experts to create bespoke, high-tech solutions that set you apart from the competition. Contact us today to learn more about how we can collaborate to drive innovation and achieve your business objectives.`,
    heroImage: defaultHero,
    icon: images.services.rnd,
    cards: [
      {
        title: 'Primary Target Market',
        icon: cardIcons.target,
        items: [
          'Government',
          'Healthcare and Medical Institutions',
          'Financial Institutions',
          'Technology and Software Companies',
          'Businesses and Corporations',
        ],
      },
      {
        title: 'Key Benefits',
        icon: cardIcons.benefits,
        items: [
          'Legal Compliance',
          'Data Security',
          'Customer Trust',
          'Risk Mitigation',
          'Competitive Advantage',
        ],
      },
      {
        title: 'Features',
        icon: cardIcons.features,
        items: [
          'Regulatory Expertise',
          'Gap Analysis and Assessments',
          'Policy Development',
          'Data Mapping and Inventory',
          'Training and Awareness Programs',
        ],
      },
    ],
  },
]

export const serviceBySlug = Object.fromEntries(
  serviceTopics.map((service) => [service.slug, service]),
)
