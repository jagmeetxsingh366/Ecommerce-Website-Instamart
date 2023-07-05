import express from 'express';
import { createCategoryController, deleteCategoryController, getCategoryController, singleCategoryController, updateCategoryController } from '../controllers/categoryControllers.js';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create-category',requireSignIn , isAdmin, createCategoryController);
router.put('/update-category/:id', requireSignIn, isAdmin, updateCategoryController);
router.get('/get-category', getCategoryController);
router.delete('/delete-category/:id', requireSignIn, isAdmin, deleteCategoryController);
router.get('/single-category/:slug', singleCategoryController);

export default router;