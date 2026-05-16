import express from 'express';
import * as projectController from '../controllers/projectController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, authorize(['admin']), projectController.createProject);
router.get('/', authenticate, projectController.getProjects);
router.get('/:projectId', authenticate, projectController.getProjectById);
router.put('/:projectId', authenticate, projectController.updateProject);
router.delete('/:projectId', authenticate, projectController.deleteProject);

// Project members
router.post('/:projectId/members', authenticate, projectController.addMember);
router.get('/:projectId/members', authenticate, projectController.getMembers);
router.delete('/:projectId/members/:userId', authenticate, projectController.removeMember);

export default router;
