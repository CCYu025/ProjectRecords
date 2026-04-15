/* ──────────────────────────────────────────────────────
   JPG → WebP 批次轉換腳本
   用法：node 大陸蘇州機械手臂/convert_webp.js
   ────────────────────────────────────────────────────── */

const sharp  = require('sharp');
const fs     = require('fs');
const path   = require('path');

const PHOTO_DIR = path.join(__dirname, '照片');
const QUALITY   = 80;

function findJpgs(dir) {
  const results = [];
  fs.readdirSync(dir).forEach(function(name) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) {
      findJpgs(full).forEach(function(f) { results.push(f); });
    } else if (/\.(jpg|jpeg)$/i.test(name)) {
      results.push(full);
    }
  });
  return results;
}

async function main() {
  const jpgs = findJpgs(PHOTO_DIR);
  console.log('找到 ' + jpgs.length + ' 張 JPG，開始轉換...\n');
  for (const src of jpgs) {
    const dest = src.replace(/\.(jpg|jpeg)$/i, '.webp');
    await sharp(src).webp({ quality: QUALITY }).toFile(dest);
    const before = (fs.statSync(src).size  / 1024).toFixed(0);
    const after  = (fs.statSync(dest).size / 1024).toFixed(0);
    console.log('✓ ' + path.relative(__dirname, src) +
                '  →  .webp    ' + before + ' KB → ' + after + ' KB');
  }
  console.log('\n完成。原始 JPG 保留，確認網頁顯示正常後可自行刪除。');
}

main().catch(console.error);
