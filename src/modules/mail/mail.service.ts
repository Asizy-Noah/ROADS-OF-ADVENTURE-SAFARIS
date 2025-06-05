import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import * as nodemailer from "nodemailer"
import { User } from "../users/schemas/user.schema"
import { Blog } from "../blogs/schemas/blog.schema"
import { Subscriber } from "../subscribers/schemas/subscriber.schema"
import { Booking } from "../bookings/schemas/booking.schema"

@Injectable()
export class MailService {
  private transporter

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>("MAIL_HOST"),
      port: this.configService.get<number>("MAIL_PORT"),
      secure: this.configService.get<boolean>("MAIL_SECURE"),
      auth: {
        user: this.configService.get<string>("MAIL_USER"),
        pass: this.configService.get<string>("MAIL_PASSWORD"),
      },
    })
  }

  async sendNewAgentNotification(agent: User): Promise<void> {
    const adminEmail = this.configService.get<string>("ADMIN_EMAIL") || "asiomizunoah@gmail.com"

    await this.transporter.sendMail({
      from: `"Roads of Adventure Safaris" <${this.configService.get<string>("MAIL_FROM")}>`,
      to: adminEmail,
      subject: "New Agent Registration",
      html: `
        <h1>New Agent Registration</h1>
        <p>A new agent has registered and is awaiting approval:</p>
        <ul>
          <li><strong>Name:</strong> ${agent.name}</li>
          <li><strong>Email:</strong> ${agent.email}</li>
          <li><strong>Company:</strong> ${agent.companyName || "N/A"}</li>
          <li><strong>Phone:</strong> ${agent.phoneNumber || "N/A"}</li>
          <li><strong>Country:</strong> ${agent.country || "N/A"}</li>
        </ul>
        <p>Please login to the dashboard to approve or reject this agent.</p>
      `,
    })
  }

  async sendAgentActivationEmail(agent: User): Promise<void> {
    await this.transporter.sendMail({
      from: `"Roads of Adventure Safaris" <${this.configService.get<string>("MAIL_FROM")}>`,
      to: agent.email,
      subject: "Your Agent Account has been Activated",
      html: `
        <h1>Account Activated</h1>
        <p>Dear ${agent.name},</p>
        <p>Your agent account with Roads of Adventure Safaris has been approved and activated. You can now log in to the dashboard and start managing tours.</p>
        <p><a href="${this.configService.get<string>("WEBSITE_URL")}/auth/login">Click here to login</a></p>
        <p>Thank you for partnering with us!</p>
      `,
    })
  }

  async sendAgentDeactivationEmail(agent: User): Promise<void> {
    await this.transporter.sendMail({
      from: `"Roads of Adventure Safaris" <${this.configService.get<string>("MAIL_FROM")}>`,
      to: agent.email,
      subject: "Your Agent Account has been Deactivated",
      html: `
        <h1>Account Deactivated</h1>
        <p>Dear ${agent.name},</p>
        <p>Your agent account with Roads of Adventure Safaris has been deactivated. Please contact our admin team for more information.</p>
        <p>Email: ${this.configService.get<string>("ADMIN_EMAIL") || "asiomizunoah@gmail.com"}</p>
      `,
    })
  }

  async sendPasswordResetEmail(user: User, token: string): Promise<void> {
    const resetUrl = `${this.configService.get<string>("WEBSITE_URL")}/auth/reset-password/${token}`

    await this.transporter.sendMail({
      from: `"Roads of Adventure Safaris" <${this.configService.get<string>("MAIL_FROM")}>`,
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <h1>Password Reset</h1>
        <p>Dear ${user.name},</p>
        <p>You requested a password reset. Please click the link below to reset your password:</p>
        <p><a href="${resetUrl}">Reset Password</a></p>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
      `,
    })

    console.log(`Reset link: ${resetUrl}`);
  }

  async sendPasswordChangedEmail(user: User): Promise<void> {
    await this.transporter.sendMail({
      from: `"Roads of Adventure Safaris" <${this.configService.get<string>("MAIL_FROM")}>`,
      to: user.email,
      subject: "Password Changed Successfully",
      html: `
        <h1>Password Changed</h1>
        <p>Dear ${user.name},</p>
        <p>Your password has been changed successfully.</p>
        <p>If you did not make this change, please contact us immediately.</p>
      `,
    })
  }

  async sendNewBlogNotification(blog: Blog, subscribers: Subscriber[]): Promise<void> {
    const blogUrl = `${this.configService.get<string>("WEBSITE_URL")}/blogs/${blog.slug}`

    // Send to each subscriber
    for (const subscriber of subscribers) {
      await this.transporter.sendMail({
        from: `"Roads of Adventure Safaris" <${this.configService.get<string>("MAIL_FROM")}>`,
        to: subscriber.email,
        subject: `New Safari Update: ${blog.title}`,
        html: `
          <h1>${blog.title}</h1>
          <p>${blog.excerpt || blog.content.substring(0, 200)}...</p>
          <p><a href="${blogUrl}">Read More</a></p>
          <p>Thank you for subscribing to our newsletter!</p>
          <p>If you no longer wish to receive these emails, please <a href="${this.configService.get<string>("WEBSITE_URL")}/unsubscribe?email=${subscriber.email}">unsubscribe</a>.</p>
        `,
      })
    }
  }

  async sendSubscriptionConfirmation(subscriber: Subscriber): Promise<void> {
    await this.transporter.sendMail({
      from: `"Roads of Adventure Safaris" <${this.configService.get<string>("MAIL_FROM")}>`,
      to: subscriber.email,
      subject: "Welcome to Roads of Adventure Safaris Newsletter",
      html: `
        <h1>Thank You for Subscribing!</h1>
        <p>Dear ${subscriber.name || "Subscriber"},</p>
        <p>Thank you for subscribing to our newsletter. You will now receive updates about our latest safari tours, travel tips, and special offers.</p>
        <p>If you no longer wish to receive these emails, please <a href="${this.configService.get<string>("WEBSITE_URL")}/unsubscribe?email=${subscriber.email}">unsubscribe</a>.</p>
      `,
    })
  }

  async sendBookingNotification(booking: Booking): Promise<void> {
    const adminEmail = this.configService.get<string>("ADMIN_EMAIL") || "asiomizunoah@gmail.com"

    await this.transporter.sendMail({
      from: `"Roads of Adventure Safaris" <${this.configService.get<string>("MAIL_FROM")}>`,
      to: adminEmail,
      subject: "New Tour Booking",
      html: `
        <h1>New Tour Booking</h1>
        <p>A new booking has been received:</p>
        <ul>
          <li><strong>Name:</strong> ${booking.fullName}</li>
          <li><strong>Email:</strong> ${booking.email}</li>
          <li><strong>Phone:</strong> ${booking.phoneNumber || "N/A"}</li>
          <li><strong>Country:</strong> ${booking.country || "N/A"}</li>
          <li><strong>Tour:</strong> ${booking.tour ? "Selected Tour" : "Custom Tour Request"}</li>
          <li><strong>Travel Date:</strong> ${booking.travelDate ? new Date(booking.travelDate).toLocaleDateString() : "N/A"}</li>
          <li><strong>Adults:</strong> ${booking.numberOfAdults || 0}</li>
          <li><strong>Children:</strong> ${booking.numberOfChildren || 0}</li>
          <li><strong>Special Requirements:</strong> ${booking.specialRequirements || "None"}</li>
        </ul>
        ${booking.customTourRequest ? `<p><strong>Custom Tour Request:</strong> ${booking.customTourRequest}</p>` : ""}
        <p>Please login to the dashboard to manage this booking.</p>
      `,
    })
  }

  async sendBookingConfirmation(booking: Booking): Promise<void> {
    await this.transporter.sendMail({
      from: `"Roads of Adventure Safaris" <${this.configService.get<string>("MAIL_FROM")}>`,
      to: booking.email,
      subject: "Your Safari Booking Confirmation",
      html: `
        <h1>Booking Received</h1>
        <p>Dear ${booking.fullName},</p>
        <p>Thank you for your booking with Roads of Adventure Safaris. We have received your request and will contact you shortly to discuss the details.</p>
        <h2>Booking Details:</h2>
        <ul>
          <li><strong>Tour:</strong> ${booking.tour ? "Selected Tour" : "Custom Tour Request"}</li>
          <li><strong>Travel Date:</strong> ${booking.travelDate ? new Date(booking.travelDate).toLocaleDateString() : "N/A"}</li>
          <li><strong>Number of Travelers:</strong> ${(booking.numberOfAdults || 0) + (booking.numberOfChildren || 0)}</li>
        </ul>
        <p>If you have any questions, please don't hesitate to contact us.</p>
        <p>We look forward to helping you plan your African adventure!</p>
      `,
    })
  }

  async sendBookingStatusUpdate(booking: Booking): Promise<void> {
    let statusMessage = ""
    let subject = ""

    switch (booking.status) {
      case "confirmed":
        subject = "Your Safari Booking is Confirmed"
        statusMessage = "Your booking has been confirmed. We are excited to have you join us on this adventure!"
        break
      case "cancelled":
        subject = "Your Safari Booking has been Cancelled"
        statusMessage =
          "Your booking has been cancelled. If you did not request this cancellation, please contact us immediately."
        break
      case "completed":
        subject = "Thank You for Your Safari with Us"
        statusMessage = "Your safari has been marked as completed. We hope you had a wonderful experience with us!"
        break
      default:
        subject = "Your Safari Booking Status Update"
        statusMessage = "There has been an update to your booking status."
    }

    await this.transporter.sendMail({
      from: `"Roads of Adventure Safaris" <${this.configService.get<string>("MAIL_FROM")}>`,
      to: booking.email,
      subject,
      html: `
        <h1>Booking Status Update</h1>
        <p>Dear ${booking.fullName},</p>
        <p>${statusMessage}</p>
        <h2>Booking Details:</h2>
        <ul>
          <li><strong>Tour:</strong> ${booking.tour ? "Selected Tour" : "Custom Tour Request"}</li>
          <li><strong>Travel Date:</strong> ${booking.travelDate ? new Date(booking.travelDate).toLocaleDateString() : "N/A"}</li>
          <li><strong>Status:</strong> ${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</li>
        </ul>
        <p>If you have any questions, please don't hesitate to contact us.</p>
      `,
    })
  }
}
