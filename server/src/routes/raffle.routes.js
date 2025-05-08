import { Router } from 'express';
import { raffleController } from '../controllers/raffle.controller.js';
import { validateParticipant } from '../middleware/validate.js';
import { isAuthenticated } from '../middleware/authenticate.middleware.js';

const router = Router();

router.post('/raffles', isAuthenticated, raffleController.createRaffle);
router.put('/raffles/:id', isAuthenticated, raffleController.updateRaffle);
router.get('/raffles', isAuthenticated, raffleController.getRaffles);
router.get('/raffles/:id', isAuthenticated, raffleController.getRaffleById);
router.get('/raffles/slug/:slug', raffleController.getRaffleBySlug);
router.get('/raffles/:raffleId/available-numbers', isAuthenticated, raffleController.checkAvailableNumbers);
router.post('/raffles/numbers/assign', isAuthenticated, raffleController.saveAvailableNumbers);
router.put('/raffles/:raffleId/awarded-numbers', isAuthenticated, raffleController.updateAwardedNumbers);

export const raffleRoutes = router;