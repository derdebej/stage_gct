import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import { pathToFileURL } from 'url';

const require = createRequire(import.meta.url);
const workerPath = require.resolve('pdfjs-dist/legacy/build/pdf.worker.mjs');
pdfjsLib.GlobalWorkerOptions.workerSrc = pathToFileURL(workerPath).toString();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const parsePDF = async (filePath) => {
  const data = new Uint8Array(fs.readFileSync(filePath));
  const loadingTask = pdfjsLib.getDocument({ data });
  const pdf = await loadingTask.promise;

  const articles = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    
    const rawText = content.items.map(item => item.str).join(' ');
    console.log(`\n--- Page ${pageNum} ---`);
    console.log(rawText);

    
    const lines = [];
    let lastY = null;
    let line = [];

    content.items.forEach(item => {
      if (lastY === null || Math.abs(item.transform[5] - lastY) < 3) {
        line.push(item.str);
      } else {
        lines.push(line.join(' ').trim());
        line = [item.str];
      }
      lastY = item.transform[5];
    });
    if (line.length > 0) lines.push(line.join(' ').trim());

    for (const text of lines) {
      const regex = /^(\d+)\s+U\s+TND\s+([\d\s,]+)\s+\/\s+U\s+([\d\s,]+)(\d+)\s+(\d+)\s+(.+)$/;
      const match = text.match(regex);

      if (match) {
        const [, quantity, unit_price, total_price, position, code, designation] = match;
        articles.push({
          quantity: quantity.trim(),
          unit_price: unit_price.replace(/\s/g, ''),
          total_price: total_price.replace(/\s/g, ''),
          position: position.trim(),
          code: code.trim(),
          designation: designation.trim()
        });
      } else if (/^DETAILS\s*[:\-]?\s*/i.test(text) && articles.length > 0) {
        const detail = text.replace(/^DETAILS\s*[:\-]?\s*/i, '').trim();
        articles[articles.length - 1].designation += ' ' + detail;
      }
    }
  }

  return articles;
};

// Example usage
const filePath = "C:/Users/nader/Downloads/DA 091260.pdf";
parsePDF(filePath)
  .then(articles => {
    //console.log('Extracted articles:\n', JSON.stringify(articles, null, 2));
  })
  .catch(err => {
    console.error('PDF extraction error:', err);
  });
