import { useMemo, useState } from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import AccentUnderline from '../components/ui/AccentUnderline'
import Section from '../components/layout/Section'
import { images } from '../assets/images'
import { CareerPerkCard, FilterPill, JobCard } from '../components/ui/CareerComponents'

const departments = ['All Departments', 'Engineering', 'Sales', 'Customer Success', 'Design']

export default function CareerPage() {
  const [activeDepartment, setActiveDepartment] = useState('All Departments')

  const perks = useMemo(
    () => [
      {
        icon: images.careerPage.icons.collaborative,
        title: 'Collaborative Culture',
        description: 'Work with talented teams in an inclusive, innovative environment.',
      },
      {
        icon: images.careerPage.icons.growth,
        title: 'Career Growth',
        description: 'Continuous learning opportunities and clear paths for advancement.',
      },
      {
        icon: images.careerPage.icons.benefits,
        title: 'Competitive Benefits',
        description: 'Health insurance, 401(k) matching, unlimited PTO, and more.',
      },
      {
        icon: images.careerPage.icons.balance,
        title: 'Work-Life Balance',
        description: 'Flexible schedules and remote work options to fit your lifestyle.',
      },
    ],
    []
  )

  const jobs = useMemo(
    () => [
      {
        title: 'Senior Security Engineer',
        department: 'Engineering',
        description: 'Lead security architecture and implementation for enterprise clients.',
        location: 'Remote / New York, NY',
        employmentType: 'Full-time',
        posted: 'Posted 2 days ago',
      },
      {
        title: 'Cloud Solutions Architect',
        department: 'Engineering',
        description: 'Design and implement scalable cloud infrastructure solutions.',
        location: 'Remote / San Francisco, CA',
        employmentType: 'Full-time',
        posted: 'Posted 1 week ago',
      },
      {
        title: 'Technical Account Manager',
        department: 'Customer Success',
        description: 'Build relationships with key enterprise accounts and ensure customer success.',
        location: 'Hybrid / Chicago, IL',
        employmentType: 'Full-time',
        posted: 'Posted 3 days ago',
      },
      {
        title: 'DevOps Engineer',
        department: 'Engineering',
        description: 'Automate and optimize deployment pipelines and infrastructure.',
        location: 'Remote',
        employmentType: 'Full-time',
        posted: 'Posted 1 week ago',
      },
      {
        title: 'Sales Development Representative',
        department: 'Sales',
        description: 'Generate qualified leads and support the sales team in expanding our customer base.',
        location: 'Remote / Austin, TX',
        employmentType: 'Full-time',
        posted: 'Posted 5 days ago',
      },
      {
        title: 'UX/UI Designer',
        department: 'Design',
        description: 'Create intuitive and engaging user experiences for our enterprise platform.',
        location: 'Hybrid / Boston, MA',
        employmentType: 'Full-time',
        posted: 'Posted 1 week ago',
      },
    ],
    []
  )

  const filteredJobs = useMemo(() => {
    if (activeDepartment === 'All Departments') {
      return jobs
    }
    return jobs.filter((job) => job.department === activeDepartment)
  }, [activeDepartment, jobs])

  return (
    <>
      <main>
        <section className="relative h-[507px] overflow-hidden bg-black text-white">
          <div className="absolute inset-0">
            <img src={images.careerPage.heroBg} alt="" className="h-full w-full object-cover opacity-70" loading="eager" fetchpriority="high" width="1200" height="507" />
          </div>

          <div className="relative flex h-full flex-col">
            <Header overlay />
            <div className="flex flex-1 items-center justify-center">
              <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center px-5 sm:px-8 lg:px-12">
                <h1 className="text-4xl font-bold text-white sm:text-[51px] sm:leading-[71px]">Career</h1>
                <AccentUnderline className="mt-3 w-24 sm:w-28" />
                <Breadcrumbs
                  className="mt-4"
                  items={[
                    { label: 'Home', to: '/' },
                    { label: 'Career' },
                  ]}
                />
              </div>
            </div>
          </div>
        </section>

        <Section className="bg-white" containerClassName="py-14 sm:py-20">
          <section className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold leading-9 text-[#101828] sm:text-4xl">Why Black Bear?</h2>
            <p className="mt-4 text-base leading-6 text-[#4A5565] sm:text-lg">
              We believe in empowering our team members to do their best work while growing personally and
              professionally.
            </p>
          </section>

          <section className="mt-12 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {perks.map((perk) => (
              <CareerPerkCard key={perk.title} {...perk} />
            ))}
          </section>
        </Section>

        <Section className="bg-white" containerClassName="pt-0 pb-[30px] sm:pb-50">
          <section>
            <div className="text-left">
              <h2 className="text-3xl font-bold text-[#101828] sm:text-4xl">Open Positions</h2>
              <p className="mt-4 text-base leading-6 text-[#4A5565] sm:text-lg">
                Explore opportunities to join our growing team
              </p>
            </div>

            <div className="mt-8 flex flex-wrap justify-start gap-4">
              {departments.map((dept) => (
                <FilterPill
                  key={dept}
                  active={activeDepartment === dept}
                  onClick={() => setActiveDepartment(dept)}
                >
                  {dept}
                </FilterPill>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-6">
              {filteredJobs.map((job) => (
                <JobCard key={job.title} {...job} onApply={() => {}} />
              ))}
            </div>
          </section>
        </Section>
      </main>
      <Footer />
    </>
  )
}
