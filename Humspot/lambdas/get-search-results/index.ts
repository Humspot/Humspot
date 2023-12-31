/**
 * 
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
    const page = event.pathParameters && event.pathParameters["page"];
    const queryString = event.pathParameters && event.pathParameters["queryString"].toLowerCase();

    if (!page || !queryString) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Invalid path parameters", success: false })
      };
    }
    const pageNum: number = Number(page);
    const offset: number = (pageNum - 1) * 10;

    if (isNaN(pageNum) || pageNum < 1 || !queryString) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Invalid path parameters', success: false }),
      };
    }

    const query: string = 'SELECT * FROM Activities WHERE name LIKE ? OR description LIKE ? LIMIT 10 OFFSET ?';

    const [results] = await conn.query(query, [`%${queryString}%`, `%${queryString}%`, offset]);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Search successful', success: true, results: results }),
    };


  } catch (error) {
    console.error('Query execution error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Internal Server Error, query execution error', success: true }),
    };
  } finally {
    if (conn) {
      conn.release();
    }
  }
};