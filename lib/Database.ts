const mysql = require('mysql2') ;
import ENV from '@utils/env';



export default class Database {
    
    
    static pool =  mysql.createPool({
            host: `${ENV.DB_URL}`,
            user: `${ENV.DB_USERNAME}`,
            password: `${ENV.DB_PASSWORD}`,
            database: `${ENV.DB_NAME}`
        })
        
    static promisePool = this.pool.promise();
       
    static async execute(message:string, query){
        console.info(`Executing query to ${message}`);
        const [rows, fields] = await this.promisePool.query(query);
        return rows;
    }
}