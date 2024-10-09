import "dotenv/config";
import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { Socket } from "socket.io-client";
import { NotificationDto } from "src/payload/request/notification.request";

@Injectable()
export class NotificationService implements OnModuleInit, OnModuleDestroy {
  private socket: Socket;

  onModuleInit() {
    this.socket = require("socket.io-client")(process.env.WEBSOCKET_URL);

    this.socket.on("connect", () => {
      console.log("Connected to WebSocket server on port 6666");
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server on port 6666");
    });
  }

  onModuleDestroy() {
    if (this.socket) {
      this.socket.disconnect();
      console.log("WebSocket connection closed");
    }
  }

  logNotification(notification: NotificationDto): void {
    console.log("New Notification:", notification);
    this.sendNotification(notification);
  }

  sendNotification(notification: NotificationDto): void {
    this.socket.emit("sendNotification", notification);
  }
}
