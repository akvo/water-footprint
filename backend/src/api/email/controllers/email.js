module.exports = {
  async send(ctx) {
    try {
      const { to, subject, html } = ctx.request.body;

      await strapi.plugins['email'].services.email.send({
        to,
        subject,
        html,
      });

      ctx.send({ message: 'Email sent successfully' });
    } catch (err) {
      ctx.badRequest('Email service error', { error: err });
    }
  },
};
