// lib/utils/notifications.ts
import * as nodemailer from 'nodemailer';

export async function sendEmailNotification({ to, subject, body }: { to: string; subject: string; body: string }) {
  // For development/testing - log instead of actually sending
  console.log('=== EMAIL NOTIFICATION ===');
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${body}`);
  console.log('=========================');
  
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      await transporter.sendMail({
        from: '"Kuya Jun\'s Atchup" <noreply@kuyajunsatchup.com>',
        to,
        subject,
        text: body,
        html: body.replace(/\n/g, '<br>'),
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  } else {
    console.log('Email credentials not configured. Skipping actual email send.');
  }
}

export async function sendOrderConfirmation(orderDetails: any) {
  const subject = `New Order Received: ${orderDetails.orderNumber}`;
  const body = `
    New Order Details:
    
    Order Number: ${orderDetails.orderNumber}
    Customer: ${orderDetails.fullName}
    Email: ${orderDetails.email}
    Phone: ${orderDetails.phone}
    Total Amount: ₱${orderDetails.totalAmount}
    
    Delivery Address: ${orderDetails.address}
    Delivery Date: ${orderDetails.deliveryDate} at ${orderDetails.deliveryTime}
    
    Payment Method: ${orderDetails.paymentMethod}
    
    Order Items:
    ${orderDetails.items.map((item: any) => `- ${item.name} x${item.quantity} = ₱${item.price * item.quantity}`).join('\n')}
    
    Special Instructions: ${orderDetails.specialInstructions || 'None'}
  `;

  await sendEmailNotification({
    to: 'febiemosura983@gmail.com',
    subject,
    body
  });
}