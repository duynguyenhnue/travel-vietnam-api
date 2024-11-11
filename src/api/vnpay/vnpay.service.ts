import { Injectable } from "@nestjs/common";
import * as crypto from "crypto";
import moment from "moment";
import * as qs from "qs";
import { BookingService } from "../booking/booking.service";
import { BookingType } from "src/enums/booking.enum";

@Injectable()
export class VnpayService {
  constructor(private readonly bookingService: BookingService) {}
  private tmnCode = process.env.VNPAY_TMN_CODE;
  private secretKey = process.env.VNPAY_HASH_SECRET;
  private vnpUrl = process.env.VNPAY_URL;
  private returnUrl = process.env.VNPAY_RETURN_URL;

  async getTypeBooking(code, status) {
    return (await this.bookingService.getBookingByCode(code, status))
      .bookingType;
  }

  async createPaymentUrl(
    body: {
      amount: number;
      bookingType: BookingType;
      guestSize: number;
      orderId: string;
    },
    userId: string
  ): Promise<string> {
    try {
      // Đặt múi giờ
      process.env.TZ = "Asia/Ho_Chi_Minh";

      const date = new Date();
      const createDate = moment(date).format("YYYYMMDDHHmmss");
      const orderId = moment(date).format("DDHHmmss");
      const amount = body.amount;

      // Kiểm tra giá trị số tiền
      if (!amount || amount <= 0) {
        throw new Error("Invalid amount");
      }

      let vnp_Params: any = {
        vnp_Version: "2.1.0",
        vnp_Command: "pay",
        vnp_TmnCode: this.tmnCode,
        vnp_Locale: "vn",
        vnp_CurrCode: "VND",
        vnp_TxnRef: orderId,
        vnp_OrderInfo: `Thanh toan cho ma GD:${orderId}. So tien ${amount} VND`,
        vnp_OrderType: "other",
        vnp_Amount: amount * 100,
        vnp_ReturnUrl: this.returnUrl,
        vnp_IpAddr: "127.0.0.1",
        vnp_CreateDate: createDate,
      };

      // Sắp xếp và tạo mã kiểm tra
      vnp_Params = await this.sortObject(vnp_Params);

      const signData = qs.stringify(vnp_Params, { encode: false });
      const hmac = crypto.createHmac("sha512", this.secretKey);
      const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
      vnp_Params["vnp_SecureHash"] = signed;

      await this.bookingService.createBooking({
        amount,
        userId: userId,
        orderId: body.orderId,
        vnpayCode: orderId,
        guestSize: body.guestSize,
        bookingType: body.bookingType,
      });

      return `${this.vnpUrl}?${qs.stringify(vnp_Params, { encode: false })}`;
    } catch (error) {
      console.error("Error in createPaymentUrl:", error.message);
      throw new Error("Failed to create payment URL");
    }
  }

  async verifyReturn(vnpParams: any): Promise<boolean> {
    let secureHash = vnpParams.vnp_SecureHash;
    const secretKey = process.env.VNPAY_HASH_SECRET;

    vnpParams = await this.sortObject(vnpParams);

    let signData = qs.stringify(vnpParams, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    return secureHash === signed;
  }

  async sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
      }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
  }
}
