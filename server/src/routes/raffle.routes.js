import { Router } from 'express';
import { raffleController } from '../controllers/raffle.controller.js';
import { validateParticipant } from '../middleware/validate.js';

const router = Router();

router.post('/raffles', raffleController.createRaffle);
router.get('/raffles', raffleController.getRaffles);
router.get('/raffles/:id', raffleController.getRaffleById);
router.post('/raffles/numbers/assign', raffleController.saveAvailableNumbers);
router.post('/raffles/:id/participants', validateParticipant, raffleController.addParticipant);
router.patch('/raffles/:raffleId/participants/:participantId/payment', raffleController.updatePaymentStatus);
router.post('/raffles/:id/draw-winner', raffleController.drawWinner);

export const raffleRoutes = router;