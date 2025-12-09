const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

async function generateRSS() {
  const url = "https://www.gigroupholding.com/careers/change-your-life/?country=portugal#openpositions";

  console.log("A obter página...");

  const response = await axios.get(url);
  const html = response.data;

  const $ = cheerio.load(html);

  // Seletores reais da página — ajustado para GIGroup
  const jobs = [];

  $(".job-list .job-item").each((i, el) => {
    const title = $(el).find(".job-title").text().trim();
    const location = $(el).find(".job-location").text().trim();
    const link = $(el).find("a").attr("href");

    if (title && link) {
      jobs.push({
        title,
        description: location || "Sem localização",
        link: link.startsWith("http") ? link : "https://www.gigroupholding.com" + link
      });
    }
  });

  console.log("Encontrados:", jobs.length, "jobs");

  // Construir RSS
  let rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
<title>GIGroup Portugal – Oportunidades</title>
<link>${url}</link>
<description>Feed gerado automaticamente</description>
`;

  jobs.forEach(job => {
    rss += `
<item>
<title>${job.title}</title>
<link>${job.link}</link>
<description>${job.description}</description>
</item>
`;
  });

  rss += `
</channel>
</rss>
`;

  fs.writeFileSync("feed.xml", rss, "utf8");
  console.log("feed.xml criado com sucesso!");
}

generateRSS();
