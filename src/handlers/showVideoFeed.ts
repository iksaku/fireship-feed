import { updateVideoFeed } from '../handlers'

export async function showVideoFeed(env: Env) {
  let cachedFeed = await env.CACHE.get('feed')

  if (!cachedFeed) {
    cachedFeed = await updateVideoFeed(env)
  }

  return new Response(cachedFeed, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
