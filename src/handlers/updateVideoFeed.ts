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

export async function updateVideoFeed(env: Env): Promise<VideoFeed> {
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

  const transformed: VideoFeed = json.items.map(
    (result: YoutubeSearchResult): VideoData => {
      const { title, description, publishedAt } = result.snippet

      const url = `https://youtu.be/${result.id.videoId}`

      return { url, title, description, publishedAt }
    },
  )

  await env.CACHE.put(env.CACHE_KEY, JSON.stringify(transformed))

  return transformed
}
