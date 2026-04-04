# Demo Scripts

Reusable demo assets for AVA, Architect, agent scripts, and supporting web experiences.

## Structure

- `docs/` conventions, deployment notes, test data notes
- `data-actions/` exported Genesys data actions by industry
- `web/shared/` shared CSS, JS, and assets
- `web/nm-mvd/` New Mexico MVD web experiences
- `web/utilities/` utility demo web experiences
- `samples/` sample payloads and scenario data

## NM MVD assets

- `web/nm-mvd/agent-transfer/`
- `web/nm-mvd/reinstatement-form/`
- `web/nm-mvd/payment-confirmation/`

## Recommended workflow

1. Keep the data model stable in `samples/`
2. Build reusable UI and logic in `web/shared/`
3. Keep each experience isolated in its own folder
4. Document expected inputs in each folder's `README.md`
