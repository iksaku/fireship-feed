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

export async function notify(newVideos: VideoFeed, env: Env): Promise<void> {
  const webhooks = env.DISCORD_WEBHOOK.split(',')
  const body = JSON.stringify(buildMessage(newVideos))

  for (const webhook of webhooks) {
    const response = await fetch(webhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body,
    })

    if (!response.ok) {
      console.error(response.status, await response.json())
    }
  }
}
