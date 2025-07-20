import fs from 'fs';
import pdfParse from 'pdf-parse';

const path = "C:/Users/nader/Downloads/DA Serveur de stockage NAS.pdf";
function hasValidHeader(text) {
  return /Groupe Chimique Tunisien/i.test(text) && /Demande d['’]achat/i.test(text);
}


    try {
        const dataBuffer = fs.readFileSync(path);
        console.log("✅ File read successful:", dataBuffer.length, "bytes");
        const data = await pdfParse(dataBuffer);
        if (!hasValidHeader(data.text)) {
            throw new Error("En-tête invalide - ce n'est pas un format de demande d'achat valide.");
        }


        
        const numero = data.text.match(/N°:\s*([A-Z0-9]+)/i)?.[1];
        const date = data.text.match(/Date:\s*(\d{2}\/\d{2}\/\d{4})/i)?.[1];
        const demandeur = data.text.match(/Demandeur:\s*([A-Z\s]+)/i)?.[1];
        const titreMatch = data.text.match(/Titre:\s*\n?([\s\S]*?)\nCompte:/i);
        const titre = titreMatch?.[1]?.replace(/\s+/g, ' ').trim();

        
        
        /*function extractArticles(text) {
            const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
            const articles = [];
            let currentArticle = null;

            const qtyRegex = /^(\d+)\s+UTND\s+([\d\s,]+)\s+\/\s+U([\d\s,]+)/;

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                
                const match = line.match(qtyRegex);
                if (match) {
                    const quantity = match[1];
                    const unit_price = match[2].replace(/\s/g, '');

                    const position = lines[i + 2]?.trim(); // skip line i+1 (useless "0" line)
                    const codeDesignationLine = lines[i + 3]?.trim();

                    const codeMatch = codeDesignationLine?.match(/^(\d+)(.+)/);
                    const code = codeMatch?.[1] || '';
                    let designation = codeMatch?.[2]?.trim() || '';
                    if (!lines[i+4].match(qtyRegex)){
                        designation = designation+ " " +lines[i + 4].trim()
                    }

                    currentArticle = {
                        position_and_code: `${position} ${code}`,
                        designation,
                        quantity,
                        unit_price,
                        detail: ""
                    };

                    articles.push(currentArticle);
                    i += 3; // Skip to after designation
                    continue;
                }

                // Append DETAILS if found
                if (line.startsWith("DETAILS") && currentArticle) {
                    const detail = line.replace("DETAILS :", "").trim();
                    currentArticle.detail = detail;
                }
            }

            return articles;
        }*/
        function extractArticles(text) {
            const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
            const articles = [];
            let currentArticle = null;

            

            const qtyRegex = /^(\d+)\s+UTND\s+([\d\s,]+)\s+\/\s+U([\d\s,]+)/;
            const categoryCodeLineRegex = /^\d{5}$/; // e.g., 90001
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
                    const unit_price = match[2].replace(/\s/g, '');

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

            return articles;
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





        

        
        console.log("Extracted number:", numero);
        console.log("Extracted demandeur:", demandeur);
        console.log("Extracted date:", date);
        console.log("Extracted titre:", titre);
        console.log("text:", data.text);
        //console.log("Extracted data:",data.text);
        // Usage example
        const Rawarticles = extractArticles(data.text);
        const articles = deduplicateArticles(Rawarticles);
        console.log("Extracted Articles:", articles);
    } catch (err) {
        console.error("❌ Could not read file:", err);
    }
