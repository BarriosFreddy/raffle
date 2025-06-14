import NodeCache from "node-cache";

const CACHE_TIME = 60 * 60 * 1 // 1 hpur
const myCache = new NodeCache({ stdTTL: CACHE_TIME });

class CacheService {
  constructor() {}

  set(key, data) {
    if (!key || !data) return false;
    return myCache.set(key, data);
  }
  get(key) {
    if (!key) return;
    return myCache.get(key);
  }
  delete(key) {
    if (!key) return;
    return !!myCache.del(key);
  }
  deleteAll() {
    return myCache.flushAll();
  }
}
const cacheService = new CacheService();
export default cacheService;

export const CACHE_KEYS = {
  RAFFLES: "RAFFLES",
  RAFFLE: "RAFFLE",
  RAFFLE_SLUG: "RAFFLE_SLUG",
};
