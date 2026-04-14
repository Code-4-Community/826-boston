import * as dotenv from 'dotenv';
import { Injectable, Logger } from '@nestjs/common';
import {
  GetObjectCommand,
  NoSuchKey,
  PutObjectCommand,
  S3Client,
  S3ServiceException,
} from '@aws-sdk/client-s3';
dotenv.config();

// TODO: change to get from /images
@Injectable()
export class AWSS3Service {
  private readonly logger = new Logger(AWSS3Service.name);
  private client: S3Client;
  private readonly imagesBucket: string;
  private readonly region: string;

  constructor() {
    this.region = process.env.AWS_IMAGES_BUCKET_REGION || '';
    this.imagesBucket = process.env.AWS_IMAGES_BUCKET_NAME ||;

    if (!this.region) {
      throw new Error('AWS_IMAGES_BUCKET_REGION is not defined');
    }

    if (!this.imagesBucket) {
      throw new Error('AWS_IMAGES_BUCKET_NAME is not defined');
    }

    this.client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: process.env.NX_AWS_ACCESS_KEY,
        secretAccessKey: process.env.NX_AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  /*
  createImageLink(
    youthId: number,
    assignmentId: number,
    bucketName: string,
  ): string {
    const fileName = `${youthId}-${assignmentId}LOR.pdf`;
    return `https://${bucketName}.s3.${this.region}.amazonaws.com/${fileName}`;
  }

  async uploadImage(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
  ): Promise<string> {
    try {
      const s3Bucket = this.mapBucket(this.imageBucket);

      console.log(s3Bucket);
      console.log(fileName);

      const command = new PutObjectCommand({
        Bucket: s3Bucket,
        Key: fileName,
        Body: fileBuffer,
        ContentType: mimeType,
      });

      await this.client.send(command);

      return `https://${s3Bucket}.s3.${this.region}.amazonaws.com/${fileName}`;
    } catch (error) {
      throw new Error('File upload to AWS failed: ' + error);
    }
  }

  mapImageBucket(bucketEnum: s3Buckets): string {
    if (bucketEnum === s3Buckets.LETTERS) {
      return process.env.AWS_LETTERS_BUCKET_NAME;
    } else if (bucketEnum === s3Buckets.IMAGES) {
      return process.env.AWS_IMAGES_BUCKET_NAME;
    }
  }

  async getImageData(objectKey: string): Promise<Uint8Array | null> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.imagesBucket,
        Key: objectKey,
      });

      const response = await this.client.send(command);
      return response.Body.transformToByteArray();
    } catch (error) {
      if (error instanceof NoSuchKey) {
        this.logger.error(
          `Failed to get image ${objectKey} - key does not exist`,
        );
      } else if (error instanceof S3ServiceException) {
        this.logger.error(
          `Failed to get image ${objectKey} - S3 service error (${error.name}: ${error.message})`,
        );
      }

      return null;
    }
  }*/
}
