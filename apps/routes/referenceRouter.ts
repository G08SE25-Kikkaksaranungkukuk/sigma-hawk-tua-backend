import express, { Router } from 'express';
import referenceController from '../controllers/reference/referenceController';

const router: Router = express.Router();

// GET /api/reference/interests - Get all interests
router.get('/interests', referenceController.getInterests);

// GET /api/reference/travel-styles - Get all travel styles
router.get('/travel-styles', referenceController.getTravelStyles);

// POST /api/reference/interests/validate - Validate interest keys
router.post('/interests/validate', referenceController.getInterestsByKeys);

// POST /api/reference/travel-styles/validate - Validate travel style keys
router.post('/travel-styles/validate', referenceController.getTravelStylesByKeys);

export default router;
