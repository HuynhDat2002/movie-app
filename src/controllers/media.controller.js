import responseHandler from "../handlers/response.handler.js";
import tmdbApi from "../tmdb/tmdb.api.js";
import userModel from "../models/user.model.js";
import tokenMiddleware from "../middlewares/token.middleware.js";
import favoriteModel from "../models/favorite.model.js";


const getList=async(req, res)=>{
    try{
        const {page}=req.query
        const {mediaType,mediaCategory}=req.params

        const response = await tmdbApi.mediaList({mediaType,mediaCategory,page});
    }
    catch{
        responsefHandler.error(res)
    }
}

const getGenres = async (req,res) =>{
    try{
        const {mediaType}=req.params
        const response = await tmdbApi.mediaGenres({mediaType});
        return responseHandler.ok(res,response)
    }
    catch{
        responseHandler.error(res);
    }
}

const search=async (req,res) =>{
    try{
        const {mediaType}=req.params;
        const {query,page}=req.query;

        const response = await tmdbApi.mediaSearch({
            query,
            page,
            mediaType: mediaType === "people"?"person":mediaType
        });

        return responseHandler.ok(res,response)

    }
    catch{
        responseHandler.error(res);
    }
}

const getDetail=async (req, res) => {
    try{
        const {mediaType,mediaId}=req.params;

        const params = {mediaType,mediaId};

        const media=await tmdbApi.mediaDetail(params);

        media.credits=await tmdbApi.mediaCredits(params);

        const videos=await tmdbApi.mediaVideo(params);

        media.videos=videos

        const recommend = await tmdbApi.mediaRecommended(params);

        media.recommend=recommend.results;

        media.images=await tmdbApi.mediaImages(params);

        const tokenDecoded = tokenMiddleware.tokenDecode(req)

        if(tokenDecoded){
            const user = await userModel.getUserById(tokenDecoded.data);

            if(user){
               
                const isFavorite=await favoriteModel.isFavorite(user.user_id,mediaId);
                media.isFavorite=isFavorite !==null;
            }
        }
        responseHandler.ok(res,media);
    }
    catch{
        responsefHandler.error(res);
    }
}


export default {
    getList,getGenres,search,getDetail
}