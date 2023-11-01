/**
 * AWS lambda function to retrieve a User's favorites from the database given the page number and the userID.
 * Each page pulls 10 favorites from the database. 
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

type FavoriteResponse = {
  activityID: string | null;
  activityType: 'event' | 'attraction' | 'custom';
  name: string;
  description: string;
  location: string;
  photoUrl: string | null;
}

type AWSGetFavoritesResponse = {
  message: string;
  success: boolean;
  favorites: FavoriteResponse[];
};



export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  context.callbackWaitsForEmptyEventLoop = false;
  const conn = await pool.getConnection();
  try {
    const page = event.pathParameters && event.pathParameters["page"];
    const userID = event.pathParameters && event.pathParameters["userID"];

    if (!page || !userID) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Invalid path parameters" })
      };
    }
    const pageNum: number = Number(page);
    const offset: number = (pageNum - 1) * 10;

    if (isNaN(pageNum) || pageNum < 1 || !userID) {
      const resBody: AWSGetFavoritesResponse = { message: 'Invalid path parameters', success: false, favorites: [] };
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resBody),
      };
    }

    const query: string = `
      SELECT a.activityID, a.name, a.description, a.location,
        (SELECT p.photoUrl FROM ActivityPhotos p WHERE p.activityID = a.activityID LIMIT 1) as photoUrl
      FROM Favorites f
      JOIN Activities a ON f.activityID = a.activityID
      WHERE f.userID = ?
      LIMIT 10 OFFSET ?;
    `;

    const [rows]: any = await conn.query(query, [userID, offset]);

    const resBody: AWSGetFavoritesResponse = { message: "Favorites query successful", success: true, favorites: rows };
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resBody),
    };

  } catch (error) {
    console.error('Query execution error:', error);
    const resBody: AWSGetFavoritesResponse = { message: 'Internal Server Error, query execution error', success: false, favorites: [] };
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resBody),
    };
  } finally {
    if (conn) {
      conn.release();
    }
  }
};