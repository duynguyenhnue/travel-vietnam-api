import { Injectable, OnModuleInit } from "@nestjs/common";
import * as admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";
import { Readable } from "stream";
import * as firebaseConfig from "../../config/firebase.json";

@Injectable()
export class FirebaseService implements OnModuleInit {
  onModuleInit() {
    const serviceAccount: ServiceAccount = firebaseConfig as ServiceAccount;

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
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
