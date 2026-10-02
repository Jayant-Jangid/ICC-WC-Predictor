import https from 'https';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import AdmZip from 'adm-zip';

const __dirname = dirname(fileURLToPath(import.meta.url));
const RAW_DIR = join(__dirname, 'raw');
const ZIP_PATH = join(__dirname, 'odis_json.zip');
const URL = 'https://cricsheet.org/downloads/odis_json.zip';

async function download() {
  if (!fs.existsSync(RAW_DIR)) fs.mkdirSync(RAW_DIR, { recursive: true });

  // Check if already downloaded
  if (fs.existsSync(RAW_DIR) && fs.readdirSync(RAW_DIR).length > 100) {
    console.log(`✓ Raw data already present (${fs.readdirSync(RAW_DIR).length} files). Skipping download.`);
    return;
  }

  console.log('⬇️  Downloading Cricsheet ODI data...');

  await new Promise((resolve, reject) => {
    const file = fs.createWriteStream(ZIP_PATH);
    https.get(URL, (res) => {
      // Handle redirects
      if (res.statusCode === 301 || res.statusCode === 302) {
        https.get(res.headers.location, (res2) => {
          res2.pipe(file);
          file.on('finish', () => { file.close(); resolve(); });
        }).on('error', reject);
        return;
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', reject);
  });

  console.log('📦 Extracting...');
  const zip = new AdmZip(ZIP_PATH);
  zip.extractAllTo(RAW_DIR, true);
  fs.unlinkSync(ZIP_PATH);

  const count = fs.readdirSync(RAW_DIR).filter(f => f.endsWith('.json')).length;
  console.log(`✅ Downloaded and extracted ${count} match files.`);
}

download().catch(err => { console.error('❌ Download failed:', err.message); process.exit(1); });
