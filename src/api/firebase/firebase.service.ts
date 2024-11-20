import { Injectable, OnModuleInit } from "@nestjs/common";
import * as admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";
import { Readable } from "stream";

@Injectable()
export class FirebaseService implements OnModuleInit {
  onModuleInit() {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
      storageBucket: "travel-vietnam-2cca2.appspot.com",
    });
  }

  getBucket() {
    return admin.storage().bucket();
  }

  async uploadImage(
    file: Express.Multer.File,
    folder: string
  ): Promise<string> {
    const bucket = this.getBucket();
    const fileName = `${folder}/${Date.now()}_${file.originalname}`;
    const fileUpload = bucket.file(fileName);

    const stream = Readable.from(file.buffer);
    await new Promise((resolve, reject) => {
      stream
        .pipe(fileUpload.createWriteStream({ resumable: false }))
        .on("finish", resolve)
        .on("error", reject);
    });

    return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
  }

  async deleteImage(filePath: string): Promise<void> {
    const bucket = this.getBucket();
    await bucket.file(filePath).delete();
  }
}
