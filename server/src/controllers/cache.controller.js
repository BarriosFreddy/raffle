import cacheService from "../services/cache.service.js";
import { ApiError } from "../utils/ApiError.js";

export const cacheController = {
  async deleteAll(req, res, next) {
    try {
      cacheService.deleteAll();
      res.status(200).json({ deletedCache: true });
    } catch (error) {
      next(
        new ApiError(400, error.message || "Failed to delete cache")
      );
    }
  },
};
