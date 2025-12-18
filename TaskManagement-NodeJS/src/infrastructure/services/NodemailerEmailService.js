const nodemailer = require('nodemailer');

class NodemailerEmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    this.fromEmail = process.env.FROM_EMAIL || 'noreply@yourapp.com';
    this.fromName = process.env.FROM_NAME || 'App quản lí công việc';
  }

  async sendVerificationEmail(toEmail, verificationLink) {
    const mailOptions = {
      from: `"${this.fromName}" <${this.fromEmail}>`,
      to: toEmail,
      subject: 'Verify Your Email Address',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .button { 
              display: inline-block; 
              padding: 12px 24px; 
              background-color: #007bff; 
              color: white; 
              text-decoration: none; 
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer { margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Welcome to ${this.fromName}!</h2>
            <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
            <a href="${verificationLink}" class="button">Verify Email</a>
            <p>Or copy and paste this link into your browser:</p>
            <p>${verificationLink}</p>
            <p>This link will expire in 24 hours.</p>
            <div class="footer">
              <p>If you didn't create an account, please ignore this email.</p>
              <p>&copy; ${new Date().getFullYear()} ${this.fromName}. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Verification email sent: %s', info.messageId);
      return true;
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }

  async sendPasswordResetEmail(toEmail, resetLink) {
    const mailOptions = {
      from: `"${this.fromName}" <${this.fromEmail}>`,
      to: toEmail,
      subject: 'Reset Your Password',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .button { 
              display: inline-block; 
              padding: 12px 24px; 
              background-color: #dc3545; 
              color: white; 
              text-decoration: none; 
              border-radius: 5px;
              margin: 20px 0;
            }
            .warning { 
              background-color: #fff3cd; 
              border-left: 4px solid #ffc107; 
              padding: 12px;
              margin: 20px 0;
            }
            .footer { margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Password Reset Request</h2>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            <a href="${resetLink}" class="button">Reset Password</a>
            <p>Or copy and paste this link into your browser:</p>
            <p>${resetLink}</p>
            <div class="warning">
              <strong>⚠️ Security Notice:</strong>
              <p>This link will expire in 1 hour for security reasons.</p>
            </div>
            <div class="footer">
              <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
              <p>&copy; ${new Date().getFullYear()} ${this.fromName}. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Password reset email sent: %s', info.messageId);
      return true;
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  async sendWelcomeEmail(toEmail, userName) {
    const mailOptions = {
      from: `"${this.fromName}" <${this.fromEmail}>`,
      to: toEmail,
      subject: `Welcome to ${this.fromName}!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #007bff; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .footer { margin-top: 30px; font-size: 12px; color: #666; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to ${this.fromName}!</h1>
            </div>
            <div class="content">
              <p>Hi ${userName},</p>
              <p>Your email has been verified successfully! You're all set to start using ${this.fromName}.</p>
              <p>We're excited to have you on board!</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} ${this.fromName}. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Welcome email sent: %s', info.messageId);
      return true;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw new Error('Failed to send welcome email');
    }
  }
}

module.exports = NodemailerEmailService;