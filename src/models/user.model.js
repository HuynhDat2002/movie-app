import pool from '../../connectionDB.js'


async function addUser(id,username,email,password){
    
}

async function getAll(){
    const [row] = await pool.query(`select * from user`);
    return [row]
}

async function getUserById(id) {
    const [row] = await pool.query(`select * from user where user_id= '${id}'`)
    return row[0]
}

async function getUserByUsername(username) {
    const [row] = await pool.query(
        `select * from user where username = '${username}'`
      );
      return row[0];
}

async function getPasswordByUsername(username){
    const [row]= await pool.query(`SELECT password from user where username ='${username}'`);
    return row[0];
  }


async function getPasswordById(id){
    const [row]= await pool.query(`SELECT password from user where user_id='${id}'`);
    return row[0];
}


async function getIdByUsername(username){
    const [row] = await pool.query(
      `SELECT user_id FROM user where username = ?`,
      [username]
    );
    return row[0];
}

async function getUserByEmail(email){
    const [row] = await pool.query(`
        SELECT * from user WHERE email='${email}'
    `)
    return row[0]
}

export default  {
    getAll,
    getUserById,
    getUserByUsername,
    getPasswordByUsername,
    getPasswordById,
    getIdByUsername,
    getUserByEmail
}
