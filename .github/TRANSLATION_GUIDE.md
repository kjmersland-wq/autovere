# AUTOVERE Translation Guide

This guide is for professional translators working on Polish, Italian, and Spanish localizations.

## Critical Requirements

### This is NOT a machine-translation task

- **DO NOT** use Google Translate, DeepL, or any automated translation tools
- **DO NOT** translate word-for-word literally
- **DO NOT** use generic SaaS language
- **DO NOT** use robotic AI-generated wording

### The tone must feel:

✅ **Premium** - Like high-end automotive publications  
✅ **Human** - Natural, conversational, emotionally intelligent  
✅ **Automotive-native** - Correct industry terminology  
✅ **Trust-building** - Calm authority, never pushy  
✅ **Conversational** - Where appropriate, like talking to a knowledgeable friend  

### Communication style references:

The translations should reflect:

- **Premium automotive editorial** tone (like Car & Driver, Autocar, Quattroruote, Auto Świat, Motor.es)
- **Calm authority** - Confident but never arrogant
- **Emotionally intelligent persuasion** - Understanding, not manipulative
- **Jeremy Miner-style trust-building** - Where it naturally fits

## Files to Translate

### Polish (Polski)
**File:** `src/i18n/locales/pl.ts`  
**Target publications style:** Auto Świat, Moto.pl  
**Note:** European Polish preferred

### Italian (Italiano)
**File:** `src/i18n/locales/it.ts`  
**Target publications style:** Quattroruote, Auto.it  
**Note:** Standard Italian (not regional dialects)

### Spanish (Español)
**File:** `src/i18n/locales/es.ts`  
**Target publications style:** Motor.es, Autobild.es  
**Note:** European Spanish preferred unless targeting Latin American markets

## What to Translate

### ✅ Everything must be translated:

- Navigation menus
- Hero sections
- Call-to-action (CTA) sections
- Pricing pages
- Authentication flows
- Metadata (SEO titles, descriptions)
- Footer content
- Forms and validation messages
- Billing information
- Comparison sections
- All UI text and labels
- Legal pages references
- Help center content

### ❌ Do NOT translate:

- Variable names (e.g., `{{name}}`, `{{a}}`, `{{b}}`)
- URLs or slugs
- AUTOVERE brand name (keep as "AUTOVERE")
- Technical keys in the JSON structure

## Example Translations

### English Original:
```
"A calmer, more intelligent way to discover your next car."
```

### ❌ Bad (literal/robotic):
```polish
"Spokojniejszy, bardziej inteligentny sposób na odkrycie następnego samochodu."
```

### ✅ Good (natural/premium):
```polish
"Spokojniejsza, przemyślana droga do odkrycia Twojego następnego auta."
```

---

### English Original:
```
"Tell AUTOVERE about your life — where you drive, who's in the car, what feels right."
```

### ❌ Bad (literal):
```italian
"Dì ad AUTOVERE della tua vita — dove guidi, chi c'è in macchina, cosa si sente giusto."
```

### ✅ Good (natural):
```italian
"Racconta ad AUTOVERE come vivi — dove guidi, chi viaggia con te, cosa ti fa sentire a tuo agio."
```

## Automotive Terminology

Use correct automotive terms:

| English | Polish | Italian | Spanish |
|---------|--------|---------|---------|
| Electric Vehicle (EV) | Pojazd elektryczny / EV | Veicolo elettrico / EV | Vehículo eléctrico / VE |
| Drivetrain | Układ napędowy | Trasmissione | Tren motriz |
| Range | Zasięg | Autonomia | Autonomía |
| All-wheel drive (AWD) | Napęd na cztery koła | Trazione integrale | Tracción total |
| Ownership | Własność / Posiadanie | Proprietà | Propiedad |
| Resale value | Wartość odsprzedaży | Valore di rivendita | Valor de reventa |
| Premium | Klasa premium | Premium / Prestigio | Premium / De alta gama |

## Tone Examples

### Calm, Premium Tone (Discovery Page):

**EN:** "Cars discovered through how you live."

**PL (Good):** "Samochody odkryte przez Twoje życie."  
**IT (Good):** "Auto scelte in base al tuo stile di vita."  
**ES (Good):** "Coches descubiertos a través de tu forma de vivir."

### Trust-building Tone (Help Section):

**EN:** "A calm, secure way to ask questions, share feedback, or start a conversation about your next car."

**PL (Good):** "Spokojny, bezpieczny sposób na zadawanie pytań, dzielenie się opiniami lub rozpoczęcie rozmowy o Twoim następnym aucie."  
**IT (Good):** "Un modo calmo e sicuro per fare domande, condividere feedback o iniziare una conversazione sulla tua prossima auto."  
**ES (Good):** "Una forma tranquila y segura de hacer preguntas, compartir opiniones o iniciar una conversación sobre tu próximo coche."

## Testing Your Translation

Ask yourself:

1. **Would a native speaker naturally say this?**
2. **Does it sound premium, not generic?**
3. **Is the automotive terminology correct?**
4. **Does it feel calm and intelligent, not pushy?**
5. **Would this fit in a high-end automotive magazine?**

If the answer to any question is "no", revise the translation.

## Cultural Adaptation

Feel free to adapt idioms and cultural references:

- Use local automotive culture references when appropriate
- Adapt measurements (km vs. miles) if needed
- Consider local market preferences (EV adoption, car types, etc.)

## SEO Considerations

For SEO metadata (`seo_title`, `seo_desc`):

- Keep titles under 60 characters
- Keep descriptions under 160 characters
- Make them compelling and keyword-rich
- Maintain the premium tone

## Variable Interpolation

Some strings contain variables like `{{name}}`, `{{a}}`, `{{b}}`, `{{n}}`:

**English:**
```
"People who consider the {{name}} also weigh…"
```

**Translation (keep variables intact):**
```polish
"Osoby rozważające {{name}} również porównują…"
```

## Questions?

If you're unsure about:
- Tone/style appropriateness
- Technical terminology
- Cultural adaptation

Contact the AUTOVERE team for clarification before proceeding.

---

## Getting Started

1. Open the locale file for your language
2. Read the header comments
3. Translate section by section (start with `nav`, `hero`, `footer`)
4. Test key phrases with native speakers if possible
5. Review for consistency across the entire file
6. Double-check automotive terminology
7. Submit for review

**Thank you for helping make AUTOVERE truly global with premium, human-quality translations!** 🚗✨
