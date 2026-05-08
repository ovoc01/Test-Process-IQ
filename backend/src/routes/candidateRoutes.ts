import express from 'express';
import {
  createCandidate,
  getCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
  validateCandidate,
  getCandidateReport,
} from '../controllers/candidateController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect); // All candidate routes are protected

router.route('/').post(createCandidate).get(getCandidates);

router
  .route('/:id')
  .get(getCandidateById)
  .put(updateCandidate)
  .delete(deleteCandidate);

router.post('/:id/validate', validateCandidate);
router.get('/:id/report', getCandidateReport);

export default router;
