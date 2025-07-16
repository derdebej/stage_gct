import fs from 'fs';
import pdfParse from 'pdf-parse';

export async function parsePDF(filePath) {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);

    const match = data.text.match(/N°:\s*([A-Z0-9]+)/i);
    const numero = match ? match[1] : null;

    const matchDemandeur = data.text.match(/Demandeur:\s*([A-Z\s]+)/i);
    const demandeur = matchDemandeur ? matchDemandeur[1].trim() : null;


    return { numero, demandeur };
}

