import type { Locale } from "./i18n";

export type LoginCopy = {
  back: string;
  title: string;
  subtitle: string;
  emailLabel: string;
  passwordLabel: string;
  loginButton: string;
  loggingIn: string;
  forgotPassword: string;
  orDivider: string;
  useMagicLinkInstead: string;
  usePasswordInstead: string;
  magicLinkSubtitle: string;
  sendButton: string;
  sending: string;
  checkEmail: string;
  errorGeneric: string;
  errorInvalidCredentials: string;
  errorRateLimited: string;
};

export const loginCopy: Record<Locale, LoginCopy> = {
  en: {
    back: "Back to AutoVere",
    title: "Sign in to AutoVere",
    subtitle: "Enter your email and password to sign in to your AutoVere account.",
    emailLabel: "Email",
    passwordLabel: "Password",
    loginButton: "Log in",
    loggingIn: "Logging in…",
    forgotPassword: "Forgot password?",
    orDivider: "or",
    useMagicLinkInstead: "Email me a login link instead",
    usePasswordInstead: "Use password instead",
    magicLinkSubtitle: "Enter the email used for your subscription. We will send a secure sign-in link.",
    sendButton: "Send login link",
    sending: "Sending…",
    checkEmail: "Check your email for a secure AutoVere login link.",
    errorGeneric: "Something went wrong. Please try again.",
    errorInvalidCredentials: "Incorrect email or password.",
    errorRateLimited: "Too many attempts. Please wait a few minutes and try again.",
  },
  de: {
    back: "Zurück zu AutoVere",
    title: "Bei AutoVere anmelden",
    subtitle: "Gib deine E-Mail-Adresse und dein Passwort ein, um dich bei AutoVere anzumelden.",
    emailLabel: "E-Mail",
    passwordLabel: "Passwort",
    loginButton: "Anmelden",
    loggingIn: "Anmeldung läuft…",
    forgotPassword: "Passwort vergessen?",
    orDivider: "oder",
    useMagicLinkInstead: "Stattdessen einen Anmeldelink per E-Mail senden",
    usePasswordInstead: "Stattdessen Passwort verwenden",
    magicLinkSubtitle: "Gib die E-Mail-Adresse ein, die du für dein Abo verwendest. Wir schicken dir einen sicheren Anmeldelink.",
    sendButton: "Anmeldelink senden",
    sending: "Wird gesendet…",
    checkEmail: "Schau in dein Postfach nach dem sicheren AutoVere-Anmeldelink.",
    errorGeneric: "Etwas ist schiefgelaufen. Bitte versuche es erneut.",
    errorInvalidCredentials: "E-Mail oder Passwort ist falsch.",
    errorRateLimited: "Zu viele Versuche. Bitte warte ein paar Minuten und versuche es erneut.",
  },
  nl: {
    back: "Terug naar AutoVere",
    title: "Inloggen bij AutoVere",
    subtitle: "Vul je e-mailadres en wachtwoord in om in te loggen bij AutoVere.",
    emailLabel: "E-mail",
    passwordLabel: "Wachtwoord",
    loginButton: "Inloggen",
    loggingIn: "Bezig met inloggen…",
    forgotPassword: "Wachtwoord vergeten?",
    orDivider: "of",
    useMagicLinkInstead: "Stuur me in plaats daarvan een inloglink",
    usePasswordInstead: "Gebruik in plaats daarvan een wachtwoord",
    magicLinkSubtitle: "Vul het e-mailadres van je abonnement in. We sturen je een beveiligde inloglink.",
    sendButton: "Inloglink versturen",
    sending: "Versturen…",
    checkEmail: "Kijk in je mailbox voor je beveiligde AutoVere-inloglink.",
    errorGeneric: "Er is iets misgegaan. Probeer het opnieuw.",
    errorInvalidCredentials: "Onjuiste e-mail of wachtwoord.",
    errorRateLimited: "Te veel pogingen. Wacht een paar minuten en probeer het opnieuw.",
  },
  no: {
    back: "Tilbake til AutoVere",
    title: "Logg inn på AutoVere",
    subtitle: "Skriv inn e-post og passord for å logge inn på AutoVere-kontoen din.",
    emailLabel: "E-post",
    passwordLabel: "Passord",
    loginButton: "Logg inn",
    loggingIn: "Logger inn…",
    forgotPassword: "Glemt passordet?",
    orDivider: "eller",
    useMagicLinkInstead: "Send meg en innloggingslenke i stedet",
    usePasswordInstead: "Bruk passord i stedet",
    magicLinkSubtitle: "Skriv inn e-posten du bruker til abonnementet ditt, så sender vi deg en sikker innloggingslenke.",
    sendButton: "Send innloggingslenke",
    sending: "Sender…",
    checkEmail: "Sjekk e-posten din for en sikker AutoVere-innloggingslenke.",
    errorGeneric: "Noe gikk galt. Prøv igjen.",
    errorInvalidCredentials: "Feil e-post eller passord.",
    errorRateLimited: "For mange forsøk. Vent noen minutter og prøv igjen.",
  },
  pl: {
    back: "Powrót do AutoVere",
    title: "Zaloguj się do AutoVere",
    subtitle: "Podaj e-mail i hasło, aby zalogować się do konta AutoVere.",
    emailLabel: "E-mail",
    passwordLabel: "Hasło",
    loginButton: "Zaloguj się",
    loggingIn: "Logowanie…",
    forgotPassword: "Zapomniałeś hasła?",
    orDivider: "lub",
    useMagicLinkInstead: "Wyślij mi zamiast tego link do logowania",
    usePasswordInstead: "Użyj zamiast tego hasła",
    magicLinkSubtitle: "Podaj adres e-mail powiązany z Twoją subskrypcją. Wyślemy Ci bezpieczny link do logowania.",
    sendButton: "Wyślij link do logowania",
    sending: "Wysyłanie…",
    checkEmail: "Sprawdź skrzynkę pocztową — czeka tam bezpieczny link do logowania AutoVere.",
    errorGeneric: "Coś poszło nie tak. Spróbuj ponownie.",
    errorInvalidCredentials: "Nieprawidłowy e-mail lub hasło.",
    errorRateLimited: "Zbyt wiele prób. Poczekaj kilka minut i spróbuj ponownie.",
  },
  sv: {
    back: "Tillbaka till AutoVere",
    title: "Logga in på AutoVere",
    subtitle: "Ange din e-post och ditt lösenord för att logga in på ditt AutoVere-konto.",
    emailLabel: "E-post",
    passwordLabel: "Lösenord",
    loginButton: "Logga in",
    loggingIn: "Loggar in…",
    forgotPassword: "Glömt lösenordet?",
    orDivider: "eller",
    useMagicLinkInstead: "Skicka mig en inloggningslänk istället",
    usePasswordInstead: "Använd lösenord istället",
    magicLinkSubtitle: "Ange e-postadressen du använder för din prenumeration, så skickar vi en säker inloggningslänk.",
    sendButton: "Skicka inloggningslänk",
    sending: "Skickar…",
    checkEmail: "Kolla din e-post efter en säker AutoVere-inloggningslänk.",
    errorGeneric: "Något gick fel. Försök igen.",
    errorInvalidCredentials: "Fel e-post eller lösenord.",
    errorRateLimited: "För många försök. Vänta några minuter och försök igen.",
  },
  fr: {
    back: "Retour à AutoVere",
    title: "Connexion à AutoVere",
    subtitle: "Saisissez votre e-mail et votre mot de passe pour vous connecter à votre compte AutoVere.",
    emailLabel: "E-mail",
    passwordLabel: "Mot de passe",
    loginButton: "Se connecter",
    loggingIn: "Connexion en cours…",
    forgotPassword: "Mot de passe oublié ?",
    orDivider: "ou",
    useMagicLinkInstead: "M'envoyer un lien de connexion à la place",
    usePasswordInstead: "Utiliser un mot de passe à la place",
    magicLinkSubtitle: "Indiquez l'e-mail utilisé pour votre abonnement. Nous vous enverrons un lien de connexion sécurisé.",
    sendButton: "Envoyer le lien de connexion",
    sending: "Envoi en cours…",
    checkEmail: "Consultez votre boîte mail pour votre lien de connexion sécurisé AutoVere.",
    errorGeneric: "Une erreur est survenue. Veuillez réessayer.",
    errorInvalidCredentials: "E-mail ou mot de passe incorrect.",
    errorRateLimited: "Trop de tentatives. Veuillez patienter quelques minutes et réessayer.",
  },
  da: {
    back: "Tilbage til AutoVere",
    title: "Log ind på AutoVere",
    subtitle: "Indtast din e-mail og adgangskode for at logge ind på din AutoVere-konto.",
    emailLabel: "E-mail",
    passwordLabel: "Adgangskode",
    loginButton: "Log ind",
    loggingIn: "Logger ind…",
    forgotPassword: "Glemt adgangskode?",
    orDivider: "eller",
    useMagicLinkInstead: "Send mig et login-link i stedet",
    usePasswordInstead: "Brug adgangskode i stedet",
    magicLinkSubtitle: "Indtast e-mailen, du bruger til dit abonnement. Vi sender dig et sikkert login-link.",
    sendButton: "Send login-link",
    sending: "Sender…",
    checkEmail: "Tjek din e-mail for et sikkert AutoVere-login-link.",
    errorGeneric: "Noget gik galt. Prøv igen.",
    errorInvalidCredentials: "Forkert e-mail eller adgangskode.",
    errorRateLimited: "For mange forsøg. Vent et par minutter, og prøv igen.",
  },
};

