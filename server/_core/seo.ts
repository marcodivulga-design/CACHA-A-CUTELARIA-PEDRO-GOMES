import { Request, Response } from 'express';

interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  author?: string;
  image?: string;
  url: string;
  type?: string;
  locale?: string;
}

interface StructuredData {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

class SEOService {
  // Generate meta tags
  generateMetaTags(metadata: SEOMetadata): string {
    const tags: string[] = [
      `<meta charset="UTF-8">`,
      `<meta name="viewport" content="width=device-width, initial-scale=1.0">`,
      `<title>${this.escapeHtml(metadata.title)}</title>`,
      `<meta name="description" content="${this.escapeHtml(metadata.description)}">`,
      `<meta name="keywords" content="${metadata.keywords.join(', ')}">`,
    ];

    if (metadata.author) {
      tags.push(`<meta name="author" content="${this.escapeHtml(metadata.author)}">`);
    }

    // Open Graph tags
    tags.push(`<meta property="og:title" content="${this.escapeHtml(metadata.title)}">`);
    tags.push(`<meta property="og:description" content="${this.escapeHtml(metadata.description)}">`);
    tags.push(`<meta property="og:url" content="${metadata.url}">`);
    tags.push(`<meta property="og:type" content="${metadata.type || 'website'}">`);

    if (metadata.image) {
      tags.push(`<meta property="og:image" content="${metadata.image}">`);
    }

    if (metadata.locale) {
      tags.push(`<meta property="og:locale" content="${metadata.locale}">`);
    }

    // Twitter Card tags
    tags.push(`<meta name="twitter:card" content="summary_large_image">`);
    tags.push(`<meta name="twitter:title" content="${this.escapeHtml(metadata.title)}">`);
    tags.push(`<meta name="twitter:description" content="${this.escapeHtml(metadata.description)}">`);

    if (metadata.image) {
      tags.push(`<meta name="twitter:image" content="${metadata.image}">`);
    }

    // Canonical tag
    tags.push(`<link rel="canonical" href="${metadata.url}">`);

    return tags.join('\n');
  }

  // Generate structured data (JSON-LD)
  generateStructuredData(data: StructuredData): string {
    return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
  }

  // Generate sitemap
  generateSitemap(urls: Array<{ url: string; lastmod?: Date; changefreq?: string; priority?: number }>): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    urls.forEach(item => {
      xml += '  <url>\n';
      xml += `    <loc>${this.escapeXml(item.url)}</loc>\n`;

      if (item.lastmod) {
        xml += `    <lastmod>${item.lastmod.toISOString().split('T')[0]}</lastmod>\n`;
      }

      if (item.changefreq) {
        xml += `    <changefreq>${item.changefreq}</changefreq>\n`;
      }

      if (item.priority) {
        xml += `    <priority>${item.priority}</priority>\n`;
      }

      xml += '  </url>\n';
    });

    xml += '</urlset>';
    return xml;
  }

  // Generate robots.txt
  generateRobotsTxt(): string {
    return `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api
Disallow: /private

Sitemap: https://example.com/sitemap.xml

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /`;
  }

  // Generate breadcrumb schema
  generateBreadcrumbs(items: Array<{ name: string; url: string }>): StructuredData {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    };
  }

  // Generate product schema
  generateProductSchema(product: {
    name: string;
    description: string;
    image: string;
    price: number;
    currency: string;
    rating?: number;
    reviewCount?: number;
    availability?: string;
    sku?: string;
  }): StructuredData {
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: product.image,
      offers: {
        '@type': 'Offer',
        price: product.price.toString(),
        priceCurrency: product.currency,
        availability: product.availability || 'https://schema.org/InStock',
      },
      ...(product.rating && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: product.rating.toString(),
          reviewCount: product.reviewCount || '1',
        },
      }),
      ...(product.sku && { sku: product.sku }),
    };
  }

  // Generate organization schema
  generateOrganizationSchema(org: {
    name: string;
    url: string;
    logo: string;
    description: string;
    email?: string;
    phone?: string;
    address?: string;
  }): StructuredData {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: org.name,
      url: org.url,
      logo: org.logo,
      description: org.description,
      ...(org.email && { email: org.email }),
      ...(org.phone && { telephone: org.phone }),
      ...(org.address && { address: org.address }),
    };
  }

  // Generate FAQ schema
  generateFAQSchema(faqs: Array<{ question: string; answer: string }>): StructuredData {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    };
  }

  // Escape HTML
  private escapeHtml(text: string): string {
    const map: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  // Escape XML
  private escapeXml(text: string): string {
    return this.escapeHtml(text);
  }

  // Generate meta robots
  generateMetaRobots(index: boolean = true, follow: boolean = true): string {
    const content = [index ? 'index' : 'noindex', follow ? 'follow' : 'nofollow'].join(', ');
    return `<meta name="robots" content="${content}">`;
  }

  // Generate hreflang tags
  generateHrefLang(urls: Array<{ lang: string; url: string }>): string {
    return urls.map(item => `<link rel="alternate" hreflang="${item.lang}" href="${item.url}">`).join('\n');
  }

  // SEO audit
  auditPage(metadata: SEOMetadata): { issues: string[]; score: number } {
    const issues: string[] = [];
    let score = 100;

    // Check title
    if (!metadata.title || metadata.title.length === 0) {
      issues.push('Missing page title');
      score -= 10;
    } else if (metadata.title.length < 30 || metadata.title.length > 60) {
      issues.push('Title length should be between 30-60 characters');
      score -= 5;
    }

    // Check description
    if (!metadata.description || metadata.description.length === 0) {
      issues.push('Missing meta description');
      score -= 10;
    } else if (metadata.description.length < 120 || metadata.description.length > 160) {
      issues.push('Description length should be between 120-160 characters');
      score -= 5;
    }

    // Check keywords
    if (!metadata.keywords || metadata.keywords.length === 0) {
      issues.push('Missing keywords');
      score -= 5;
    } else if (metadata.keywords.length > 10) {
      issues.push('Too many keywords (max 10)');
      score -= 3;
    }

    // Check image
    if (!metadata.image) {
      issues.push('Missing OG image');
      score -= 5;
    }

    // Check URL
    if (!metadata.url || !this.isValidUrl(metadata.url)) {
      issues.push('Invalid URL');
      score -= 10;
    }

    return { issues, score: Math.max(0, score) };
  }

  // Validate URL
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}

export const seoService = new SEOService();

// SEO middleware
export function seoMiddleware(req: Request, res: Response, next: Function) {
  res.locals.seo = seoService;
  next();
}

// Sitemap route
export function sitemapRoute(req: Request, res: Response) {
  const urls = [
    { url: 'https://example.com/', changefreq: 'daily', priority: 1.0 },
    { url: 'https://example.com/catalog', changefreq: 'daily', priority: 0.9 },
    { url: 'https://example.com/about', changefreq: 'monthly', priority: 0.7 },
    { url: 'https://example.com/contact', changefreq: 'monthly', priority: 0.7 },
  ];

  const sitemap = seoService.generateSitemap(urls);
  res.set('Content-Type', 'application/xml');
  res.send(sitemap);
}

// Robots.txt route
export function robotsRoute(req: Request, res: Response) {
  const robots = seoService.generateRobotsTxt();
  res.set('Content-Type', 'text/plain');
  res.send(robots);
}
