#!/usr/bin/env node

/**
 * Package Chrome Extension for Chrome Web Store Submission
 * This script creates a clean ZIP file with only the necessary files
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Files and directories to include in the package
const filesToInclude = [
  'manifest.json',
  'popup.html',
  'popup.css',
  'popup.js',
  'content.js',
  'jsQR.js',
  'icons/',
  'README.md'
];

// Output filename
const outputFile = 'qr-code-scanner-v1.0.0.zip';

console.log('📦 Packaging Chrome Extension for Chrome Web Store...\n');

// Check if all required files exist
console.log('✓ Checking required files...');
let allFilesExist = true;
filesToInclude.forEach(file => {
  const filePath = path.join(__dirname, file);
  const exists = fs.existsSync(filePath);
  if (exists) {
    console.log(`  ✓ ${file}`);
  } else {
    console.log(`  ✗ ${file} - NOT FOUND`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.error('\n❌ Some required files are missing. Please ensure all files exist.');
  process.exit(1);
}

console.log('\n✓ All required files found!\n');

// Remove old zip if exists
if (fs.existsSync(outputFile)) {
  console.log('🗑️  Removing old package...');
  fs.unlinkSync(outputFile);
}

// Create the zip file
console.log('📦 Creating package...');
try {
  const files = filesToInclude.join(' ');
  execSync(`zip -r ${outputFile} ${files} -x "*.DS_Store" "*.log"`, {
    cwd: __dirname,
    stdio: 'inherit'
  });

  // Get file size
  const stats = fs.statSync(outputFile);
  const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

  console.log('\n✅ Package created successfully!');
  console.log(`📁 File: ${outputFile}`);
  console.log(`📊 Size: ${fileSizeMB} MB`);
  console.log('\n🚀 Ready to upload to Chrome Web Store!');
  console.log('\nNext steps:');
  console.log('1. Go to https://chrome.google.com/webstore/devconsole/');
  console.log('2. Click "New Item"');
  console.log(`3. Upload ${outputFile}`);
  console.log('4. Fill out the store listing details');
  console.log('5. Submit for review');

} catch (error) {
  console.error('\n❌ Error creating package:', error.message);
  process.exit(1);
}