export type ForgotPasswordCopy = {
  back: string;
  title: string;
  subtitle: string;
  emailLabel: string;
  sendButton: string;
  sending: string;
  checkEmail: string;
  errorGeneric: string;
  errorRateLimited: string;
};

export const forgotPasswordCopy: Record<Locale, ForgotPasswordCopy> = {
  en: { back: "Back to login", title: "Reset your password", subtitle: "Enter your email and we'll send you a link to create a new password.", emailLabel: "Email", sendButton: "Send reset link", sending: "Sending…", checkEmail: "If an account exists for that email, a reset link is on its way.", errorGeneric: "Could not send the reset email. Please try again.", errorRateLimited: "Too many attempts. Please wait a while and try again." },
  de: { back: "Zurück zur Anmeldung", title: "Passwort zurücksetzen", subtitle: "Gib deine E-Mail-Adresse ein, wir senden dir einen Link zum Erstellen eines neuen Passworts.", emailLabel: "E-Mail", sendButton: "Link senden", sending: "Wird gesendet…", checkEmail: "Falls ein Konto mit dieser E-Mail existiert, ist ein Link zum Zurücksetzen unterwegs.", errorGeneric: "Die E-Mail konnte nicht gesendet werden. Bitte versuche es erneut.", errorRateLimited: "Zu viele Versuche. Bitte warte etwas und versuche es erneut." },
  nl: { back: "Terug naar inloggen", title: "Wachtwoord opnieuw instellen", subtitle: "Vul je e-mailadres in en we sturen je een link om een nieuw wachtwoord aan te maken.", emailLabel: "E-mail", sendButton: "Link versturen", sending: "Versturen…", checkEmail: "Als er een account bestaat voor dit e-mailadres, is er een resetlink onderweg.", errorGeneric: "De e-mail kon niet worden verstuurd. Probeer het opnieuw.", errorRateLimited: "Te veel pogingen. Wacht even en probeer het opnieuw." },
  no: { back: "Tilbake til innlogging", title: "Tilbakestill passordet", subtitle: "Skriv inn e-posten din, så sender vi deg en lenke for å lage et nytt passord.", emailLabel: "E-post", sendButton: "Send tilbakestillingslenke", sending: "Sender…", checkEmail: "Hvis det finnes en konto med denne e-posten, er en tilbakestillingslenke på vei.", errorGeneric: "Kunne ikke sende e-posten. Prøv igjen.", errorRateLimited: "For mange forsøk. Vent litt og prøv igjen." },
  pl: { back: "Powrót do logowania", title: "Zresetuj hasło", subtitle: "Podaj swój e-mail, a wyślemy Ci link do utworzenia nowego hasła.", emailLabel: "E-mail", sendButton: "Wyślij link resetujący", sending: "Wysyłanie…", checkEmail: "Jeśli konto z tym adresem e-mail istnieje, link do resetowania jest już w drodze.", errorGeneric: "Nie udało się wysłać e-maila. Spróbuj ponownie.", errorRateLimited: "Zbyt wiele prób. Poczekaj chwilę i spróbuj ponownie." },
  sv: { back: "Tillbaka till inloggning", title: "Återställ ditt lösenord", subtitle: "Ange din e-post så skickar vi en länk för att skapa ett nytt lösenord.", emailLabel: "E-post", sendButton: "Skicka återställningslänk", sending: "Skickar…", checkEmail: "Om ett konto finns för den e-posten är en återställningslänk på väg.", errorGeneric: "Kunde inte skicka e-posten. Försök igen.", errorRateLimited: "För många försök. Vänta en stund och försök igen." },
  fr: { back: "Retour à la connexion", title: "Réinitialiser votre mot de passe", subtitle: "Indiquez votre e-mail et nous vous enverrons un lien pour créer un nouveau mot de passe.", emailLabel: "E-mail", sendButton: "Envoyer le lien", sending: "Envoi en cours…", checkEmail: "Si un compte existe pour cet e-mail, un lien de réinitialisation est en route.", errorGeneric: "Impossible d'envoyer l'e-mail. Veuillez réessayer.", errorRateLimited: "Trop de tentatives. Veuillez patienter puis réessayer." },
  da: { back: "Tilbage til login", title: "Nulstil din adgangskode", subtitle: "Indtast din e-mail, så sender vi dig et link til at oprette en ny adgangskode.", emailLabel: "E-mail", sendButton: "Send nulstillingslink", sending: "Sender…", checkEmail: "Hvis der findes en konto med denne e-mail, er et nulstillingslink på vej.", errorGeneric: "Kunne ikke sende e-mailen. Prøv igen.", errorRateLimited: "For mange forsøg. Vent lidt, og prøv igen." },
};

