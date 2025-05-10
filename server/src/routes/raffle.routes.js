import { Router } from 'express';
import { raffleController } from '../controllers/raffle.controller.js';
import { validateParticipant } from '../middleware/validate.js';
import { isAuthenticated } from '../middleware/authenticate.middleware.js';

const router = Router();

router.post('/raffles', isAuthenticated, raffleController.createRaffle);
router.get('/raffles', isAuthenticated, raffleController.getRaffles);

// Specific routes must come before generic parameter routes to avoid conflicts
// Live data endpoints (bypassing cache)
router.get('/raffles/live/slug/:slug', raffleController.getLiveRaffleBySlug);
router.get('/raffles/live/:id', raffleController.getLiveRaffleById);

// Slug route must come before ID route
router.get('/raffles/slug/:slug', raffleController.getRaffleBySlug);

// Available numbers endpoint
router.get('/raffles/:raffleId/available-numbers', isAuthenticated, raffleController.checkAvailableNumbers);

// Specific action routes
router.post('/raffles/numbers/assign', isAuthenticated, raffleController.saveAvailableNumbers);
router.put('/raffles/:raffleId/awarded-numbers', isAuthenticated, raffleController.updateAwardedNumbers);

// Generic parameter routes (must be last)
router.put('/raffles/:id', isAuthenticated, raffleController.updateRaffle);
router.get('/raffles/:id', isAuthenticated, raffleController.getRaffleById);

export const raffleRoutes = router;