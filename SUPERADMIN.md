Setting a superAdmin custom claim
================================

This repo includes a small helper script to set a `superAdmin` custom claim on a Firebase user. Firestore security rules rely on this claim to allow approval operations.

Requirements
- A Firebase project with Admin SDK credentials (service account JSON).
- Either set the environment variable `GOOGLE_APPLICATION_CREDENTIALS` to point at the service account JSON, or pass `--serviceAccount /path/to/serviceAccount.json`.

Examples
- By email:

  node scripts/set-superadmin.js --email admin@example.com

- By uid:

  node scripts/set-superadmin.js --uid 8dKf...xyz

Or using the npm helper:

  npm run set-superadmin -- --email admin@example.com

Notes
- This script uses the Firebase Admin SDK and must be run from a machine or CI environment that has access to your service account credentials.
