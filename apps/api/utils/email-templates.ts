import type { UserRole } from "@/db/types";

export const INVITATION_TEMPLATE = ({
  url,
  name,
  role,
}: {
  url: string;
  name: string;
  role: UserRole;
}) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Invitation</title>
  </head>
  <body style="background-color: #ffffff; font-family: Arial, sans-serif;">
    <div
      style="
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      "
    >
      <div
        style="
          text-align: center;
          margin-bottom: 30px;
        "
      >
        <img
          src="https://example.com/placeholder.svg"
          width="96"
          height="96"
          alt="Auth Inc"
          style="border-radius: 8px; object-fit: cover;"
        />
        <h1
          style="
            font-size: 24px;
            font-weight: bold;
            margin-top: 16px;
          "
        >
        You've been invited
        </h1>
      </div>
      <div
        style="
          padding: 0 10px;
          text-align: center;
          margin-bottom: 40px;
        "
      >
        <p>Hello, ${name}</p>
        <p>
          You've been invited to join kurn as a ${role}.
        </p>
        <p>Click the button below to verify your email address:</p>
        <a
          href="${url}"
          style="
            background-color: #000;
            color: #fff;
            padding: 12px 20px;
            border-radius: 6px;
            text-decoration: none;
            display: inline-block;
            margin-top: 10px;
            margin-bottom: 5px;
            font-weight: bold;
          "
          >Verify email</a>
        <p>This link will expire in 7 days.</p>
        <p>
          Best regards,<br />
          Absterr
        </p>
      </div>
      <div
        style="
          font-size: 12px;
          color: #888;
          text-align: center;
        "
      >
        <p style="margin-bottom: 6px;">
          Need help? Contact me at
          <a
            href="mailto:absterr.dev@gmail.com"
            style="color: #555; text-decoration: underline;"
            >
            absterr.dev@gmail.com</a
          >
        </p>
        <p style="margin-bottom: 6px;">
          This is an automated message, please do not reply to this email.
        </p>
      </div>
    </div>
  </body>
</html>
`;
