import { Redis } from "@upstash/redis";

const kv = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export default kv;

const PAGES_KEY = "pages:all";
const SNIPPET_LEN = 160;

function makeSnippet(content) {
  return (content || "").replace(/<[^>]+>/g, "").slice(0, SNIPPET_LEN);
}

export async function listPages() {
  const ids = await kv.smembers(PAGES_KEY);
  if (!ids.length) return [];
  const metaKeys = ids.map((id) => `page:${id}:meta`);
  const raw = await kv.mget(...metaKeys);
  return raw
    .filter(Boolean)
    .map((m, i) => ({ id: ids[i], ...m }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function getPage(id) {
  const meta = await kv.get(`page:${id}:meta`);
  if (!meta) return null;
  return { id, ...meta };
}

export async function getPageContent(id) {
  return kv.get(`page:${id}:content`);
}

export async function createPage({ title, content, type }) {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const meta = { title, type, snippet: makeSnippet(content), createdAt: now };
  const pipe = kv.pipeline();
  pipe.set(`page:${id}:meta`, meta);
  pipe.set(`page:${id}:content`, content);
  pipe.sadd(PAGES_KEY, id);
  await pipe.exec();
  return { id, ...meta, content };
}

export async function deletePage(id) {
  const pipe = kv.pipeline();
  pipe.del(`page:${id}:meta`);
  pipe.del(`page:${id}:content`);
  pipe.srem(PAGES_KEY, id);
  await pipe.exec();
}
