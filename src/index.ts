import { showVideoFeed, updateVideoFeed } from '~/handlers'

const handler: ExportedHandler<Env> = {
  async fetch(_, env: Env): Promise<Response> {
    return await showVideoFeed(env)
  },

  async scheduled(_, env: Env) {
    await updateVideoFeed(env)
  },
}

export default handler
