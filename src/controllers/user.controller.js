import pool from "../../connectionDB.js";
import jsonwebtoken from "jsonwebtoken";
import responseHandler from "../handlers/response.handler.js";
import shortid from "shortid";
import dotenv from "dotenv";
import userModel from "../models/user.model.js"
//import { response } from "express";
import md5 from "md5";
import { checkSchema } from "express-validator";

dotenv.config();

const signup = async (req, res) => {
  try {
    req.body.id = shortid.generate();
    const { username, email, password } = req.body;
    var hashPassword = md5(password);

    const checkUser = await userModel.getUserByUsername(username);

    if (checkUser) return responseHandler.badRequest(res, "Username already existed");

    await pool.query(
      `Insert into user values (?,?,?,?)`,[
        req.body.id, username, email, hashPassword
      ]
    );
  
    const idUserCreated = await userModel.getIdByUsername(username);
    const user=await userModel.getUserById(idUserCreated)
    const token = jsonwebtoken.sign(
      { data: idUserCreated },
      process.env.TOKEN_SECRET
    
    );

    // async function getUser(){
    //   const [row] = await pool.query(`select * from user where username = ?`, [username]);
    //   return row[0];
    // }
    //const user = await getUser();

    responseHandler.created(res, {
      token:token,
      ...user,
      id: idUserCreated,
    });
    //res.redirect('/auth/signup');
  } catch {
    responseHandler.error(res);
  }
 
};

const signin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user=await userModel.getUserByUsername(username);

    if (!user) return responseHandler.badRequest(res, "User not exist");
  
    const passwordCheck = await userModel.getPasswordByUsername(username);

    const hashPassword=await md5(password);
    console.log(hashPassword);
    if (hashPassword !== passwordCheck.password)
      return responseHandler.badRequest(res, "Wrong password");

    const idUserCreated= await userModel.getIdByUsername(username);
    
    const token = jsonwebtoken.sign(
      { data: idUserCreated },
      process.env.TOKEN_SECRET,
      { expiresIn: "24h" }
    );

    responseHandler.created(res, {
      token:token,
      ...user,
      id: idUserCreated
    });
  } catch {
    responseHandler.error(res);
  }
  
};

const updatePassword = async (req, res) => {
  try {
    const { password, newPassword } = req.body;
    const hashPassword = md5(password);

    const user = await userModel.getUserById(req.user.user_id);

    if (!user) return responseHandler.unauthorized(res);

    const passwordCheck = await userModel.getPasswordById(req.user.user_id);

    if (hashPassword !== passwordCheck)
      return responseHandler.badRequest(res, "Wrong password");

    //update password
    await pool.query(`update user set password=${hashPassword} where user_id='${req.user.user_id}'`)

    responseHandler.ok(res,user);
  } catch {
    responseHandler.error(res);
  }
};

const getInfo =async (req, res) => {
    try{
      const user = await userModel.getUserById(req.user.user_id);
        if(!user) return responseHandler.notFound(res);
        responseHandler.ok(res,user);
    }
    catch{
        responseHandler.error(res);
    }
}

export default {
    signup,
    signin,
    updatePassword,
    getInfo
}