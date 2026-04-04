# Conventions

## Naming
- Use kebab-case for folders and filenames.
- Use `index.html`, `styles.css`, and `app.js` inside each experience folder.
- Use `config.sample.js` for local testing only.

## Data model
Prefer a single object model per experience. For NM MVD agent handoff:

- key
- name
- dob
- licenseStatus
- registrationStatus
- suspensionReason
- outstandingBalance
- reinstatementRequired
- hasTicket
- ticketNumber
- ticketStatus
- requiredActions
- recommendedNextStep
- channelPreference
- smsFormSentAt
- smsReceivedAt
- smsFormSignedName
- smsFormToken

## Reuse
Put common CSS and JS in `web/shared/`.
