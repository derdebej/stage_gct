    import fs from 'fs';
    import pdfParse from 'pdf-parse';

    const path = "C:/Users/nader/Downloads/DA 091260.pdf";

    try {
        const dataBuffer = fs.readFileSync(path);
        console.log("✅ File read successful:", dataBuffer.length, "bytes");
        const data = await pdfParse(dataBuffer);

        
        const numero = data.text.match(/N°:\s*([A-Z0-9]+)/i)?.[1];
        const date = data.text.match(/Date:\s*(\d{2}\/\d{2}\/\d{4})/i)?.[1];
        const demandeur = data.text.match(/Demandeur:\s*([A-Z\s]+)/i)?.[1];
        const titre = data.text.match(/Titre:\s*(.+)/i)?.[1]?.trim();
        
        
        function extractArticles(text) {
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
                    const designation = codeMatch?.[2]?.trim() || '';

                    currentArticle = {
                        position_and_code: `${position} ${code}`,
                        designation,
                        quantity,
                        unit_price
                    };

                    articles.push(currentArticle);
                    i += 3; // Skip to after designation
                    continue;
                }

                // Append DETAILS if found
                if (line.startsWith("DETAILS") && currentArticle) {
                    const detail = line.replace("DETAILS :", "").trim();
                    currentArticle.designation += " " + detail;
                }
            }

            return articles;
        }
        function deduplicateArticles(articles) {
            const seen = new Set();
            const uniqueArticles = [];

            for (const article of articles) {
                const key = article.position_and_code;
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
        //console.log("text:", data.text);
        //console.log("Extracted data:",data.text);
        // Usage example
        const Rawarticles = extractArticles(data.text);
        const articles = deduplicateArticles(Rawarticles);
        console.log("Extracted Articles:", articles);
    } catch (err) {
        console.error("❌ Could not read file:", err);
    }
