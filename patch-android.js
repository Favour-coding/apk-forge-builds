// APK Forge - Android configuration patcher
const fs = require('fs');
const path = require('path');

const manifestPath = path.join(__dirname, 'android/app/src/main/AndroidManifest.xml');
const colorsPath = path.join(__dirname, 'android/app/src/main/res/values/colors.xml');
const stylesPath = path.join(__dirname, 'android/app/src/main/res/values/styles.xml');

const targetOrientation = 'portrait';
const splashColor = '#0a0f1d';
const permissions = ["android.permission.INTERNET"];

// 1. Patch AndroidManifest.xml
if (fs.existsSync(manifestPath)) {
  let content = fs.readFileSync(manifestPath, 'utf8');

  // Inject permissions if not already present
  let permissionsXml = '';
  for (const perm of permissions) {
    if (!content.includes(perm)) {
      permissionsXml += `    <uses-permission android:name="${perm}" />\n`;
    }
  }

  if (permissionsXml) {
    content = content.replace('<application', `${permissionsXml}    <application`);
  }

  // Adjust activity orientation
  if (targetOrientation === 'portrait') {
    content = content.replace(/android:screenOrientation="[^"]*"/g, 'android:screenOrientation="portrait"');
    if (!content.includes('android:screenOrientation=')) {
      content = content.replace('<activity', '<activity android:screenOrientation="portrait"');
    }
  } else if (targetOrientation === 'landscape') {
    content = content.replace(/android:screenOrientation="[^"]*"/g, 'android:screenOrientation="landscape"');
    if (!content.includes('android:screenOrientation=')) {
      content = content.replace('<activity', '<activity android:screenOrientation="landscape"');
    }
  } else {
    // sensor / auto
    content = content.replace(/android:screenOrientation="[^"]*"/g, 'android:screenOrientation="unspecified"');
  }

  fs.writeFileSync(manifestPath, content, 'utf8');
  console.log('Successfully patched AndroidManifest.xml with permissions and orientation');
}

// 2. Patch colors.xml with custom splash color
if (fs.existsSync(colorsPath)) {
  let colors = fs.readFileSync(colorsPath, 'utf8');
  if (colors.includes('colorPrimary')) {
    colors = colors.replace(/<color name="colorPrimary">[^<]*<\/color>/, `<color name="colorPrimary">${splashColor}</color>`);
  }
  fs.writeFileSync(colorsPath, colors, 'utf8');
}
