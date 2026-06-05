import { useMemo, useState } from 'react'
import { Edit, Eye, FileText, Search, Trash2 } from 'lucide-react'
import CreateArticle from './CreateArticle'

function StatusBadge({ status }) {
  return status === 'published' ? (
    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
      Published
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
      Draft
    </span>
  )
}

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateArticle, setShowCreateArticle] = useState(false)

  const posts = useMemo(
    () => [
      {
        id: 1,
        title: '10 Essential Cybersecurity Practices for Small Businesses',
        category: 'Best Practices',
        author: 'John Smith',
        status: 'published',
        publishDate: '2026-05-28',
        views: 1243,
        featured: true,
      },
      {
        id: 2,
        title: 'Understanding GDPR Compliance: A Complete Guide',
        category: 'Compliance',
        author: 'Sarah Johnson',
        status: 'published',
        publishDate: '2026-05-25',
        views: 892,
        featured: false,
      },
      {
        id: 3,
        title: 'The Rise of Ransomware: How to Protect Your Organization',
        category: 'Threat Intelligence',
        author: 'Michael Chen',
        status: 'draft',
        publishDate: '',
        views: 0,
        featured: false,
      },
      {
        id: 4,
        title: 'Security Assessment Checklist for 2026',
        category: 'Resources',
        author: 'Emily Rodriguez',
        status: 'published',
        publishDate: '2026-05-20',
        views: 2156,
        featured: true,
      },
      {
        id: 5,
        title: 'Zero Trust Architecture: Implementation Strategy',
        category: 'Architecture',
        author: 'David Kim',
        status: 'draft',
        publishDate: '',
        views: 0,
        featured: false,
      },
    ],
    []
  )

  const filteredPosts = useMemo(() => {
    const needle = searchTerm.toLowerCase()
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(needle) ||
        post.category.toLowerCase().includes(needle) ||
        post.author.toLowerCase().includes(needle)
    )
  }, [posts, searchTerm])

  const totals = useMemo(() => {
    return {
      total: posts.length,
      published: posts.filter((p) => p.status === 'published').length,
      drafts: posts.filter((p) => p.status === 'draft').length,
      views: posts.reduce((sum, p) => sum + p.views, 0),
    }
  }, [posts])

  return (
    <>
      <section className="space-y-6">
        <section className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Blog / Articles</h2>
            <p className="mt-1 text-gray-600">Create and manage your blog content</p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreateArticle(true)}
            className="cursor-pointer rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-white shadow-sm transition-all hover:from-amber-600 hover:to-amber-700"
          >
            + New Article
          </button>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="mb-1 text-sm text-gray-600">Total Articles</p>
            <p className="text-2xl font-semibold text-gray-900">{totals.total}</p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="mb-1 text-sm text-gray-600">Published</p>
            <p className="text-2xl font-semibold text-gray-900">{totals.published}</p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="mb-1 text-sm text-gray-600">Drafts</p>
            <p className="text-2xl font-semibold text-gray-900">{totals.drafts}</p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="mb-1 text-sm text-gray-600">Total Views</p>
            <p className="text-2xl font-semibold text-gray-900">{totals.views.toLocaleString()}</p>
          </div>
        </section>

        <section className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">Article</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">Author</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                    Publish Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">Views</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="transition-colors hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-100 to-amber-200">
                          <FileText className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{post.title}</p>
                          {post.featured ? (
                            <span className="mt-1 inline-block rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                              Featured
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{post.category}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{post.author}</p>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={post.status} />
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{post.publishDate || 'Not published'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                        <Eye className="h-4 w-4 text-gray-400" />
                        {post.views.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button type="button" className="text-blue-600 hover:text-blue-700" aria-label="Edit">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button type="button" className="text-red-600 hover:text-red-700" aria-label="Delete">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>

      {showCreateArticle ? <CreateArticle onClose={() => setShowCreateArticle(false)} /> : null}
    </>
  )
}

