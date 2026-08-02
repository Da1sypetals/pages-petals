import { Redis } from "@upstash/redis";

const kv = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const PAGES_KEY = "pages:all";

export async function listPages() {
  const ids = await kv.smembers(PAGES_KEY);
  if (!ids.length) return [];
  const keys = ids.map((id) => `page:${id}:meta`);
  const raw = await kv.mget(...keys);
  return raw.filter(Boolean).map((m, i) => {
    const isMd = m.filename.endsWith(".md");
    return { id: ids[i], filename: m.filename, isMd, createdAt: m.createdAt };
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function pageTitle(filename) {
  return filename.replace(/\.(md|html?)$/i, "");
}

export async function getPage(id) {
  const meta = await kv.get(`page:${id}:meta`);
  if (!meta) return null;
  return { id, filename: meta.filename, createdAt: meta.createdAt };
}

export async function getContent(id) {
  return kv.get(`page:${id}:content`);
}

export async function createPage(filename, content) {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const pipe = kv.pipeline();
  pipe.set(`page:${id}:meta`, { filename, createdAt: now });
  pipe.set(`page:${id}:content`, content);
  pipe.sadd(PAGES_KEY, id);
  await pipe.exec();
  return { id, filename, createdAt: now };
}

export async function deletePage(id) {
  const pipe = kv.pipeline();
  pipe.del(`page:${id}:meta`);
  pipe.del(`page:${id}:content`);
  pipe.srem(PAGES_KEY, id);
  await pipe.exec();
}
