import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

const ses = new SESv2Client({});
const MAX_BODY_LENGTH = 10000;

function getAllowedOrigin() {
  const origin = process.env.ALLOWED_ORIGIN;
  if (!origin) throw new Error("ALLOWED_ORIGIN is not configured");
  return origin;
}

function response(statusCode, body, origin = getAllowedOrigin()) {
  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Headers": "content-type",
      "Access-Control-Allow-Methods": "OPTIONS,POST",
      "Content-Type": "application/json; charset=utf-8",
      "Vary": "Origin"
    },
    body: JSON.stringify(body)
  };
}

function getMethod(event) {
  return event.requestContext?.http?.method || event.httpMethod || "";
}

function parseBody(event) {
  const raw = event.isBase64Encoded
    ? Buffer.from(event.body || "", "base64").toString("utf8")
    : event.body || "";

  if (raw.length > MAX_BODY_LENGTH) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function handler(event) {
  const origin = event.headers?.origin || event.headers?.Origin;
  const allowedOrigin = getAllowedOrigin();
  if (origin && origin !== allowedOrigin) return response(403, { error: "Origem não permitida." }, allowedOrigin);

  const method = getMethod(event);
  if (method === "OPTIONS") return response(204, {}, allowedOrigin);
  if (method !== "POST") return response(405, { error: "Método não permitido." }, allowedOrigin);

  const payload = parseBody(event);
  if (
    !payload ||
    typeof payload.name !== "string" ||
    typeof payload.email !== "string" ||
    typeof payload.organization !== "string" ||
    typeof payload.message !== "string"
  ) {
    return response(400, { error: "Dados inválidos." }, allowedOrigin);
  }

  const name = payload.name.trim();
  const email = payload.email.trim();
  const organization = payload.organization.trim();
  const message = payload.message.trim();
  const recipients = (process.env.CONTACT_RECIPIENTS || "")
    .split(",")
    .map(address => address.trim())
    .filter(Boolean);
  const sender = process.env.CONTACT_FROM_EMAIL;

  if (
    !name || name.length > 120 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 ||
    !organization || organization.length > 160 ||
    !message || message.length > 5000
  ) {
    return response(400, { error: "Confira os campos e tente novamente." }, allowedOrigin);
  }
  if (!sender || recipients.length === 0) {
    throw new Error("CONTACT_FROM_EMAIL and CONTACT_RECIPIENTS must be configured");
  }

  await ses.send(new SendEmailCommand({
    FromEmailAddress: sender,
    Destination: { ToAddresses: recipients },
    ReplyToAddresses: [email],
    Content: {
      Simple: {
        Subject: { Data: "Nova solicitação de reunião — Easy Voting", Charset: "UTF-8" },
        Body: {
          Text: {
            Data: [
              `Nome: ${name}`,
              `E-mail: ${email}`,
              `Empresa: ${organization}`,
              "",
              "Mensagem:",
              message
            ].join("\n"),
            Charset: "UTF-8"
          }
        }
      }
    }
  }));

  return response(200, { message: "Mensagem enviada." }, allowedOrigin);
}
