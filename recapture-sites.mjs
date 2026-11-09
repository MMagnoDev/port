import { chromium } from 'playwright';
import path from 'path';

async function main() {
  const sites = [
    {
      url: 'https://sergio-psicologo.vercel.app/index.html',
      file: 'sergio-psicologo.png'
    },
    {
      url: 'https://nuderest.vercel.app/',
      file: 'nuderest.png'
    },
    {
      url: 'https://analuiza-site.vercel.app/',
      file: 'analuiza.png'
    },
    {
      url: 'https://pedro-violino.vercel.app/',
      file: 'pedro-violino.png'
    },
    {
      url: 'https://www.agenciaminimum.com/',
      file: 'agencia-minimum.png'
    }
  ];

  const browser = await chromium.launch();

  // Test with viewport 1600x1200 so content has more breathing room on sides
  for (const s of sites) {
    try {
      console.log('Recapturing:', s.url);
      const page = await browser.newPage({
        viewport: { width: 1600, height: 1200 },
        deviceScaleFactor: 1.5,
      });
      await page.goto(s.url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(1500);
      const outPath = path.join('public/assets/images/projects', s.file);
      await page.screenshot({ path: outPath, clip: { x: 0, y: 0, width: 1600, height: 1200 } });
      console.log('Saved:', outPath);
      await page.close();
    } catch (e) {
      console.error('Error recapturing', s.url, e.message);
    }
  }

  await browser.close();
  console.log('Finished recapturing sites!');
}

main().catch(console.error);

