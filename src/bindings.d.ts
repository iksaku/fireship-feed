type Env = {
  readonly CACHE: KVNamespace

  readonly YOUTUBE_API_KEY: string
  readonly DISCORD_WEBHOOK: string
}

type VideoFeed = VideoData[]

type VideoData = {
  url: string
  title: string
  description: string
  publishedAt: string
}
