import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';

import * as mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.AWS_RDS_HOSTNAME,
  user: process.env.AWS_RDS_USER,
  password: process.env.AWS_RDS_PASSWORD,
  database: process.env.AWS_RDS_DATABASE_NAME,
  port: Number(process.env.AWS_RDS_PORT),
  connectionLimit: 1000,
  connectTimeout: (60 * 60 * 1000),
  debug: true
});


export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  try {
    
    const connection = await pool.getConnection();
    // await connection.beginTransaction(); // use transactions to ensure atomicity!

    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS Users (
        userID VARCHAR(25) PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        authProvider ENUM('google', 'custom') NOT NULL,
        accountType ENUM('user', 'admin', 'organizer') NOT NULL,
        accountStatus ENUM('active', 'restricted') NOT NULL,
        profilePicURL VARCHAR(512),
        dateCreated DATE NOT NULL
      );
    `;

    await connection.query(createTableSQL);
    connection.release();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Table Users created successfully!',
      }),
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal Server Error',
      }),
    };
  }
};