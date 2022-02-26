export async function showVideoFeed(env) {
    let cachedFeed = await env.CACHE.get('feed')

    if (!cachedFeed) {
        cachedFeed = await updateVideoFeed(env)
    }

    return new Response(cachedFeed, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export async function updateVideoFeed(env) {
    const youtube_api = new URL('https://youtube.googleapis.com/youtube/v3/search')

    youtube_api.search = new URLSearchParams({
        part: 'snippet',
        channelId: 'UCsBjURrPoezykLs9EqgamOA',
        order: 'date',
        q: 'in 100 seconds',
        type: 'video',
        maxResults: 10,
        key: env.YOUTUBE_API_KEY
    }).toString()

    const response = await fetch(youtube_api, {
        headers: {
            Accept: 'application/json'
        }
    })

    const json = await response.json()

    const transformed = json.items.map((result) => {
        const { title, description, publishedAt } = result.snippet

        const url = `https://youtu.be/${result.id.videoId}`

        return { url, title, description, publishedAt }
    })

    const result = JSON.stringify(transformed)

    await env.CACHE.put('feed', result)

    return result
}