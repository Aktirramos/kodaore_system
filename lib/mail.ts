import nodemailer from "nodemailer";
import { env } from "@/lib/env";
import type { LocaleCode } from "@/lib/i18n";

type SendWelcomeEmailInput = {
  to: string;
  firstName: string;
  locale: LocaleCode;
};

let cachedTransporter: nodemailer.Transporter | null = null;

function getMailerTransporter() {
  if (!env.AUTH_EMAIL_SERVER) {
    return null;
  }

  if (cachedTransporter) {
    return cachedTransporter;
  }

  cachedTransporter = nodemailer.createTransport(env.AUTH_EMAIL_SERVER);
  return cachedTransporter;
}

function buildWelcomeSubject(locale: LocaleCode) {
  return locale === "eu" ? "Ongi etorri Kodaorera" : "Bienvenida a Kodaore";
}

function buildWelcomeText(locale: LocaleCode, firstName: string) {
  if (locale === "eu") {
    return [
      `Kaixo ${firstName},`,
      "",
      "Eskerrik asko Kodaoren kontua sortzeagatik.",
      "Zure alta behar bezala osatu da eta hemendik aurrera portalera sar zaitezke.",
      "",
      "Agur bero bat,",
      "Kodaore taldea",
    ].join("\n");
  }

  return [
    `Hola ${firstName},`,
    "",
    "Gracias por crear tu cuenta en Kodaore.",
    "El registro se ha completado correctamente y ya puedes acceder al portal.",
    "",
    "Un saludo,",
    "Equipo Kodaore",
  ].join("\n");
}

function buildWelcomeHtml(locale: LocaleCode, firstName: string) {
  if (locale === "eu") {
    return `
      <p>Kaixo ${firstName},</p>
      <p>Eskerrik asko Kodaoren kontua sortzeagatik.</p>
      <p>Zure alta behar bezala osatu da eta hemendik aurrera portalera sar zaitezke.</p>
      <p>Agur bero bat,<br />Kodaore taldea</p>
    `;
  }

  return `
    <p>Hola ${firstName},</p>
    <p>Gracias por crear tu cuenta en Kodaore.</p>
    <p>El registro se ha completado correctamente y ya puedes acceder al portal.</p>
    <p>Un saludo,<br />Equipo Kodaore</p>
  `;
}

export async function sendWelcomeEmail(input: SendWelcomeEmailInput) {
  const transporter = getMailerTransporter();

  if (!transporter || !env.AUTH_EMAIL_FROM) {
    return;
  }

  const { to, firstName, locale } = input;

  try {
    await transporter.sendMail({
      from: env.AUTH_EMAIL_FROM,
      to,
      subject: buildWelcomeSubject(locale),
      text: buildWelcomeText(locale, firstName),
      html: buildWelcomeHtml(locale, firstName),
    });
  } catch {
    // Email failures should never break account creation flow.
  }
}
