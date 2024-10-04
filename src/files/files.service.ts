import { Injectable } from '@nestjs/common';
import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FilesService {
  private client: S3Client;
  private bucketName: string = this.configService.getOrThrow('S3_BUCKET_NAME');

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const s3_region = this.configService.getOrThrow('S3_REGION');

    if (!s3_region) {
      throw new Error('S3_REGION not found in environment variables');
    }

    this.client = new S3Client({
      region: s3_region,
      credentials: {
        accessKeyId: this.configService.getOrThrow('S3_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow('S3_SECRET_ACCESS_KEY'),
      },
    });
  }

  async upload(key: string, file: Express.Multer.File) {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const presignedUrl = await this.createPresignedUrl({
        command,
      });

      return firstValueFrom(
        this.httpService.put(presignedUrl, file.buffer, {
          headers: {
            'Content-Length': new Blob([file.buffer]).size,
            'Content-Type': file.mimetype,
          },
        }),
      );
    } catch (err) {
      console.error(err);
    }
  }

  async download(key) {
    try {
      const headObjectCommand = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      try {
        await this.client.send(headObjectCommand);
      } catch (err) {
        if (err.$metadata.httpStatusCode == 404) {
          return null;
        }
      }

      const getObjectCommand = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      return this.createPresignedUrl({
        command: getObjectCommand,
      });
    } catch (err) {
      console.error(err);
    }
  }

  private createPresignedUrl = async ({
    command,
  }: {
    command: GetObjectCommand | PutObjectCommand;
  }) => {
    return getSignedUrl(this.client, command, { expiresIn: 3600 });
  };
}

// https://care-for-farm-animals-system-bucket.s3.eu-north-1.amazonaws.com
// /Screenshot%20from%202024-08-01%2011-45-42.png?
// response-content-disposition=inline&
// X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHIaCmV1LW5vcnRoLTEiRzBFAiAkqbywWTBf%2BFuoCa0KGjQn5YcFbuHXOkdhcjtwM%2BnKdgIhAKKnx9gCziIelvCijyXAPGDi8bLWKs3M4%2F6rAQAYoIeqKoYDCLv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMMjExMTI1NTUzNjM3Igw%2FrYABaK2UY%2FXUDO0q2gIjML0jmei5oUY5pybWV4uaPSEy50tmUdf3uxEHnjVLEfQhdmMW8Ab6nHjRBv4X8Vc%2Ba2stgRMSvY8VPc4i1lDjUTlZCvXUNAPJavYnbflI4IjMxbchX7rTJj%2BV%2BDWk167B%2Fb1jXxoqWQEVFwOktzV5rHYIeUaQZiEV%2BsODoJY1lVLEJW5pXduP4WqLxmArbApuObp0GBr72v8uiYho8kB3CVCim85mVsxGMDQp9RYVN5HSu5teYvRhfiPyfDJJ%2BudHk9ov8KrHbn0VYe9ix8HaqKgHLVmiw05wbm3t6YPxBCvYPW9Hw6OEaBmCBSjQNQ9ULItrdMO%2Fd1%2FQKSTYHeu3wtgOSiZ4qavCyntD1znlNLT79werCquFVPqxFV5%2FP4kX2iV9P7fDFhSPiR8dA4KDCsWx73qlSfxyMY%2F5eAkjq6ju76co47CyS64YXvYC3VBnRZRec3XrV8ooMKfS%2BbcGOrMCb1VGZjnGkGnYX8Qxb99pvFkr%2B4e3SJhvuQ0RBRhIQ6WBF%2B5P47683Ua01VZbhmWHawLNEx4j%2FXdoohIsE8XYV0KhIwZFBwcpafMrybCAToJQwkgWuM9Hb0H9ZS1YAPvhQSj8XwqEv66x3eVVhFRNJDTcJnw6%2BA8y1vTx83RSCqXHKNg8uNjA6a2uVPvcJX9BZSXpU4wdSueXtuCemV1ztR%2Bio2F7HDihonbNk%2BZjRcTqQtYgIZpHDuYWIxB8CqkQSin5pWCajnQ6VwpGhUucSDWTNpArPvKE8nDG6fgZPx%2FR0nAIuSus%2FRe1B1SXcYeHvvD5MF74Upc9Lgpr3FoPGxnFVh6mK4brqhrt8gwsdwifqETONYlnMEYQ6G81qQ8vRniAfzpWwtcZHWeOS2FEnHs7rw%3D%3D
// &X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20241003T120352Z&X-Amz-SignedHeaders=host&X-Amz-Expires=2520&X-Amz-Credential=ASIATCKAQJHSSN66OT4K%2F20241003%2Feu-north-1%2Fs3%2F
// aws4_request&X-Amz-Signature=9b312d34f0a69dacd08bfcf7e978bbc445c987083393280b775cdc1d3be5235

// https://care-for-farm-animals-system-bucket.s3.eu-north-1.amazonaws.com
// /Screenshot%20from%202024-08-01%2011-45-42.png?
// X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIATCKAQJHS3N7HOVOE%2F20241003%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20241003T115947Z&X-Amz-Expires=3600&X-Amz-Signature=c349ec83a2a64f02d1f6dbc7d89b2261196682742f71daedcd98287be47a4765&X-Amz-SignedHeaders=host&x-id=GetObject
