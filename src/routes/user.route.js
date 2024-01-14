import express from 'express';
import {body} from 'express-validator';
import favoriteController from '../controllers/favorite.controller.js';
import userController   from '../controllers/user.controller.js';
import requestHandler from '../handlers/request.handler.js';
import userModel from '../models/user.model.js';
import tokenMiddleware from '../middlewares/token.middleware.js';
//import userController from '../controllers/user.controller.js';

const router = express.Router();



router.post(
    '/signup',
    body("username")
    .exists().withMessage("username is required")
    .isLength({min:8}).withMessage("username minimum 8 characters")
    .custom(async value=>{
        const user=await userModel.getUserByUsername(value);
        if(user) return Promise.reject("Username already used")
    }),

    body("password")
    .exists().withMessage("password is required")
    .isLength({min:8}).withMessage("password minimum 8 characters"),

    
    body("confirmPassword").isLength({min:8}).withMessage("")
    .custom((value,{req})=>{
        if(value !== req.body.password) throw new Error("confirmPassword not match")
        return true
    }),

    body("email")
    .exists().withMessage("email is required")
    .isLength({min:8}).withMessage("example@gmail.com")
    .custom(async value=>{
        const user=await userModel.getUserByEmail(value);
        if(user) return Promise.reject("Email already used")
    }),

    requestHandler.validate,
    userController.signup
);


router.post(
    '/signin',
    body("username")
    .exists().withMessage("username is required")
    .isLength({min:5}).withMessage("username minimum 8 characters"),
    body("password")
    .exists().withMessage("password is required")
    .isLength({min:5}).withMessage("password minimum 8 characters"),
    requestHandler.validate,
    userController.signin
    
);

router.put(
    '/updatepassword',
    tokenMiddleware.auth,
    body("username")
    .exists().withMessage("username is required")
    .isLength({min:8}).withMessage("username minimum 8 characters"),

    body("password")
    .exists().withMessage("password is required")
    .isLength({min:8}).withMessage("password minimum 8 characters"),

    body("newPassword")
    .exists().withMessage("new assword is required")
    .isLength({min:8}).withMessage("newPassword minimum 8 characters"),

    body("confirmNewPassword")
    .exists().withMessage("confirmNewPassword is required")
    .isLength({min:8}).withMessage("confirmNewPassword minimum 8 characters")
    .custom((value,{req})=>{
        if(value!==req.body.newPassword) throw new Error("confirmNewPassword not match");
        return true;
    }),

    requestHandler.validate,
    userController.updatePassword
);

router.get(
    '/info',
    tokenMiddleware.auth,
    userController.getInfo
);

router.get(
    '/favorites',
    tokenMiddleware.auth,
    favoriteController.getFavoritesOfUser
)

router.post(
    '/favorites',
    tokenMiddleware.auth,
    body("favoriteId")
    .exists().withMessage("favoriteId is required")
    .isLength({min:1}).withMessage("favoriteId can not be empty"),
    body("title")
    .exists().withMessage("title is required"),
    body("release")
    .exists().withMessage("release is required"),
    body("duration")
    .exists().withMessage("duration is required"),
    body("description")
    .isLength({min:0}).withMessage("description"),
    body("rating")
    .exists().withMessage("rating is required"),
    body("genre")
    .exists().withMessage("genre is required"),
    body("quality")
    .exists().withMessage("quality is required"),
    body("status")
    .exists().withMessage("status is required"),
    body("tagline")
    .isLength({min:0}).withMessage("tagline"),  
    favoriteController.addFavorite
);

router.delete(
    "/favorites/:favoriteId",
    tokenMiddleware.auth,
    favoriteController.removeFavorite
);

  
export default router;