import {
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import s3 from "../config/s3Client";

export class ImageUploadService {
  private bucketName: string;
  private region: string;

  constructor() {
    this.bucketName = process.env.AWS_BUCKET_NAME || "eshop-files";
    this.region = process.env.AWS_REGION || "us-east-1";
  }

  private getPublicUrl(key: string): string {
    return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
  }

  private extractS3KeyFromUrl(url: string): string {
    const urlParts = url.split(
      `https://${this.bucketName}.s3.${this.region}.amazonaws.com/`
    );
    return urlParts[1] || "";
  }

  private async uploadFileToS3(
    file: Express.Multer.File
  ): Promise<{ Location: string; Key: string; Bucket: string; ETag: string }> {
    const key = `uploads/${uuidv4()}-${file.originalname}`;

    const params: PutObjectCommandInput = {
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    };

    try {
      const command = new PutObjectCommand(params);
      const response = await s3.send(command);

      return {
        Location: this.getPublicUrl(key),
        Key: key,
        ETag: response.ETag!,
        Bucket: this.bucketName,
      };
    } catch (error) {
      throw new Error(`Failed to upload image: ${error}`);
    }
  }

  public async uploadImageToS3(
    file: Express.Multer.File
  ): Promise<{ Location: string; Key: string; Bucket: string; ETag: string }> {
    return this.uploadFileToS3(file);
  }

  public async uploadImagesToS3(
    files: Express.Multer.File[]
  ): Promise<string[]> {
    const imageUrls: string[] = [];

    for (const file of files) {
      try {
        const uploadResult = await this.uploadFileToS3(file);
        imageUrls.push(uploadResult.Location);
      } catch (error) {
        throw new Error(`Failed to upload image: ${error}`);
      }
    }

    return imageUrls;
  }

  public async deleteImageFromS3(imageUrl: string): Promise<void> {
    const key = this.extractS3KeyFromUrl(imageUrl);
    if (!key) {
      throw new Error(`Invalid image URL: ${imageUrl}`);
    }

    const params = {
      Bucket: this.bucketName,
      Key: key,
    };

    try {
      const command = new DeleteObjectCommand(params);
      await s3.send(command);
      console.log(`Image deleted successfully: ${imageUrl}`);
    } catch (error) {
      throw new Error(`Failed to delete image: ${error}`);
    }
  }

  public async deleteImagesFromS3(keys: string[]): Promise<void> {
    for (const key of keys) {
      await this.deleteImageFromS3(key);
    }
  }
}
