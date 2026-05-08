import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getArticleBySlug, getAllSlugs } from "@/lib/blog-data"
import BlogArticleView from "@/components/blog/BlogArticleView"

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) return { title: "Not Found" }
  const title = article.articleTitle ?? article.title
  return {
    title: `${title} | CAFIA Blog`,
    description: article.description,
    openGraph: {
      title: `${title} | CAFIA Blog`,
      description: article.description,
    },
    other: {
      "article:author": article.author,
      "article:published_time": article.datePublished,
      ...(article.dateUpdated && { "article:modified_time": article.dateUpdated }),
    },
  }
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) notFound()
  return <BlogArticleView article={article} />
}
