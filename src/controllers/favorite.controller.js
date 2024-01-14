import { response } from "express";
import responseHandler from "../handlers/response.handler.js";
import favoriteModel from "../models/favorite.model.js";

const addFavorite = async (req, res) => {

    try{
        const isFavorite = await favoriteModel.isFavorite(req.user.user_id,req.body.mediaId);
        if (isFavorite) return responseHandler.ok(res,isFavorite);

        const {id,title,release,duration,description,rating,genre,quality,status,tagline} = req.body;
        favoriteModel.addFavorite(id,title,release,duration,description,rating,genre,quality,status,tagline);

        const favorite=await favoriteModel.getFavoriteById(id);
        
        responseHandler.created(res,favorite)
    }
    catch{
        responseHandler.error(res)
    }
}

const removeFavorite =async (req,res) => {
    try{
        const {favoriteId} = req.params

        const favorite = await favoriteModel.isFavorite(req.user.user_id,favoriteId)

        if(!favorite) {
            return responseHandler.notFound(res)
        }
        
        favoriteModel.removeFavorite(favoriteId)

        responseHandler.ok(res);

    }
    catch{
        responseHandler.error(res);
    }
}

const getFavoritesOfUser=async (req,res) => {
    try{
        const favorite = await favoriteModel.getFavoriteByUserId(req.user.user_id);

        responseHandler.ok(res,favorite);
    }
    catch{
        responseHandler.error(res);
    }
}

export default{
    addFavorite,
    removeFavorite,
    getFavoritesOfUser
}