import { isAfter, subMinutes } from 'date-fns'

function buildMessage(newVideos: VideoFeed): object {
  let lines

  if (newVideos.length === 1) {
    const video: VideoData = newVideos[0]

    lines = ['New Fireship video!', `*${video.title}*`, video.url]
  } else {
    lines = [
      'New Fireship videos!',
      ...newVideos.map(
        (video: VideoData) => `- *${video.title}*: ${video.url}`,
      ),
    ]
  }

  return {
    username: 'Fireship.io',
    content: lines.join('\n'),
  }
}

export async function notify(feed: VideoFeed, env: Env) {
  const lastCheck = subMinutes(new Date(), 15)

  const newVideos = feed.filter(video =>
    isAfter(new Date(video.publishedAt), lastCheck),
  )

  if (newVideos.length < 1) {
    return
  }

  const webhooks = env.DISCORD_WEBHOOK.split(',')

  for (const webhook of webhooks) {
    await fetch(webhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(buildMessage(newVideos)),
    })
  }
}
