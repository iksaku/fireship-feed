import { isAfter } from 'date-fns'
import { notify } from '~/notifications'

type YoutubeSearchResults = {
  items: YoutubeSearchResult[]
}

type YoutubeSearchResult = {
  id: {
    videoId: string
  }
  snippet: {
    title: string
    description: string
    publishedAt: string
  }
}

async function fetchVideoFeed(env: Env): Promise<VideoFeed> {
  const youtube_api = new URL(
    'https://youtube.googleapis.com/youtube/v3/search',
  )

  youtube_api.search = new URLSearchParams({
    part: 'snippet',
    channelId: 'UCsBjURrPoezykLs9EqgamOA',
    order: 'date',
    q: '100SecondsOfCode',
    type: 'video',
    maxResults: '50',
    key: env.YOUTUBE_API_KEY,
  }).toString()

  const response = await fetch(youtube_api.toString(), {
    headers: {
      Accept: 'application/json',
    },
  })

  const json = await response.json<YoutubeSearchResults>()

  if (!response.ok) {
    console.error(json)

    return []
  }

  return json.items.map(
    (result: YoutubeSearchResult): VideoData => {
      const { title, description, publishedAt } = result.snippet

      const url = `https://youtu.be/${result.id.videoId}`

      return { url, title, description, publishedAt }
    },
  )
}

async function filterNewVideos(
  latestFeed: VideoFeed,
  env: Env,
): Promise<VideoFeed> {
  const parseVideoUploadDate = (video: VideoData) => new Date(video.publishedAt)

  const cachedFeed = JSON.parse(await env.CACHE.get(env.CACHE_KEY))

  if (!cachedFeed) {
    return latestFeed
  }

  const latestVideoInCache = cachedFeed[0]

  const latestUploadDateInCache = parseVideoUploadDate(latestVideoInCache)

  return latestFeed.filter(video =>
    isAfter(parseVideoUploadDate(video), latestUploadDateInCache),
  )
}

export async function updateVideoFeed(env: Env): Promise<VideoFeed> {
  const latestFeed = await fetchVideoFeed(env)

  if (latestFeed.length < 1) {
    return []
  }

  const newVideos = await filterNewVideos(latestFeed, env)

  if (newVideos.length > 0) {
    await env.CACHE.put(env.CACHE_KEY, JSON.stringify(latestFeed))

    await notify(newVideos, env)
  }

  return latestFeed
}
