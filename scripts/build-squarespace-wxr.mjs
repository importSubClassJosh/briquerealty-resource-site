import fs from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const siteUrl = "https://www.briquerealty.com";
const assetBaseUrl =
  process.env.ASSET_BASE_URL ||
  "https://raw.githubusercontent.com/importSubClassJosh/briquerealty-resource-site/main/assets/images";

const articleSlugs = [
  "choose-real-estate-brokerage-georgia",
  "flat-fee-real-estate-brokerage-georgia-agents",
  "new-georgia-real-estate-agent-first-client-checklist",
  "fmls-vs-georgia-mls-agents",
  "real-estate-referral-commissions-georgia",
  "rental-commissions-real-estate-agents",
  "pay-at-close-real-estate-agents",
  "listing-prep-checklist-georgia-agents",
  "buyer-agent-checklist-georgia-real-estate",
  "earnest-money-guide-real-estate-agents",
  "real-estate-agent-vendor-list",
  "part-time-real-estate-agent-productivity",
  "referral-based-real-estate-business",
  "real-estate-agent-branding-guide",
  "dba-branding-real-estate-agents",
  "new-real-estate-agent-mistakes",
  "georgia-real-estate-advertising-basics-agents",
  "first-real-estate-closing-checklist",
  "short-term-rental-investing-georgia-basics",
  "real-estate-long-term-wealth-building"
];

const pageSlugs = [
  { slug: "start-here", type: "page" },
  { slug: "education", type: "page" },
  { slug: "resource-center", type: "page" },
  { slug: "articles", type: "page" },
  { slug: "downloads", type: "page" },
  { slug: "about", type: "page" },
  { slug: "contact", type: "page" },
  { slug: "privacy-policy", type: "page" },
  { slug: "editorial-policy", type: "page" },
  { slug: "real-estate-disclaimer", type: "page" },
  { slug: "author/the-agent-resource-desk", type: "page" },
  { slug: "downloads/georgia-agent-first-client-checklist", type: "page" },
  { slug: "downloads/listing-prep-checklist", type: "page" },
  { slug: "downloads/buyer-agent-transaction-checklist", type: "page" },
  { slug: "downloads/brokerage-comparison-worksheet", type: "page" },
  { slug: "downloads/vendor-list-builder", type: "page" },
  { slug: "downloads/first-closing-preparation-checklist", type: "page" },
  { slug: "downloads/referral-commission-question-sheet", type: "page" }
];

function xml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function cdata(value = "") {
  return `<![CDATA[${String(value).replaceAll("]]>", "]]]]><![CDATA[>")}]]>`;
}

function stripTags(value = "") {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function extract(html, pattern) {
  return html.match(pattern)?.[1]?.trim() || "";
}

function extractMain(html) {
  const main = extract(html, /<main id="main">([\s\S]*?)<\/main>/);
  return main
    .replaceAll('src="/assets/images/', `src="${assetBaseUrl}/`)
    .replaceAll('href="/', `href="${siteUrl}/`)
    .replaceAll('href="#', 'href="#')
    .replaceAll('src="/', `src="${siteUrl}/`);
}

async function loadPage(slug) {
  const file = path.join(rootDir, slug, "index.html");
  const html = await fs.readFile(file, "utf8");
  const title = extract(html, /<h1>([\s\S]*?)<\/h1>/) || extract(html, /<title>([\s\S]*?)\s\|\sBriqueRealty\.com<\/title>/);
  const meta = extract(html, /<meta name="description" content="([^"]*)">/);
  const category = extract(html, /<p class="eyebrow">([^<]+)<\/p>/);
  const body = extractMain(html);
  return {
    slug,
    title: stripTags(title),
    meta,
    category: stripTags(category),
    body
  };
}

function itemXml(item, postType, id, date) {
  const cleanSlug = item.slug.split("/").filter(Boolean).pop();
  const link = `${siteUrl}/${item.slug}/`;
  const categories = postType === "post" && item.category
    ? `<category domain="category" nicename="${xml(item.category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""))}">${cdata(item.category)}</category>`
    : "";
  return `
    <item>
      <title>${cdata(item.title)}</title>
      <link>${xml(link)}</link>
      <pubDate>${date.toUTCString()}</pubDate>
      <dc:creator>${cdata("agent-resource-desk")}</dc:creator>
      <guid isPermaLink="false">${xml(`${link}?import_id=${id}`)}</guid>
      <description>${cdata(item.meta)}</description>
      <content:encoded>${cdata(item.body)}</content:encoded>
      <excerpt:encoded>${cdata(item.meta)}</excerpt:encoded>
      ${categories}
      <wp:post_id>${id}</wp:post_id>
      <wp:post_date>${date.toISOString().slice(0, 19).replace("T", " ")}</wp:post_date>
      <wp:post_date_gmt>${date.toISOString().slice(0, 19).replace("T", " ")}</wp:post_date_gmt>
      <wp:comment_status>closed</wp:comment_status>
      <wp:ping_status>closed</wp:ping_status>
      <wp:post_name>${xml(cleanSlug)}</wp:post_name>
      <wp:status>publish</wp:status>
      <wp:post_parent>0</wp:post_parent>
      <wp:menu_order>0</wp:menu_order>
      <wp:post_type>${postType}</wp:post_type>
      <wp:post_password></wp:post_password>
      <wp:is_sticky>0</wp:is_sticky>
    </item>`;
}

async function build() {
  const date = new Date("2026-05-22T12:00:00Z");
  const pages = [];
  for (const page of pageSlugs) pages.push(await loadPage(page.slug));
  const posts = [];
  for (const slug of articleSlugs) posts.push(await loadPage(slug));

  const items = [];
  let id = 1000;
  for (const page of pages) items.push(itemXml(page, "page", id++, date));
  for (const post of posts) items.push(itemXml(post, "post", id++, date));

  const wxr = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0"
  xmlns:excerpt="http://wordpress.org/export/1.2/excerpt/"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:wfw="http://wellformedweb.org/CommentAPI/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:wp="http://wordpress.org/export/1.2/">
  <channel>
    <title>${cdata("BriqueRealty.com")}</title>
    <link>${xml(siteUrl)}</link>
    <description>${cdata("Georgia real estate education resource library")}</description>
    <pubDate>${date.toUTCString()}</pubDate>
    <language>en-US</language>
    <wp:wxr_version>1.2</wp:wxr_version>
    <wp:base_site_url>${xml(siteUrl)}</wp:base_site_url>
    <wp:base_blog_url>${xml(siteUrl)}</wp:base_blog_url>
    <wp:author>
      <wp:author_id>1</wp:author_id>
      <wp:author_login>${cdata("agent-resource-desk")}</wp:author_login>
      <wp:author_email>${cdata("contact@briquerealty.com")}</wp:author_email>
      <wp:author_display_name>${cdata("The Agent Resource Desk")}</wp:author_display_name>
      <wp:author_first_name>${cdata("The Agent Resource")}</wp:author_first_name>
      <wp:author_last_name>${cdata("Desk")}</wp:author_last_name>
    </wp:author>
    ${items.join("\n")}
  </channel>
</rss>
`;

  const outDir = path.join(rootDir, "dist");
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(path.join(outDir, "squarespace-import.xml"), wxr);
  await fs.writeFile(
    path.join(outDir, "squarespace-import-summary.json"),
    JSON.stringify({ pages: pages.length, posts: posts.length, assetBaseUrl }, null, 2)
  );
}

build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
