import pool from "../../connectionDB.js";

async function isFavorite(user_id,favorite_id){

    const [row]=await pool.query(`
        SELECT fv.favorite_id,fv.title,fv.release,fv.duration,fv.description,fv.rating, fv.genre,fv.quality,fv.status,fv.tagline
        FROM (favorite as fv INNER JOIN favorite_user as fu ON fv.favorite_id = fu.favorite_id AND fu.favorite_id='${favorite_id}')
        INNER JOIN user ON user.user_id = fu.user_id AND fu.user_id='${user_id}'
    `);

    return row[0];
}

async function addFavorite(id,title,release,duration,description,rating,genre,quality,status,tagline){
    await pool.query(`
        INSERT INTO favorites values (?,?,?,?,?,?,?,?,?,?)
    `,[id,title,release,duration,description,rating,genre,quality,status,tagline]);
}

async function getFavoriteById(id) {
    const [row]=await pool.query(` 
        SELECT *
        FROM favorite
        WHERE favorite_id = '${id}'
    `)
    return row[0];
}

async function getFavoriteByUserId(userId) {
    const [row]=await pool.query(`
        SELECT fv.favorite_id,fv.title,fv.release,fv.duration,fv.description,fv.rating, fv.genre,fv.quality,fv.status,fv.tagline
        FROM (favorite as fv INNER JOIN favorite_user as fu ON fv.favorite_id = fu.favorite_id)
        INNER JOIN user ON user.user_id = fu.user_id AND fu.user_id='${userId}'
    `)
    return [row]
}

async function removeFavorite(id){
    await pool.query(`
        DELETE FROM favorite WHERE favorite_id = '${id}'
    `)    
}
export default{
    isFavorite,
    addFavorite,
    getFavoriteById,
    getFavoriteByUserId,
    removeFavorite

}