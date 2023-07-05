import express from 'express';
import { isAdmin , requireSignIn } from '../middlewares/authMiddleware.js';
import { CategoryProductController, braintreeTokenController, briantreePaymentController, createProductController, deleteProductController, getAllProductsController, getProductLengthController, getProductPageController, getProductPhotoController, getSingleProductController, productFilterController, relatedProductController, searchProductController, updateProductController } from '../controllers/productControllers.js';
import formidable from 'express-formidable';

const router = express.Router();

router.post('/create-product' , requireSignIn , isAdmin , formidable(), createProductController);
router.get('/get-product' , getAllProductsController);
router.get('/get-product/:pid' , getSingleProductController);
router.get('/product-photo/:pid' , getProductPhotoController);
router.delete('/delete-product/:pid' ,requireSignIn , isAdmin, deleteProductController);
router.put('/update-product/:pid' , requireSignIn, isAdmin , formidable() , updateProductController);
router.post('/filter-product/' , productFilterController);
router.get('/get-length' , getProductLengthController);
router.get('/get-product-list/:page' , getProductPageController);
router.get('/search/:keyword' , searchProductController );
router.get('/related-products/:pid/:cid' , relatedProductController);
router.get('/braintree/token' , braintreeTokenController);
router.post('/braintree/payment' , requireSignIn , briantreePaymentController); 
router.get('/product-category/:slug' , CategoryProductController);


export default router;