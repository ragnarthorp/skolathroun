"""Býr til index.html úr src/sida.html, src/app.js og gogn/faerslur.json.

Keyrðu `python3 bua_til.py` eftir að gögnum eða kóða hefur verið breytt.
"""
import json
from pathlib import Path

rot = Path(__file__).parent
sida = (rot / "src/sida.html").read_text(encoding="utf-8")
app = (rot / "src/app.js").read_text(encoding="utf-8")
gogn = json.loads((rot / "gogn/faerslur.json").read_text(encoding="utf-8"))

still_lok = sida.index("</style>") + len("</style>")
haus, likami = sida[:still_lok], sida[still_lok:]
gogn_js = json.dumps(gogn, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")

html = f"""<!doctype html>
<html lang="is">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<style>[hidden]{{display:none!important}}body{{margin:0}}img{{max-width:100%}}</style>
{haus}
</head>
<body>{likami}
<script>
const DATA={gogn_js};
{app}</script>
</body>
</html>
"""
(rot / "index.html").write_text(html, encoding="utf-8")
print(f"index.html: {len(gogn)} færslur")
