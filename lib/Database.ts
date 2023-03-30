import mysql from 'mysql';
import {RowDataPacket} from 'mysql';

export default class Database {
    
    
    static async dbConnection(db_host:string, db_name:string, db_username:string, db_password:string){
        const db = mysql.createConnection({
            host: db_host,
            user: db_username,
            password: db_password,
            database: db_name
        });

        return db
    }

    static async execute(con, query:string){
        con.query(
            query,
            (err, result) => {
              if (err) throw err;
              const row = (<RowDataPacket> result)[0];
              console.log(row)
            }
          );
    }
}