import fs from 'fs';
import pdfParse from 'pdf-parse';

const path = 'C:/Users/nader/Desktop/stage gct/Backend/DA AN103360.pdf';

try {
    const dataBuffer = fs.readFileSync(path);
    console.log("✅ File read successful:", dataBuffer.length, "bytes");
    const data = await pdfParse(dataBuffer);
    const match = data.text.match(/N°:\s*([A-Z0-9]+)/i);
    const numero = match ? match[1] : null;
    
    const matchDemandeur = data.text.match(/Demandeur:\s*([A-Z\s]+)/i);
    const demandeur = matchDemandeur ? matchDemandeur[1].trim() : null;

    console.log("Extracted number:", numero);
    console.log("Extracted demandeur:", demandeur);
} catch (err) {
    console.error("❌ Could not read file:", err);
}
