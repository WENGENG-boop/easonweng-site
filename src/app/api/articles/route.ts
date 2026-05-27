import { getCloudflareContext } from '@opennextjs/cloudflare';
import { NextResponse } from 'next/server';
import seedArticles from '@/data/articles.json';

export const dynamic = 'force-dynamic';

const ARTICLES_KEY = 'articles';
const DEFAULT_ADMIN_PASSWORD = 'weng123';

interface Article {
  slug: string;
  title: string;
  summary: string;
  coverImage: string;
  date: string;
  readTime: string;
  wechatUrl: string;
  ctTimestamp?: number;
  createdAt?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isArticle(value: unknown): value is Article {
  return (
    isRecord(value) &&
    typeof value.slug === 'string' &&
    typeof value.title === 'string' &&
    typeof value.summary === 'string' &&
    typeof value.coverImage === 'string' &&
    typeof value.date === 'string' &&
    typeof value.readTime === 'string' &&
    typeof value.wechatUrl === 'string'
  );
}

function getSeedArticles() {
  return (seedArticles as Article[]).filter(isArticle);
}

async function getCloudflareEnv() {
  const { env } = await getCloudflareContext({ async: true });
  return env;
}

async function getArticlesKv() {
  const env = await getCloudflareEnv();
  return env.ARTICLES_KV;
}

async function getAdminPassword() {
  const env = await getCloudflareEnv();
  return env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;
}

function sortArticles(articles: Article[]) {
  return [...articles].sort((a, b) => {
    const aTime = a.ctTimestamp || parseInt(a.slug.match(/wechat-(\d+)-/)?.[1] || '0', 10);
    const bTime = b.ctTimestamp || parseInt(b.slug.match(/wechat-(\d+)-/)?.[1] || '0', 10);
    return bTime - aTime;
  });
}

async function readArticles() {
  const kv = await getArticlesKv();

  if (!kv) {
    return getSeedArticles();
  }

  const rawArticles = await kv.get(ARTICLES_KEY);
  if (!rawArticles) {
    return getSeedArticles();
  }

  try {
    const parsed: unknown = JSON.parse(rawArticles);
    return Array.isArray(parsed) ? parsed.filter(isArticle) : getSeedArticles();
  } catch (error) {
    console.error('Error parsing articles from KV:', error);
    return getSeedArticles();
  }
}

async function writeArticles(articles: Article[]) {
  const kv = await getArticlesKv();

  if (!kv) {
    throw new Error('ARTICLES_KV binding is not configured.');
  }

  await kv.put(ARTICLES_KEY, JSON.stringify(articles, null, 2));
}

async function readJsonBody(request: Request) {
  try {
    const body: unknown = await request.json();
    return isRecord(body) ? body : {};
  } catch {
    return {};
  }
}

function decodeEntities(str: string) {
  return str
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

export async function GET() {
  const articles = await readArticles();
  return NextResponse.json(sortArticles(articles));
}

export async function POST(request: Request) {
  try {
    const body = await readJsonBody(request);
    const url = typeof body.url === 'string' ? body.url.trim() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (password !== await getAdminPassword()) {
      return NextResponse.json({ error: 'Unauthorized: Invalid passcode' }, { status: 401 });
    }

    if (!url.startsWith('http')) {
      return NextResponse.json({ error: 'Invalid URL provided' }, { status: 400 });
    }

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: `WeChat page request failed with status ${res.status}` }, { status: 502 });
    }

    const html = await res.text();
    const titleMatch = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]*)"/) ||
      html.match(/msg_title\s*=\s*["']([^"']*)["']/);
    const descMatch = html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]*)"/) ||
      html.match(/msg_desc\s*=\s*["']([^"']*)["']/);
    const imageMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"/) ||
      html.match(/msg_cdn_url\s*=\s*["']([^"']*)["']/);
    const ctMatch = html.match(/var\s+ct\s*=\s*["']?(\d+)["']?/);

    if (!titleMatch) {
      return NextResponse.json({ error: 'Could not extract article metadata. Is this a valid WeChat article link?' }, { status: 422 });
    }

    const ctTimestamp = ctMatch ? parseInt(ctMatch[1], 10) : Math.floor(Date.now() / 1000);
    const dateObj = new Date(ctTimestamp * 1000);
    const formattedDate = dateObj.toLocaleString('en-US', { month: 'short', year: 'numeric' });
    const textOnly = html.replace(/<[^>]*>/g, '');
    const readTimeMin = Math.max(2, Math.min(10, Math.ceil(textOnly.length / 350)));
    const slug = `wechat-${ctTimestamp}-${Math.floor(Math.random() * 1000)}`;

    const newArticle: Article = {
      slug,
      title: decodeEntities(titleMatch[1]),
      summary: decodeEntities(descMatch?.[1] || ''),
      coverImage: imageMatch?.[1] || '',
      date: formattedDate,
      readTime: `${readTimeMin} min read`,
      wechatUrl: url,
      ctTimestamp,
      createdAt: new Date().toISOString(),
    };

    const articles = await readArticles();
    const duplicate = articles.find((article) => article.wechatUrl === url);
    if (duplicate) {
      return NextResponse.json({ error: 'This article link has already been imported' }, { status: 409 });
    }

    await writeArticles([newArticle, ...articles]);

    return NextResponse.json({ success: true, article: newArticle });
  } catch (error) {
    console.error('Error processing WeChat article:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await readJsonBody(request);
    const slug = typeof body.slug === 'string' ? body.slug : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (password !== await getAdminPassword()) {
      return NextResponse.json({ error: 'Unauthorized: Invalid passcode' }, { status: 401 });
    }

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const articles = await readArticles();
    const filteredArticles = articles.filter((article) => article.slug !== slug);

    if (articles.length === filteredArticles.length) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    await writeArticles(filteredArticles);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting article:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
