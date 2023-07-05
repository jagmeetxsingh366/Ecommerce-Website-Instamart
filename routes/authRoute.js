import express from 'express';
import { registerController , loginController, testController, updateProfileController, getOrders, getAllOrders, orderStatusController} from '../controllers/authControllers.js';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register' , registerController);
router.post('/login' , loginController);
router.get('/test' ,requireSignIn, isAdmin, testController);
router.get('/user-auth' , requireSignIn , (req ,res)=>{
    res.status(200).send({
        ok : true
    });
})

router.get('/admin-auth', requireSignIn , isAdmin, (req , res)=>{
    res.status(200).send({
        ok : true
    });
});


router.put('/profile' , requireSignIn , updateProfileController);
router.get('/orders' , requireSignIn , getOrders);
router.get('/all-orders',requireSignIn , getAllOrders);
router.put('/order-status/:oid' , requireSignIn , orderStatusController);

export default router;