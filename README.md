# Höfundar Skólaþráða 2016–2026

Gagnvirk skrá yfir 306 greinar, pistla, ritdóma og viðtöl og höfunda þeirra. Opnaðu `index.html` í vafra eða hýstu möppuna, til dæmis á GitHub Pages.

- **Færslur:** leit í titlum, nöfnum höfunda og viðmælenda og bókum sem eru rýndar. Kommur skipta ekki máli, „olafur“ finnur „Ólafur“. Hægt er að sía eftir flokki (greinar, pistlar, ritdómar, viðtöl) og árabili og raða eftir ári, titli eða númeri.
- **Höfundar:** yfirlit yfir hve margir höfundar eiga 1, 2, 3 … greinar, pistla, ritdóma, viðtöl eða færslur alls. Smelltu á línu til að sjá þá höfunda. Taflan sýnir fjölda í hverjum flokki og er flokkuð eftir völdum fjölda. Talningin fylgir völdum síum. Smelltu á nafn til að sjá færslur höfundarins.
- **Fjöldi eftir árum:** smelltu á súlu til að skoða eitt ár.

## Talning

- Færsla í fleiri en einum flokki (til dæmis grein og ritdómur) telst í hverjum flokki en einu sinni í heildartölu.
- Sá sem tók viðtal telst höfundur þess. Viðmælendur eru skráðir sér og teljast ekki höfundar.
- Höfundur bókar sem er rýnd telst ekki höfundur ritdómsins.
- Þýðingar og endurbirtingar teljast sérfærslur.

## Skrár

- `gogn/faerslur.json`: allar færslur (ár, flokkar, titill, höfundar, viðmælendur, bók sem er rýnd)
- `gogn/hofundayfirlit.md`: upphaflega yfirlitið yfir greinar og pistla
- `src/sida.html`, `src/app.js`: útlit og virkni síðunnar
- `bua_til.py`: býr til `index.html` úr skránum að ofan. Keyrðu `python3 bua_til.py` eftir breytingar.
- `index.html`: síðan sjálf, ein skrá sem þarf hvorki netþjón né aðrar skrár
