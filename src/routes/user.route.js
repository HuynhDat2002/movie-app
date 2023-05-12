import express from 'express';
const router = express.Router();

import userController from '../controllers/user.controller.js';

router.get('/signup',(req,res) => {
    res.render('auth/signup');
});

router.get('/signin',(req,res) => {
    res.render('auth/signin');
});

router.get('/updatepassword',(req,res) => {
    res.render('auth/updatepassword');
});
router.post('/signup',userController.signup);
router.post('/signin',userController.signin);
router.post('/updatepassword',userController.updatePassword);

export default router;