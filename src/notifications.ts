import { isAfter, isEqual, roundToNearestMinutes, subMinutes } from 'date-fns'

function isEqualOrAfter(date: Date, dateToCompare: Date): boolean {
  return isEqual(date, dateToCompare) || isAfter(date, dateToCompare)
}

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

export async function notify(feed: VideoFeed, env: Env): Promise<void> {
  if (feed.length < 1) {
    return
  }

  // We need to round to the nearest quarter-hour to properly compare
  // video upload times and notify our target channels.
  const expectedRunTime = roundToNearestMinutes(new Date(), {
    nearestTo: 15,
  })

  const lastCheck = subMinutes(expectedRunTime, 15)

  const wasRecentlyPublished = (video: VideoData) =>
    isEqualOrAfter(new Date(video.publishedAt), lastCheck)

  const newVideos = feed.filter(wasRecentlyPublished)

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
