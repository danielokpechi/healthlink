#!/usr/bin/env node
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

function usage() {
  console.log('Set superAdmin custom claim for a user');
  console.log('Usage: node scripts/set-superadmin.cjs --email user@example.com');
  console.log('       node scripts/set-superadmin.cjs --uid <uid>');
  process.exit(1);
}

const args = process.argv.slice(2);
let email;
let uid;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--email') email = args[++i];
  else if (args[i] === '--uid') uid = args[++i];
}
if (!email && !uid) usage();

// ✅ Load local service account
const serviceAccountPath = path.resolve('./firebase-service-account.json');
if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ Service account file not found:', serviceAccountPath);
  process.exit(1);
}
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function run() {
  try {
    let targetUid = uid;
    if (!targetUid) {
      const userRecord = await admin.auth().getUserByEmail(email);
      targetUid = userRecord.uid;
    }
    await admin.auth().setCustomUserClaims(targetUid, { superAdmin: true });
    console.log(`✅ Successfully set superAdmin claim for uid=${targetUid}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error setting claim:', err.message || err);
    process.exit(1);
  }
}

run();
