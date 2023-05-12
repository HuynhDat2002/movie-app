import mysql from 'mysql2/promise'

const pool=mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Trongdat@1335',
    database: 'moviesApp'
});

export default pool;