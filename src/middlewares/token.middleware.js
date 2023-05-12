import Jsonwebtoken from "jsonwebtoken";
import responseHandler from "../handlers/response.handler";
import pool from "../../connectionDB.js";
import dotenv from "dotenv";
dotenv.config()

const tokenDecode=(req)=>{
    try{
        const beaberHeader=req.headers["authorization"];
        if(beaberHeader){
            const token=beaberHeader.split(" ")[1];
            return Jsonwebtoken.verify(
                token,
                process.env.TOKEN_SECRET
            )
        }
        return false;
    }
    catch{
        return false;
    }
};

const auth =async (req, res,next) => {
    const tokenDecoded=tokenDecode(req);
    if(!tokenDecoded) return responseHandler.unauthorized(res)
    async function getUser() {
        const [row] = await pool.query(`SELECT * FROM user where user_id=?`,[tokenDecoded.data])
        return row[0];
    }
    const user = await getUser();
    if(!user) return responseHandler.unauthorized(res);
    req.user=user;
    next();
};

export default {auth, tokenDecode}