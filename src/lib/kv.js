import { Redis } from "@upstash/redis";

const kv = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const PAGES_KEY = "pages:all";

export async function listPages() {
  const ids = await kv.smembers(PAGES_KEY);
  if (!ids.length) return [];
  const metaKeys = ids.map((id) => `page:${id}:meta`);
  const raw = await kv.mget(...metaKeys);
  return raw.filter(Boolean).map((m, i) => ({ id: ids[i], ...m }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function getPage(id) {
  const meta = await kv.get(`page:${id}:meta`);
  if (!meta) return null;
  return { id, ...meta };
}

export async function getContent(id) {
  return kv.get(`page:${id}:content`);
}

export async function createPage({ title, content, type }) {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const snippet = (content || "").replace(/<[^>]+>/g, "").slice(0, 160);
  const pipe = kv.pipeline();
  pipe.set(`page:${id}:meta`, { title, type, snippet, createdAt: now });
  pipe.set(`page:${id}:content`, content);
  pipe.sadd(PAGES_KEY, id);
  await pipe.exec();
  return { id, title, type, snippet, createdAt: now };
}

export async function deletePage(id) {
  const pipe = kv.pipeline();
  pipe.del(`page:${id}:meta`);
  pipe.del(`page:${id}:content`);
  pipe.srem(PAGES_KEY, id);
  await pipe.exec();
}
