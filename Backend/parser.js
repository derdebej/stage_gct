import fs from 'fs';
import pdfParse from 'pdf-parse';

export async function parsePDF(filePath) {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
     

    const numero = data.text.match(/N°:\s*([A-Z0-9]+)/i)?.[1];
    const date = data.text.match(/Date:\s*(\d{2}[\/-]\d{2}[\/-]\d{4})/i)?.[1];
    const demandeur = data.text.match(/Demandeur:\s*([A-Z\s]+)/i)?.[1];
    const titre = data.text.match(/Titre:\s*(.+)/i)?.[1]?.trim();

        function extractArticles(text) {
            const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
            const articles = [];
            let currentArticle = null;

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
    const Rawarticles = extractArticles(data.text);
    const articles = deduplicateArticles(Rawarticles);

    
    


    return { numero, demandeur , date, titre ,articles};
}

