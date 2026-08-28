import type { Locale } from "./i18n";

export type LoginCopy = {
  back: string;
  title: string;
  subtitle: string;
  emailLabel: string;
  sendButton: string;
  sending: string;
  checkEmail: string;
  errorGeneric: string;
};

export const loginCopy: Record<Locale, LoginCopy> = {
  en: {
    back: "Back to AutoVere",
    title: "Sign in to AutoVere",
    subtitle: "Enter the email used for your subscription. We will send a secure sign-in link.",
    emailLabel: "Email",
    sendButton: "Send login link",
    sending: "Sending…",
    checkEmail: "Check your email for a secure AutoVere login link.",
    errorGeneric: "Could not send the login email. Please try again.",
  },
  de: {
    back: "Zurück zu AutoVere",
    title: "Bei AutoVere anmelden",
    subtitle: "Gib die E-Mail-Adresse ein, die du für dein Abo verwendest. Wir schicken dir einen sicheren Anmeldelink.",
    emailLabel: "E-Mail",
    sendButton: "Anmeldelink senden",
    sending: "Wird gesendet…",
    checkEmail: "Schau in dein Postfach nach dem sicheren AutoVere-Anmeldelink.",
    errorGeneric: "Die Anmelde-E-Mail konnte nicht gesendet werden. Bitte versuche es erneut.",
  },
  nl: {
    back: "Terug naar AutoVere",
    title: "Inloggen bij AutoVere",
    subtitle: "Vul het e-mailadres van je abonnement in. We sturen je een beveiligde inloglink.",
    emailLabel: "E-mail",
    sendButton: "Inloglink versturen",
    sending: "Versturen…",
    checkEmail: "Kijk in je mailbox voor je beveiligde AutoVere-inloglink.",
    errorGeneric: "De inlog-e-mail kon niet worden verstuurd. Probeer het opnieuw.",
  },
  no: {
    back: "Tilbake til AutoVere",
    title: "Logg inn på AutoVere",
    subtitle: "Skriv inn e-posten du bruker til abonnementet ditt, så sender vi deg en sikker innloggingslenke.",
    emailLabel: "E-post",
    sendButton: "Send innloggingslenke",
    sending: "Sender…",
    checkEmail: "Sjekk e-posten din for en sikker AutoVere-innloggingslenke.",
    errorGeneric: "Kunne ikke sende innloggings-e-posten. Prøv igjen.",
  },
  pl: {
    back: "Powrót do AutoVere",
    title: "Zaloguj się do AutoVere",
    subtitle: "Podaj adres e-mail powiązany z Twoją subskrypcją. Wyślemy Ci bezpieczny link do logowania.",
    emailLabel: "E-mail",
    sendButton: "Wyślij link do logowania",
    sending: "Wysyłanie…",
    checkEmail: "Sprawdź skrzynkę pocztową — czeka tam bezpieczny link do logowania AutoVere.",
    errorGeneric: "Nie udało się wysłać e-maila logowania. Spróbuj ponownie.",
  },
  sv: {
    back: "Tillbaka till AutoVere",
    title: "Logga in på AutoVere",
    subtitle: "Ange e-postadressen du använder för din prenumeration, så skickar vi en säker inloggningslänk.",
    emailLabel: "E-post",
    sendButton: "Skicka inloggningslänk",
    sending: "Skickar…",
    checkEmail: "Kolla din e-post efter en säker AutoVere-inloggningslänk.",
    errorGeneric: "Kunde inte skicka inloggnings-e-posten. Försök igen.",
  },
  fr: {
    back: "Retour à AutoVere",
    title: "Connexion à AutoVere",
    subtitle: "Indiquez l'e-mail utilisé pour votre abonnement. Nous vous enverrons un lien de connexion sécurisé.",
    emailLabel: "E-mail",
    sendButton: "Envoyer le lien de connexion",
    sending: "Envoi en cours…",
    checkEmail: "Consultez votre boîte mail pour votre lien de connexion sécurisé AutoVere.",
    errorGeneric: "Impossible d'envoyer l'e-mail de connexion. Veuillez réessayer.",
  },
  da: {
    back: "Tilbage til AutoVere",
    title: "Log ind på AutoVere",
    subtitle: "Indtast e-mailen, du bruger til dit abonnement. Vi sender dig et sikkert login-link.",
    emailLabel: "E-mail",
    sendButton: "Send login-link",
    sending: "Sender…",
    checkEmail: "Tjek din e-mail for et sikkert AutoVere-login-link.",
    errorGeneric: "Kunne ikke sende login-e-mailen. Prøv igen.",
  },
};
