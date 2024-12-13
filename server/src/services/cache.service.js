import NodeCache from "node-cache";
const myCache = new NodeCache({ stdTTL: 100, checkperiod: 60 * 60 * 12 });

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
}
const cacheService = new CacheService();
export default cacheService;

export const CACHE_KEYS = {
  RAFFLES: "RAFFLES",
};
