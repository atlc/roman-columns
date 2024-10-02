import mailgun from "mailgun.js";
import FormData from "form-data";
import jwt from "jsonwebtoken";
import config from "../config";
import { User } from "../types";

const client = new mailgun(FormData).client({
    username: "api",
    key: config.mailgun.apiKey
});

interface MailProps {
    to: string;
    from: string;
    subject: string;
    body: string;
}

export const sendMail = ({ to, from, subject, body }: MailProps) => {
    return client.messages.create(config.mailgun.domain, {
        to,
        from,
        subject,
        html: body,
    });
};

export const sendVerificationMail = ({ email, id, name }: User) => {
    const token = jwt.sign({ email, id, name }, config.jwt.secret, { expiresIn: "15m" });

    console.log(`Sending verification mail to ${email}`);

    return sendMail({
        to: email,
        from: `Registration <noreply@mycolumns.com>`,
        subject: "Verify your MyColumns Account",
        body: `Please click the below link to verify your account. This link will expire after 15 minutes.
          <a href="${config.domain.url}/verify?token=${token}>Verify</a>
        `,
    });
};

export const sendLoginMail = ({ email, name, id, lastLoginTime, lastLoginLocation }: User) => {
    const token = jwt.sign({ email, id, name }, config.jwt.secret, { expiresIn: "15m" });

    console.log(`Sending verification mail to ${email}`);

    return sendMail({
        to: email,
        from: `Login <noreply@mycolumns.com>`,
        subject: "Sign in to your account portal",
        body: `
            <h1>Please click the below link to log into your account. This link will expire after 15 minutes.</h1>
            <p><a href="${config.domain.url}/login?token=${token}>Login</a></p>
            <p>Last logged in at ${lastLoginTime.toLocaleString()} from ${lastLoginLocation}</p>
        `,
    });
};