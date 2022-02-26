import { showVideoFeed, updateVideoFeed } from './handlers'

const handler: ExportedHandler<Env> = {
  async fetch(_, env: Env) {
    return await showVideoFeed(env)
  },

  async scheduled(_, env) {
    await updateVideoFeed(env)
  },
}

export default handler
