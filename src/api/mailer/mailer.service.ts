
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import * as nodemailer from 'nodemailer';
import { EmailRequestDto } from 'src/payload/request/mailer.request';

@Injectable()
export class MailerService {
    private transporter: nodemailer.Transporter;

    constructor(
    ) {
        this.transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.ACCOUNT_MAIL,
                pass: process.env.PASSWORD_MAIL,
            },
        });
    }

    async sendEmail(data: EmailRequestDto): Promise<string> {
        if (data.body) {
            const mailOptions = {
                from: process.env.ACCOUNT_MAI,
                to: data.recipient,
                subject: data.subject,
                text: data.body,
            };
            await this.transporter.sendMail(mailOptions);
            return `Content has been sent to email ${data.recipient}`;
        }
        else {
            return "You must submit content";
        }
    }
}