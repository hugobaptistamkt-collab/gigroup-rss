import requests
from bs4 import BeautifulSoup
from feedgen.feed import FeedGenerator

URL = "https://www.gigroupholding.com/careers/change-your-life/?country=portugal"

response = requests.get(URL)
soup = BeautifulSoup(response.text, "html.parser")

# Identificar blocos de ofertas (pode precisar ajuste se eles mudarem o HTML)
jobs = soup.select(".job-listing, .job-card, .job, li")  # selecionadores genéricos

fg = FeedGenerator()
fg.title("GI Group Portugal - Oportunidades de Emprego")
fg.link(href=URL)
fg.description("Feed automático gerado via GitHub Actions")

for job in jobs:
    title = job.get_text(strip=True)
    link_tag = job.find("a")

    if link_tag:
        link = link_tag["href"]
        if not link.startswith("http"):
            link = "https://www.gigroupholding.com" + link
    else:
        continue

    fe = fg.add_entry()
    fe.title(title)
    fe.link(href=link)
    fe.description(title)

# Guardar RSS
fg.rss_file('feed.xml')
