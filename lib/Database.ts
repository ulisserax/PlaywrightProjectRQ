const mysql = require('mysql2') ;
//import {RowDataPacket} from 'mysql2';

export default class Database {
    
    
    static async dbConnection(db_host, db_name, db_username, db_password, query){
        //const db = mysql.createConnection(`mysql://${db_username}:${db_password}@${db_host}/${db_name}`);
        const con = await mysql.createConnection({
            host: `${db_host}`,
            user: `${db_username}`,
            password: `${db_password}`,
            database: `${db_name}`
        })

        // const sql = `SELECT metaValue FROM ${this.table} WHERE metaKey = '${key}'`;
        // const result = await this.pool.query(sql);
        // console.log(result);
        // result.forEach(row => {
        //     console.log(row.metaValue)
        // })
        // await con.promise().query({ sql: query, rowsAsArray: true }, function(err, results, fields) {
        //     console.log(results) // will be an array of arrays rather than an array of objects
        //     console.log(fields) // these are unchanged
        //   });
    }

    static async execute(con, q){
        await con.query({ sql: q, rowsAsArray: true }, function(err, results, fields) {
            console.log(results) // will be an array of arrays rather than an array of objects
            console.log(fields) // these are unchanged
          });
    }
}