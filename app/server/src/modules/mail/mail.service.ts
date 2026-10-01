import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    // In a production environment, use proper SMTP credentials from ConfigService.
    // Here we use a standard setup (or Ethereal mock) depending on environment.
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: Number(process.env.SMTP_PORT) || 587,
      // @ts-ignore - Force IPv4 to prevent Node.js DNS (EAI_AGAIN) timeouts on broken IPv6 networks
      family: 4,
      auth: {
        user: process.env.SMTP_USER || 'ethereal.user@ethereal.email',
        pass: process.env.SMTP_PASS || 'ethereal_password',
      },
    });
  }

  async sendOrganizationWelcomeEmail(
    to: string,
    executiveName: string,
    organizationName: string,
    temporaryPassword: string,
  ) {
    try {
      const info = await this.transporter.sendMail({
        from: '"Platform Admin" <admin@organizationsafety.com>',
        to,
        subject: `Welcome to ${organizationName}! Your Account is Ready`,
        html: `
          <h3>Hello ${executiveName},</h3>
          <p>Your organization <strong>${organizationName}</strong> has been successfully created on our platform.</p>
          <p>Here are your temporary login credentials for the Tenant Admin account:</p>
          <p>
            <strong>Email:</strong> ${to}<br/>
            <strong>Temporary Password:</strong> ${temporaryPassword}
          </p>
          <p>Please log in and change your password immediately.</p>
          <br/>
          <p>Thank you,<br/>Platform Team</p>
        `,
      });
      this.logger.log(`Welcome email sent successfully to ${to}. Message ID: ${info.messageId}`);
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${to}`, error);
    }
  }
}
