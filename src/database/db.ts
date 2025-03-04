import mysql, { ConnectionOptions, ResultSetHeader, RowDataPacket } from 'mysql2/promise';

const config: ConnectionOptions = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'db_gestion_transporte',
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0,
}

const pool = mysql.createPool(config);

class Database {
    async query<T extends RowDataPacket[] | ResultSetHeader> (query: string, values: any = null) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(query, values);
            return rows as T;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }
}

export default new Database();
