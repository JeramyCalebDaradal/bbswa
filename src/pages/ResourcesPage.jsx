import { useMemo, useState } from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Section from '../components/layout/Section'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import AccentUnderline from '../components/ui/AccentUnderline'
import { images } from '../assets/images'
import {
  DatasheetCard,
  MasonryColumns,
  ResourceArticleCard,
  ResourceTypeTab,
  VideoCard,
} from '../components/ui/ResourcesComponents'

export default function ResourcesPage() {
  const [activeType, setActiveType] = useState('articles')

  const resourceTypes = useMemo(
    () => [
      { key: 'articles', label: 'Articles', icon: images.resourcesPage.iconArticles },
      { key: 'datasheets', label: 'Datasheets', icon: images.resourcesPage.iconDatasheets },
      {
        key: 'videos',
        label: 'Informational Videos',
        icon: images.resourcesPage.iconVideos,
        iconMaskSize: '120% 120%',
      },
    ],
    []
  )

  const resources = useMemo(
    () => [
      {
        tag: 'Security',
        date: 'May 15, 2026',
        readTime: '• 8 min read',
        title: 'Industry Best Practices 2026',
        description: 'Comprehensive guide to modern security standards and implementation strategies.',
      },
      {
        tag: 'Strategy',
        date: 'April 22, 2026',
        readTime: '• 12 min read',
        title: 'Digital Transformation Guide',
        description: 'Essential strategies for successfully navigating digital transformation in your organization.',
      },
      {
        tag: 'Technology',
        date: 'March 30, 2026',
        readTime: '• 10 min read',
        title: 'Cloud Infrastructure Optimization',
        description: 'Best practices for optimizing cloud infrastructure and reducing operational costs.',
      },
    ],
    []
  )

  const datasheets = useMemo(
    () => [
      {
        icon: images.resourcesPage.datasheets.enterpriseIcon,
        title: 'Enterprise Security Suite',
        description:
          'Complete technical specifications and feature breakdown for our enterprise security solution.',
        pages: '12 pages',
        size: '2.4 MB',
        month: 'May 2026',
      },
      {
        icon: images.resourcesPage.datasheets.networkIcon,
        title: 'Network Infrastructure Solutions',
        description: 'Detailed overview of network infrastructure capabilities and deployment options.',
        pages: '8 pages',
        size: '1.8 MB',
        month: 'April 2026',
      },
      {
        icon: images.resourcesPage.datasheets.managedIcon,
        title: 'Managed Services Overview',
        description: 'Comprehensive breakdown of managed services offerings and support levels.',
        pages: '10 pages',
        size: '2.1 MB',
        month: 'March 2026',
      },
    ],
    []
  )

  const videos = useMemo(
    () => [
      {
        thumbnail: images.resourcesPage.videos.gettingStartedThumb,
        duration: '5:32',
        title: 'Getting Started with Black Bear Solutions',
        description: 'Introduction to our platform and key features overview.',
        views: '2.4K views',
      },
      {
        thumbnail: images.resourcesPage.videos.bestPracticesThumb,
        duration: '12:18',
        title: 'Security Implementation Best Practices',
        description: 'Step-by-step guide to implementing enterprise security measures.',
        views: '1.8K views',
      },
      {
        thumbnail: images.resourcesPage.videos.advancedConfigThumb,
        duration: '15:45',
        title: 'Advanced Configuration Tutorial',
        description: 'Deep dive into advanced configuration options and customization.',
        views: '1.2K views',
      },
    ],
    []
  )

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">
          <section className="relative h-[507px] overflow-hidden bg-black text-white">
          <div className="absolute inset-0">
            <img
              src={images.resourcesPage.heroBg}
              alt=""
              className="h-full w-full object-cover object-center opacity-70"
            />
          </div>

          <div className="relative flex h-full flex-col">
            <Header overlay />
            <div className="flex flex-1 items-center justify-center">
              <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center px-5 sm:px-8 lg:px-12">
                <h1 className="text-4xl font-bold sm:text-[51px] sm:leading-[71px]">Resources</h1>
                <AccentUnderline className="mt-3 w-24 sm:w-28" />
                <Breadcrumbs
                  className="mt-4"
                  items={[
                    { label: 'Home', to: '/' },
                    { label: 'Resources' },
                  ]}
                />
              </div>
            </div>
          </div>
          </section>

          <Section
            className="min-h-[max(50vh,calc(100vh-507px))] bg-white"
            containerClassName="py-12 pb-30 sm:pb-80"
          >
          <div className="flex flex-wrap items-center gap-8">
            {resourceTypes.map((type) => (
              <ResourceTypeTab
                key={type.key}
                active={activeType === type.key}
                icon={type.icon}
                label={type.label}
                iconClassName={type.iconClassName}
                iconMaskSize={type.iconMaskSize}
                onClick={() => setActiveType(type.key)}
              />
            ))}
          </div>

          {activeType === 'datasheets' ? (
            <MasonryColumns className="mt-10">
              {datasheets.map((sheet) => (
                <DatasheetCard key={sheet.title} {...sheet} />
              ))}
            </MasonryColumns>
          ) : activeType === 'videos' ? (
            <MasonryColumns className="mt-10">
              {videos.map((video) => (
                <VideoCard key={video.title} {...video} />
              ))}
            </MasonryColumns>
          ) : (
            <div className="mt-10 flex flex-col gap-6">
              {resources.map((resource) => (
                <ResourceArticleCard key={`${resource.title}-${resource.date}`} {...resource} />
              ))}
            </div>
          )}
          </Section>
        </main>
        <Footer />
      </div>
    </>
  )
}
