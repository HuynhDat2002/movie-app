import pool from "../../connectionDB.js";
import jsonwebtoken from "jsonwebtoken";
import responseHandler from "../handlers/response.handler.js";
import shortid from "shortid";
import dotenv from "dotenv";
//import { response } from "express";
import md5 from "md5";
import { checkSchema } from "express-validator";

dotenv.config();

const signup = async (req, res) => {
  try {
    req.body.id = shortid.generate();
    const { username, email, password } = req.body;
    var hashPassword = md5(password);
    async function findUser(){
      const [row] = await pool.query(`select * from user where username = ?`,[username]);
      return row[0];
    }
    const checkUser = await findUser();

    if (checkUser) return responseHandler.badRequest(res, "Username already existed");
    await pool.query(
      `Insert into user values (?,?,?,?)`,[
        req.body.id, username, email, hashPassword
      ]
    );
    async function getId(){
      const [row]=await pool.query(`SELECT user_id FROM user where username = ?`,[username]);
    }
    const idUserCreated = await getId();
   
    const token = jsonwebtoken.sign(
      { data: idUserCreated },
      process.env.TOKEN_SECRET,
      { expiresIn: "24h" }
    );

    // async function getUser(){
    //   const [row] = await pool.query(`select * from user where username = ?`, [username]);
    //   return row[0];
    // }
    const user = await getUser();

    responseHandler.created(res, {
      token:token,
      ...checkUser,
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
    async function getUser() {
      const [row] = await pool.query(
        `select * from user where username = '${username}'`
      );
      return row[0];
    }
    const user = await getUser();

    if (!user) return responseHandler.badRequest(res, "User not exist");
    async function getPassword(){
      const [row]= await pool.query(`SELECT password from user where username ='${username}'`);
      return row[0];
    }

    const passwordCheck = await getPassword();
    const hashPassword=await md5(password);
    console.log(hashPassword);
    if (hashPassword !== passwordCheck.password)
      return responseHandler.badRequest(res, "Wrong password");

    async function getId(){
      const [row] = await pool.query(
        `SELECT user_id FROM user where username = ?`,
        [username]
      );
      return row[0];
    }

    const idUserCreated= await getId();
    

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

    async function getUser(){
      const [row] = await pool.query(`select * from user where user_id = '${req.user.user_id}'`);
      return row[0];
    }
    const user = await getUser();

    if (!user) return responseHandler.unauthorized(res);

    async function getPassword(){
      const [row]= await pool.query(`SELECT password from user where user_id='${req.user.user_id}'`);
      return row[0];
    }

    const passwordCheck = await getPassword();

    if (hashPassword !== passwordCheck)
      return responseHandler.badRequest(res, "Wrong password");

    await pool.query(`update user set password=${hashPassword} where user_id='${req.user.user_id}'`)
    responseHandler.ok(res,user);
  } catch {
    responseHandler.error(res);
  }
};

const getInfo =async (req, res) => {
    try{
      async function getUser(){
        const [row] = await pool.query(`select * from user where user_id = '${req.user.user_id}'`);
        return row[0];
      }
      const user = await getUser();
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