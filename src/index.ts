import { showVideoFeed, updateVideoFeed } from '~/handlers'
import { notify } from '~/notifications'

const handler: ExportedHandler<Env> = {
  async fetch(_, env: Env): Promise<Response> {
    return await showVideoFeed(env)
  },

  async scheduled(_, env: Env) {
    const updatedFeed: VideoFeed = await updateVideoFeed(env)

    await notify(updatedFeed, env)
  },
}

export default handler
