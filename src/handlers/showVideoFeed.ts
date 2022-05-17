import { updateVideoFeed } from './updateVideoFeed'

export async function showVideoFeed(env: Env) {
  let cachedFeed = await env.CACHE.get(env.CACHE_KEY)

  if (!cachedFeed) {
    cachedFeed = JSON.stringify(await updateVideoFeed(env))
  }

  return new Response(cachedFeed, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
