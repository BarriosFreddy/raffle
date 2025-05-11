import { Router } from 'express';
import { cacheController } from '../controllers/cache.controller.js';

const router = Router();

router.get('/delete-cache', cacheController.deleteAll);

export const cacheRoutes = router;