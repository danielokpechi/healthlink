#!/usr/bin/env node
/**
 * Usage:
 *  node scripts/set-superadmin.js --email admin@example.com
 *  node scripts/set-superadmin.js --uid <UID>
 *
 * This script requires a Firebase Admin SDK service account JSON pointed to by
 * the GOOGLE_APPLICATION_CREDENTIALS environment variable, or you can pass
 * --serviceAccount /path/to/serviceAccount.json
 */
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

function usage() {
  console.log('Set superAdmin custom claim for a user');
  console.log('Usage: node scripts/set-superadmin.js --email user@example.com');
  console.log('       node scripts/set-superadmin.js --uid <uid>');
  process.exit(1);
}

const args = process.argv.slice(2);
let email;
let uid;
let serviceAccountPath;
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--email') email = args[++i];
  else if (a === '--uid') uid = args[++i];
  else if (a === '--serviceAccount') serviceAccountPath = args[++i];
}

if (!email && !uid) usage();

if (serviceAccountPath) {
  const sa = path.resolve(serviceAccountPath);
  if (!fs.existsSync(sa)) {
    console.error('Service account file not found:', sa);
    process.exit(1);
  }
  admin.initializeApp({ credential: admin.credential.cert(sa) });
} else if (!admin.apps.length) {
  // If GOOGLE_APPLICATION_CREDENTIALS is set, Admin SDK will pick it up.
  try {
    admin.initializeApp();
  } catch (e) {
    console.error('Failed to initialize Firebase Admin SDK. Provide --serviceAccount or set GOOGLE_APPLICATION_CREDENTIALS.');
    console.error(e.message);
    process.exit(1);
  }
}

async function run() {
  try {
    let targetUid = uid;
    if (!targetUid) {
      const userRecord = await admin.auth().getUserByEmail(email);
      targetUid = userRecord.uid;
    }

    await admin.auth().setCustomUserClaims(targetUid, { superAdmin: true });
    console.log(`Set superAdmin claim for uid=${targetUid}`);
    process.exit(0);
  } catch (err) {
    console.error('Error setting claim:', err && err.message ? err.message : err);
    process.exit(1);
  }
}

run();
