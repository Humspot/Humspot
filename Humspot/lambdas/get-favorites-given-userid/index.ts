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

type HumspotFavoriteResponse = {
  activityID: string | null;
  activityType: string;
  addedByUserID: string;
  attractionID: string | null;
  date: string | Date;
  description: string;
  eventID: string;
  latitude: string | number;
  location: string;
  longitude: string | number;
  name: string;
  openTimes: string | null;
  organizer: string;
  time: string;
  websiteUrl: string | null;
}

type AWSGetFavoritesResponse = {
  message: string;
  success: boolean;
  favorites: HumspotFavoriteResponse[];
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
      SELECT 
        a.*,
        e.*,
        attr.*,
        ph.photoUrl
      FROM 
        Favorites f
      JOIN 
        Activities a ON f.activityID = a.activityID
      LEFT JOIN 
        Events e ON a.activityID = e.activityID
      LEFT JOIN 
        Attractions attr ON a.activityID = attr.activityID
      LEFT JOIN 
        (SELECT activityID, photoUrl FROM ActivityPhotos GROUP BY activityID) ph ON a.activityID = ph.activityID
      WHERE 
        f.userID = ?
      ORDER BY 
        f.dateAdded DESC
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