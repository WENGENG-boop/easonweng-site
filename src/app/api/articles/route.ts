import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src', 'data', 'articles.json');

// Helper to read database
function readDb() {
  try {
    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, '[]');
      return [];
    }
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error('Error reading DB:', error);
    return [];
  }
}

// Helper to write database
function writeDb(data: any) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing DB:', error);
    return false;
  }
}

// Decode standard HTML entities
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

// GET all articles
export async function GET() {
  const articles = readDb();
  // Sort chronologically by WeChat publish timestamp descending (newest first)
  const sortedArticles = articles.sort((a: any, b: any) => {
    const aTime = a.ctTimestamp || parseInt(a.slug.match(/wechat-(\d+)-/)?.[1] || '0', 10);
    const bTime = b.ctTimestamp || parseInt(b.slug.match(/wechat-(\d+)-/)?.[1] || '0', 10);
    return bTime - aTime;
  });
  return NextResponse.json(sortedArticles);
}

// POST parse and save new WeChat article
export async function POST(request: Request) {
  try {
    const { url, password } = await request.json();

    // Authenticate password
    const adminPassword = process.env.ADMIN_PASSWORD || 'weng123';
    if (password !== adminPassword) {
      return NextResponse.json({ error: 'Unauthorized: Invalid passcode' }, { status: 401 });
    }

    if (!url || !url.startsWith('http')) {
      return NextResponse.json({ error: 'Invalid URL provided' }, { status: 400 });
    }

    // Fetch WeChat article content
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: `WeChat page request failed with status ${res.status}` }, { status: 502 });
    }

    const html = await res.text();

    // Parse Meta Tags
    const titleMatch = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]*)"/) || 
                       html.match(/msg_title\s*=\s*["']([^"']*)["']/);
    const descMatch = html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]*)"/) ||
                      html.match(/msg_desc\s*=\s*["']([^"']*)["']/);
    const imageMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"/) ||
                       html.match(/msg_cdn_url\s*=\s*["']([^"']*)["']/);
    
    // WeChat stores post creation timestamp in seconds as "var ct = 'timestamp'"
    const ctMatch = html.match(/var\s+ct\s*=\s*["']?(\d+)["']?/);

    if (!titleMatch) {
      return NextResponse.json({ error: 'Could not extract article metadata. Is this a valid WeChat article link?' }, { status: 422 });
    }

    const rawTitle = titleMatch[1];
    const rawDesc = descMatch ? descMatch[1] : '';
    const rawImage = imageMatch ? imageMatch[1] : '';
    const ctTimestamp = ctMatch ? parseInt(ctMatch[1], 10) : Math.floor(Date.now() / 1000);

    const title = decodeEntities(rawTitle);
    const summary = decodeEntities(rawDesc);
    const coverImage = rawImage;

    // Format date
    const dateObj = new Date(ctTimestamp * 1000);
    const formattedDate = dateObj.toLocaleString('en-US', { month: 'short', year: 'numeric' });

    // Estimate Reading Time (approx. Chinese chars / 350 per minute)
    const textOnly = html.replace(/<[^>]*>/g, '');
    const charCount = textOnly.length;
    const readTimeMin = Math.max(2, Math.min(10, Math.ceil(charCount / 350)));
    const readTime = `${readTimeMin} min read`;

    // Generate unique slug
    const slug = 'wechat-' + ctTimestamp + '-' + Math.floor(Math.random() * 1000);

    const newArticle = {
      slug,
      title,
      summary,
      coverImage,
      date: formattedDate,
      readTime,
      wechatUrl: url,
      ctTimestamp,
      createdAt: new Date().toISOString()
    };

    // Save to Database
    const articles = readDb();
    
    // Check for duplicate URLs
    const duplicate = articles.find((a: any) => a.wechatUrl === url);
    if (duplicate) {
      return NextResponse.json({ error: 'This article link has already been imported' }, { status: 409 });
    }

    articles.unshift(newArticle); // Prepend to show newest first
    writeDb(articles);

    return NextResponse.json({ success: true, article: newArticle });
  } catch (error: any) {
    console.error('Error processing WeChat article:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// DELETE an article
export async function DELETE(request: Request) {
  try {
    const { slug, password } = await request.json();

    // Authenticate password
    const adminPassword = process.env.ADMIN_PASSWORD || 'weng123';
    if (password !== adminPassword) {
      return NextResponse.json({ error: 'Unauthorized: Invalid passcode' }, { status: 401 });
    }

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const articles = readDb();
    const filteredArticles = articles.filter((a: any) => a.slug !== slug);

    if (articles.length === filteredArticles.length) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    writeDb(filteredArticles);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting article:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
