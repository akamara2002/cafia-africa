export type BlogMediaType = "video" | "image"

export interface BlogArticleMeta {
  slug: string
  title: string
  description: string
  author: string
  datePublished: string
  dateUpdated?: string
  readTimeMinutes: number
  media: BlogMediaType
  /** Thumbnail image for card (used for both image and video cards; video cards show this until hover) */
  thumbnail: string
  /** Video src for video articles (card preview and article page) */
  videoSrc?: string
  /** Main image for image articles (card and article) */
  image?: string
  imageAlt?: string
  /** Optional full article title (e.g. "Financial Inclusion in Sierra Leone" for bank-perception) */
  articleTitle?: string
  /** Optional subtitle for article hero */
  articleSubtitle?: string
}

export const BLOG_ARTICLES: BlogArticleMeta[] = [
  {
    slug: "bank-perception",
    title: "Bank Account Perception",
    description: "How entrepreneurs in Sierra Leone view formal banking—and why many believe accounts are only for when you have \"enough\" money.",
    author: "CAFIA Research Team",
    datePublished: "2025-01-15",
    dateUpdated: "2025-03-01",
    readTimeMinutes: 4,
    media: "video",
    thumbnail: "/images/bilal.jpeg",
    videoSrc: "/images/salaam.mp4",
    articleTitle: "Financial Inclusion in Sierra Leone",
    articleSubtitle: "Field interviews and survey insights on how entrepreneurs perceive bank accounts, credit, and digital tools.",
  },
  {
    slug: "cash-and-digital-payments",
    title: "Cash and Digital Payments",
    description: "Many businesses still rely mainly on cash and often use personal mobile money wallets for business transactions.",
    author: "CAFIA Research Team",
    datePublished: "2025-02-10",
    dateUpdated: "2025-03-01",
    readTimeMinutes: 4,
    media: "image",
    thumbnail: "/images/bilal.jpeg",
    image: "/images/bilal.jpeg",
    imageAlt: "Cash and digital payments",
    articleTitle: "Financial Inclusion in Sierra Leone",
    articleSubtitle: "Field interviews and survey insights on how entrepreneurs perceive bank accounts, credit, and digital tools.",
  },
  {
    slug: "record-keeping",
    title: "Record Keeping",
    description: "Many entrepreneurs understand their finances but do not keep written records because they do not see a clear benefit.",
    author: "CAFIA Research Team",
    datePublished: "2025-02-20",
    dateUpdated: "2025-03-01",
    readTimeMinutes: 4,
    media: "image",
    thumbnail: "/images/amanda.jpeg",
    image: "/images/amanda.jpeg",
    imageAlt: "Record keeping",
    articleTitle: "Financial Inclusion in Sierra Leone",
    articleSubtitle: "Field interviews and survey insights on how entrepreneurs perceive bank accounts, credit, and digital tools.",
  },
  {
    slug: "trust-in-digital-payments",
    title: "Trust in Digital Payments",
    description: "Cash preference, transaction errors, and network reliability remain important barriers to wider adoption of digital payments.",
    author: "CAFIA Research Team",
    datePublished: "2025-03-01",
    dateUpdated: "2025-03-01",
    readTimeMinutes: 4,
    media: "image",
    thumbnail: "/images/edwrad.jpeg",
    image: "/images/edwrad.jpeg",
    imageAlt: "Trust in digital payments",
    articleTitle: "Financial Inclusion in Sierra Leone",
    articleSubtitle: "Field interviews and survey insights on how entrepreneurs perceive bank accounts, credit, and digital tools.",
  },
  {
    slug: "digital-records-for-credit",
    title: "Digital Records for Credit",
    description: "Simple digital tools that record transactions could help lenders assess small businesses and expand access to credit.",
    author: "CAFIA Research Team",
    datePublished: "2025-03-05",
    dateUpdated: "2025-03-01",
    readTimeMinutes: 5,
    media: "video",
    thumbnail: "/images/edwrad.jpeg",
    videoSrc: "/images/abdul.mp4",
    articleTitle: "Financial Inclusion in Sierra Leone",
    articleSubtitle: "Field interviews and survey insights on how entrepreneurs perceive bank accounts, credit, and digital tools.",
  },
]

export function getArticleBySlug(slug: string): BlogArticleMeta | undefined {
  return BLOG_ARTICLES.find((a) => a.slug === slug)
}

export function getAllSlugs(): string[] {
  return BLOG_ARTICLES.map((a) => a.slug)
}
