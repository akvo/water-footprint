module.exports = ({ env }) => {
  // `PLUGIN_PROVIDERS` allows the use of local providers in production build containers for local testing.
  const profile = env.oneOf(
    'PLUGIN_PROVIDERS',
    ['local', 'external'],
    'external'
  );

  const emails = {
    local: {
      provider: 'nodemailer',
      providerOptions: {
        host: 'mailpit',
        port: 1025,
        ignoreTLS: true,
        auth: false,
      },
    },
    external: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST'),
        port: env('SMTP_PORT'),
        auth: {
          user: env('SMTP_USERNAME'),
          pass: env('SMTP_PASSWORD'),
        },
      },
    },
  };

  return {
    email: {
      config: {
        ...emails[profile],
        settings: {
          defaultFrom: env('SMTP_FROM'),
          defaultReplyTo: env('SMTP_FROM'),
        },
      },
    },
  };
};
