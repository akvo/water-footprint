module.exports = {
  async send(ctx) {
    try {
      const { name, email, subject, message } = ctx.request.body;

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
              <h1>New Contact Form Submission</h1>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Message:</strong></p>
              <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; white-space: pre-wrap;">
                ${message}
              </div>
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