export type ResetPasswordCopy = {
  title: string;
  subtitle: string;
  passwordLabel: string;
  confirmLabel: string;
  submitButton: string;
  submitting: string;
  success: string;
  goToAccount: string;
  errorGeneric: string;
  errorMismatch: string;
  errorWeak: string;
  invalidLink: string;
  requestNewLink: string;
};

export const resetPasswordCopy: Record<Locale, ResetPasswordCopy> = {
  en: { title: "Create a new password", subtitle: "Choose a new password for your AutoVere account.", passwordLabel: "New password", confirmLabel: "Confirm password", submitButton: "Set new password", submitting: "Saving…", success: "Your password has been updated. You're now signed in.", goToAccount: "Go to My Account", errorGeneric: "Could not reset your password. The link may have expired.", errorMismatch: "Passwords do not match.", errorWeak: "Choose a password with at least 8 characters.", invalidLink: "This link is invalid or has expired.", requestNewLink: "Request a new reset link" },
  de: { title: "Neues Passwort erstellen", subtitle: "Wähle ein neues Passwort für dein AutoVere-Konto.", passwordLabel: "Neues Passwort", confirmLabel: "Passwort bestätigen", submitButton: "Neues Passwort speichern", submitting: "Wird gespeichert…", success: "Dein Passwort wurde aktualisiert. Du bist jetzt angemeldet.", goToAccount: "Zu meinem Konto", errorGeneric: "Passwort konnte nicht zurückgesetzt werden. Der Link ist möglicherweise abgelaufen.", errorMismatch: "Die Passwörter stimmen nicht überein.", errorWeak: "Wähle ein Passwort mit mindestens 8 Zeichen.", invalidLink: "Dieser Link ist ungültig oder abgelaufen.", requestNewLink: "Neuen Link anfordern" },
  nl: { title: "Nieuw wachtwoord aanmaken", subtitle: "Kies een nieuw wachtwoord voor je AutoVere-account.", passwordLabel: "Nieuw wachtwoord", confirmLabel: "Bevestig wachtwoord", submitButton: "Nieuw wachtwoord instellen", submitting: "Opslaan…", success: "Je wachtwoord is bijgewerkt. Je bent nu ingelogd.", goToAccount: "Naar Mijn account", errorGeneric: "Kon je wachtwoord niet resetten. De link is mogelijk verlopen.", errorMismatch: "Wachtwoorden komen niet overeen.", errorWeak: "Kies een wachtwoord van minimaal 8 tekens.", invalidLink: "Deze link is ongeldig of verlopen.", requestNewLink: "Nieuwe link aanvragen" },
  no: { title: "Lag et nytt passord", subtitle: "Velg et nytt passord for AutoVere-kontoen din.", passwordLabel: "Nytt passord", confirmLabel: "Bekreft passord", submitButton: "Lagre nytt passord", submitting: "Lagrer…", success: "Passordet ditt er oppdatert. Du er nå logget inn.", goToAccount: "Gå til Min side", errorGeneric: "Kunne ikke tilbakestille passordet. Lenken kan ha utløpt.", errorMismatch: "Passordene er ikke like.", errorWeak: "Velg et passord med minst 8 tegn.", invalidLink: "Denne lenken er ugyldig eller utløpt.", requestNewLink: "Be om en ny lenke" },
  pl: { title: "Utwórz nowe hasło", subtitle: "Wybierz nowe hasło do swojego konta AutoVere.", passwordLabel: "Nowe hasło", confirmLabel: "Potwierdź hasło", submitButton: "Ustaw nowe hasło", submitting: "Zapisywanie…", success: "Twoje hasło zostało zaktualizowane. Jesteś teraz zalogowany/a.", goToAccount: "Przejdź do mojego konta", errorGeneric: "Nie udało się zresetować hasła. Link mógł wygasnąć.", errorMismatch: "Hasła nie są zgodne.", errorWeak: "Wybierz hasło o długości co najmniej 8 znaków.", invalidLink: "Ten link jest nieprawidłowy lub wygasł.", requestNewLink: "Poproś o nowy link" },
  sv: { title: "Skapa ett nytt lösenord", subtitle: "Välj ett nytt lösenord för ditt AutoVere-konto.", passwordLabel: "Nytt lösenord", confirmLabel: "Bekräfta lösenord", submitButton: "Spara nytt lösenord", submitting: "Sparar…", success: "Ditt lösenord har uppdaterats. Du är nu inloggad.", goToAccount: "Gå till Mitt konto", errorGeneric: "Kunde inte återställa lösenordet. Länken kan ha gått ut.", errorMismatch: "Lösenorden matchar inte.", errorWeak: "Välj ett lösenord med minst 8 tecken.", invalidLink: "Länken är ogiltig eller har gått ut.", requestNewLink: "Begär en ny länk" },
  fr: { title: "Créer un nouveau mot de passe", subtitle: "Choisissez un nouveau mot de passe pour votre compte AutoVere.", passwordLabel: "Nouveau mot de passe", confirmLabel: "Confirmer le mot de passe", submitButton: "Définir le nouveau mot de passe", submitting: "Enregistrement…", success: "Votre mot de passe a été mis à jour. Vous êtes maintenant connecté(e).", goToAccount: "Aller à Mon compte", errorGeneric: "Impossible de réinitialiser votre mot de passe. Le lien a peut-être expiré.", errorMismatch: "Les mots de passe ne correspondent pas.", errorWeak: "Choisissez un mot de passe d'au moins 8 caractères.", invalidLink: "Ce lien est invalide ou a expiré.", requestNewLink: "Demander un nouveau lien" },
  da: { title: "Opret en ny adgangskode", subtitle: "Vælg en ny adgangskode til din AutoVere-konto.", passwordLabel: "Ny adgangskode", confirmLabel: "Bekræft adgangskode", submitButton: "Gem ny adgangskode", submitting: "Gemmer…", success: "Din adgangskode er opdateret. Du er nu logget ind.", goToAccount: "Gå til Min konto", errorGeneric: "Kunne ikke nulstille din adgangskode. Linket kan være udløbet.", errorMismatch: "Adgangskoderne matcher ikke.", errorWeak: "Vælg en adgangskode på mindst 8 tegn.", invalidLink: "Dette link er ugyldigt eller udløbet.", requestNewLink: "Anmod om et nyt link" },
};
