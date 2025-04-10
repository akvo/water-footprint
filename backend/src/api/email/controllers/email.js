module.exports = {
  async send(ctx) {
    try {
      const { name, email, subject, message } = ctx.request.body.data;
      const administrators = await strapi.db.query('admin::user').findMany({
        where: {
          isActive: true,
          blocked: false,
        },
      });

      const adminEmails = administrators.map((admin) => admin.email);

      await Promise.all(
        adminEmails.map(async (recipient) => {
          await strapi.plugins.email.service('email').send({
            to: recipient,
            subject: `New Contact Form Submission: ${subject}`,
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <style>
                    body {
                      font-family: 'Arial', sans-serif;
                      line-height: 1.6;
                      color: #333;
                      max-width: 600px;
                      margin: 0 auto;
                      padding: 20px;
                      background-color: #f4f7f6;
                    }
                    .container {
                      background-color: white;
                      border-radius: 10px;
                      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                      padding: 30px;
                      border-top: 4px solid #26BDE2;
                    }
                    .header {
                      text-align: center;
                      margin-bottom: 30px;
                      color: #26BDE2;
                    }
                    .detail {
                      margin-bottom: 20px;
                      padding: 15px;
                      background-color: #f9f9f9;
                      border-radius: 5px;
                    }
                    .label {
                      font-weight: bold;
                      color: #26BDE2;
                      margin-right: 10px;
                    }
                    .message {
                      background-color: #f0f0f0;
                      padding: 20px;
                      border-radius: 5px;
                      white-space: pre-wrap;
                      word-wrap: break-word;
                    }
                    .footer {
                      text-align: center;
                      margin-top: 20px;
                      font-size: 0.8em;
                      color: #888;
                    }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header">
                      <h1>New Contact Form Submission</h1>
                    </div>
                    
                    <div class="detail">
                      <p><span class="label">Name:</span> ${name}</p>
                      <p><span class="label">Email:</span> ${email}</p>
                      <p><span class="label">Subject:</span> ${subject}</p>
                    </div>
                    
                    <div class="message">
                      <p><span class="label">Message:</span></p>
                      ${message}
                    </div>
                    
                    <div class="footer">
                      <p>This is an automated notification from your website's contact form.</p>
                    </div>
                  </div>
                </body>
                </html>
              `,
          });
        })
      );

      ctx.send({ message: 'Submission received successfully' });
    } catch (err) {
      console.error('Email send error:', err);
      ctx.badRequest('Email service error', { error: err.message });
    }
  },
};
