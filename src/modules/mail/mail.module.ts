import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import * as nodemailer from "nodemailer"
import { MailService } from "./mail.service"

const MailerProvider = {
  provide: "MAILER_TRANSPORT",
  useFactory: async () => {
    return nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: +process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    })
  },
}

@Module({
  imports: [ConfigModule],
  providers: [MailerProvider, MailService],
  exports: [MailService],
})
export class MailModule {}
