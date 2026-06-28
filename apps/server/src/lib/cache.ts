// Lightweight cache wrapper: uses Redis (ioredis) if REDIS_URL is set,
// otherwise falls back to an in-memory Map. Same async API in both modes.
// Activate Redis by setting REDIS_URL=redis://... (Upstash, local, etc.)

import Redis from 'ioredis'

let _redis: Redis | null = null

function getRedis(): Redis | null {
  if (_redis) return _redis
  const url = process.env.REDIS_URL
  if (!url) return null
  try {
    _redis = new Redis(url, { lazyConnect: false, maxRetriesPerRequest: 3 })
    _redis.on('error', err => console.error('[cache] redis error:', err.message))
    return _redis
  } catch {
    return null
  }
}

// Fallback in-memory store
const memStore = new Map<string, { value: string; expiresAt: number }>()

export async function cacheGet(key: string): Promise<string | null> {
  const r = getRedis()
  if (r) return r.get(key)
  const entry = memStore.get(key)
  if (!entry) return null
  if (entry.expiresAt && entry.expiresAt < Date.now()) {
    memStore.delete(key)
    return null
  }
  return entry.value
}

export async function cacheSet(key: string, value: string, ttlSeconds?: number): Promise<void> {
  const r = getRedis()
  if (r) {
    if (ttlSeconds) await r.set(key, value, 'EX', ttlSeconds)
    else            await r.set(key, value)
    return
  }
  memStore.set(key, {
    value,
    expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : 0,
  })
}

export async function cacheDel(key: string): Promise<void> {
  const r = getRedis()
  if (r) { await r.del(key); return }
  memStore.delete(key)
}

export function isRedisEnabled(): boolean {
  return getRedis() !== null
}
