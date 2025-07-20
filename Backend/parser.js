import fs from 'fs';
import pdfParse from 'pdf-parse';

function hasValidHeader(text) {
  return /Groupe Chimique Tunisien/i.test(text) && /Demande d['’]achat/i.test(text);
}

function parseFrenchAmount(amountStr) {
  const cleaned = amountStr.replace(/\s/g, '').replace(',', '.');
  const value = parseFloat(cleaned);
  return value.toFixed(2); // returns a string like "2600.00"
}

function extractFullAED(text) {
  const lines = text.split('\n');

  // Find the index of the line with "N° AED:"
  const index = lines.findIndex(line => /N° AED\s*:/i.test(line));
  if (index === -1) return null;

  const result = [];

  // Check if "N° AED: <value>" is inline
  const inlineMatch = lines[index].match(/N° AED\s*:\s*(.+)/i);
  if (inlineMatch && inlineMatch[1].trim() !== '') {
    result.push(inlineMatch[1].trim());
  }

  // Start checking the following lines
  for (let i = index + 1; i < lines.length; i++) {
    const line = lines[i].trim();

    // Stop if the line looks like a new field (e.g. "Objet:" or "Demandeur:")
    if (/^[A-ZÀ-Ü][\wÀ-ÿ \-’']{1,40}:/i.test(line)) break;

    // Append valid AED line
    if (line !== '') result.push(line);
  }

  return result.join(' ');
}


export async function parsePDF(filePath) {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    //console.log("text" , data.text) 

    if (!hasValidHeader(data.text)) {
        throw new Error("En-tête invalide - ce n'est pas un format de demande d'achat valide.");
    }

    const type = /Code de l'investissement/i.test(data.text) &&
               /N° AED/i.test(data.text) &&
               /Objet/i.test(data.text)
               ? "investissement"
               : "exploitation";
    let codeInvest = null;
    let numeroAED = null;
    let objet = null;

    if (type === "investissement") {
        codeInvest = data.text.match(/Code de l'investissement\s*:\s*(.+)/i)?.[1]?.trim() || null;
        numeroAED = extractFullAED(data.text)
        objet = data.text.match(/Objet\s*:\s*(.+)/i)?.[1]?.trim() || null;
    }

    console.log("Type : ", type)
    console.log(codeInvest)
    console.log(numeroAED)
    console.log(objet)

    const numero = data.text.match(/N°:\s*([A-Z0-9]+)/i)?.[1];
    const date = data.text.match(/Date:\s*(\d{2}[\/-]\d{2}[\/-]\d{4})/i)?.[1];
    const demandeur = data.text.match(/Demandeur:\s*([A-Z\s]+)\r?\n/)?.[1]?.trim();
    const titre = data.text.match(/Titre:\s*(.+)/i)?.[1]?.trim();
    const regex = /^Co[uû]t total estim[ée]/i;

   
    


        function extractArticles(text) {
            const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
            const articles = [];
            let currentArticle = null;


            const index = lines.findIndex(line => regex.test(line));
            const coutTotale = parseFrenchAmount(lines [index-1])



            const qtyRegex = /^(\d+)\s+UTND\s+([\d\s,]+)\s+\/\s+U([\d\s,]+)/;
            const categoryCodeLineRegex = /^\d{5}$/; // e.g., 90001
            const categoryCodeLineRegex2 = /^\d{7}$/; // parfois le code est 9000001
            const totalCostRegex = /^\d+[\s,]+\s+Coût total estimé/i;
            const footerRegex = /^(HISTORIQUE DES APPROBATIONS|Imprimé par|DATE|VISA|Chef|Direction)/i;
            const priceRecapLine = /^\d+\s+[\d.,]+$/; // e.g., "38 250,000"

            let skipNextLine = false;

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];

                if (skipNextLine) {
                    skipNextLine = false;
                    continue;
                }

                const match = line.match(qtyRegex);
                if (match) {
                    const quantity = match[1];
                    const unit_price = parseFrenchAmount(match[2].replace(/\s/g, ''));
                    const position = lines[i + 2]?.trim();
                    const codeDesignationLine = lines[i + 3]?.trim();
                    const codeMatch = codeDesignationLine?.match(/^(\d+)(.+)/);
                    let detail = ""
                    const code = codeMatch?.[1] || '';
                    let designation = codeMatch?.[2]?.trim() || '';

                    
                    let j = i + 4;
                    while (j < lines.length) {
                        const nextLine = lines[j].trim();

                        if (
                            qtyRegex.test(nextLine) ||
                            categoryCodeLineRegex.test(nextLine) ||
                            categoryCodeLineRegex2.test(nextLine) ||
                            totalCostRegex.test(nextLine) ||
                            priceRecapLine.test(nextLine) ||
                            footerRegex.test(nextLine) ||
                            nextLine.startsWith("DETAILS")
                        ) {
                            break;
                        }
                        if (nextLine.endsWith("DETAILS :")) {
                            detail = nextLine.replace("DETAILS :", "").trim();
                            break;
                        }
                        designation += " " + nextLine;
                        j++;
                    }

                    currentArticle = {
                        position,
                        code,
                        designation: designation.trim(),
                        quantity,
                        unit_price,
                        detail
                    };

                    articles.push(currentArticle);
                    i = j - 1;
                    continue;
                }

                
            }

            return [articles , coutTotale];
        }
    function deduplicateArticles(articles) {
        const seen = new Set();
        const uniqueArticles = [];

        for (const article of articles) {
            const key = article.code;
            if (!seen.has(key)) {
                seen.add(key);
                uniqueArticles.push(article);
            }
        }

        return uniqueArticles;
    }
    const Rawarticles = extractArticles(data.text);
    const coutTotale = Rawarticles[1];
    const articles = deduplicateArticles(Rawarticles[0]);
    

    
    


    return { numero, demandeur , date, titre ,articles , coutTotale , type , codeInvest ,numeroAED , objet};
}

