module.exports = {
  async send(ctx) {
    try {
      const { name, email, subject, message } = ctx.request.body;

      await strapi.plugins['email'].services.email.send({
        to: process.env.SMTP_FROM,
        from: process.env.SMTP_FROM,
        subject: `New Contact Form Submission: ${subject}`,
        html: `
            <h1>New Contact Form Submission</h1>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
          `,
      });

      ctx.send({ message: 'Submission received successfully' });
    } catch (err) {
      ctx.badRequest('Email service error', { error: err });
    }
  },
};
