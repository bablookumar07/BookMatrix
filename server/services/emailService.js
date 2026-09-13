import nodemailer from "nodemailer";

const createTransporter = () => {
  const requiredConfig = [
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USER",
    "SMTP_PASSWORD",
  ];

  const missingConfig = requiredConfig.filter(
    (key) => !process.env[key]
  );

  if (missingConfig.length > 0) {
    throw new Error(
      `SMTP configuration is missing: ${missingConfig.join(", ")}`
    );
  }

  const port = Number(process.env.SMTP_PORT);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("SMTP_PORT must be a valid port number");
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

export const sendPasswordResetEmail = async ({
  email,
  name,
  resetUrl,
}) => {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"Libryo" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Reset your Libryo password",

    text: `Hello ${name},

We received a request to reset your Libryo account password.

Use the following link to create a new password:

${resetUrl}

This link will expire in 15 minutes.

If you did not request a password reset, you can safely ignore this email.

Regards,
Libryo Library Management System`,

    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
        <h2>Reset your Libryo password</h2>

        <p>Hello ${name},</p>

        <p>
          We received a request to reset your Libryo account password.
        </p>

        <p>
          Click the button below to create a new password:
        </p>

        <p>
          <a
            href="${resetUrl}"
            style="
              display: inline-block;
              padding: 12px 20px;
              background: #0f766e;
              color: #ffffff;
              text-decoration: none;
              border-radius: 6px;
            "
          >
            Reset Password
          </a>
        </p>

        <p>
          This link will expire in <strong>15 minutes</strong>.
        </p>

        <p>
          If you did not request a password reset, you can safely ignore
          this email.
        </p>

        <p>
          Regards,<br />
          <strong>Libryo Library Management System</strong>
        </p>
      </div>
    `,
  });
};