import { showVideoFeed, updateVideoFeed } from './handlers.mjs'

export default {
  async fetch(_, env) {
    return await showVideoFeed(env)
  },

  async scheduled(_, env) {
    return await updateVideoFeed(env)
  },
}
