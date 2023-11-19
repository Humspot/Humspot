/**
 * AWS lambda function which adds an image to the activityphotos bucket in S3
 * 
 * NOTE: This function name is add-comment-image, so use this when updating!
 */

import { APIGatewayEvent, Context, APIGatewayProxyResult } from 'aws-lambda';
import * as AWS from 'aws-sdk'
import * as crypto from 'crypto';

// Configure AWS outside the handler for better performance
AWS.config.update({
  accessKeyId: process.env.MY_AWS_ACCESS_KEY,
  secretAccessKey: process.env.MY_AWS_SECRET_KEY,
  region: "us-west-1",
});

const s3 = new AWS.S3();

export const handler = async (gatewayEvent: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  console.log(gatewayEvent.body);
  const { photoType, activityName, folderName, bucketName, isUnique } = JSON.parse(gatewayEvent.body);
  if (!activityName || !photoType || !folderName || !bucketName) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, message: 'Missing photoUrl or image data', uploadUrl: '', bucketName: '', region: '', key: '' }),
    };
  }

  let key: string = `${folderName}/${activityName}`;
  if (isUnique) {
    const id: string = crypto.randomBytes(16).toString('hex');
    key = `${folderName}/${activityName}${id}-${Date.now()}`;
  }

  const s3Params = {
    Bucket: bucketName,
    Key: key,
    ContentType: photoType,
    Expires: 60,
  };

  try {
    const uploadUrl = s3.getSignedUrl('putObject', s3Params);
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "got pre-signed URL", uploadUrl: uploadUrl, bucketName: bucketName, region: 'us-west-1', key: key }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'Error generating pre-signed URL', uploadUrl: '', bucketName: '', region: '', key: '' }),
    };
  }
};
