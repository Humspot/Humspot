/**
 * AWS lambda function to retrieve a user's info based on their userID.
 */

import { Context, APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";

import * as mysql from 'mysql2/promise';

const pool: mysql.Pool = mysql.createPool({
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
  context.callbackWaitsForEmptyEventLoop = false;
  const conn = await pool.getConnection();
  try {
    const userID = event.pathParameters && event.pathParameters["userID"];

    if (!userID) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Invalid path parameters", success: false, info: {} })
      };
    }

    const query: string = `
      SELECT *
      FROM Users
      WHERE userID = ?
    `;

    const [rows]: any = await conn.query(query, [userID]);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: "Successfully got user info for userID: " + userID, success: true, info: rows[0] }),
    };

  } catch (error) {
    console.error('Query execution error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Internal Server Error, query execution error', success: false, info: {} }),
    };
  } finally {
    if (conn) {
      conn.release();
    }
  }
};
