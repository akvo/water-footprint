module.exports = {
  async send(ctx) {
    try {
      const { name, email, subject, message } = ctx.request.body;

      const fromEmail = strapi.config.get('plugin::email.settings.defaultFrom');

      await strapi.plugins['email'].services.email.send({
        to: fromEmail,
        from: fromEmail,
        subject: `New Contact Form Submission: ${subject}`,
        html: `
            <h1>New Contact Form Submission</h1>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
          `,
      });

      ctx.send({ message: 'Submission received successfully' });
    } catch (err) {
      console.error('Email send error:', err);
      ctx.badRequest('Email service error', { error: err });
    }
  },
};
