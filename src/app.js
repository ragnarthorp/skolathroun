const YEARS=[2016,2017,2018,2019,2020,2021,2022,2023,2024,2025,2026];
// flokkar: nefnifall et./ft., eignarfall ft., "Flest…" og "Engin…" form
const CATS=[
  {k:"grein",l:"Grein",pl:"Greinar",one:"grein",many:"greinar",gen:"greina",most:"Flestar greinar",none:"Engin grein",col:"grein"},
  {k:"pistill",l:"Pistill",pl:"Pistlar",one:"pistill",many:"pistlar",gen:"pistla",most:"Flestir pistlar",none:"Enginn pistill",col:"pistill"},
  {k:"ritdomur",l:"Ritdómur",pl:"Ritdómar",one:"ritdómur",many:"ritdómar",gen:"ritdóma",most:"Flestir ritdómar",none:"Enginn ritdómur",col:"ritdomur"},
  {k:"vidtal",l:"Viðtal",pl:"Viðtöl",one:"viðtal",many:"viðtöl",gen:"viðtala",most:"Flest viðtöl",none:"Ekkert viðtal",col:"vidtal"},
];
const ALLS={k:"t",pl:"Færslur",one:"færsla",many:"færslur",gen:"færslna",most:"Flestar færslur",none:"Engin færsla"};
const CAT=Object.fromEntries(CATS.map(c=>[c.k,c]));
const coll=new Intl.Collator("is");
DATA.forEach(e=>{e.a=e.hofundar;e.v=e.vidmaelendur||[];e.ft=fold(e.titill+" "+(e.bok?e.bok.hofundur+" "+e.bok.titill:"")+" "+e.v.join(" "));e.fa=e.a.map(fold)});
function fold(s){let o="";for(const ch of s)o+=ch.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().charAt(0)||ch;return o}
const one=n=>n%10===1&&n%100!==11;
const cnt=(n,c)=>`${n} ${one(n)?c.one:c.many}`;
const hf=n=>one(n)?"höfundur":"höfundar";
const S={view:"skra",q:"",type:"all",from:2016,to:2026,author:null,sortS:"yr-desc",metric:"grein",sortA:"grein",dirA:-1,nG:null,limit:80};
try{const v=localStorage.getItem("hof-view");if(v)S.view=v}catch(e){}
if(["skra","hofundar"].includes(location.hash.slice(1)))S.view=location.hash.slice(1);
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function hl(s){const q=fold(S.q.trim());if(!q)return esc(s);const f=fold(s);let out="",i=0,j;
  while((j=f.indexOf(q,i))>-1){out+=esc(s.slice(i,j))+"<mark>"+esc(s.slice(j,j+q.length))+"</mark>";i=j+q.length}return out+esc(s.slice(i))}
const typeOk=e=>S.type==="all"||e.c.includes(S.type);
const yearOk=e=>e.y>=S.from&&e.y<=S.to;
const authOk=e=>S.view!=="skra"||!S.author||e.a.includes(S.author);
const qOk=e=>{const q=fold(S.q.trim());return !q||e.ft.includes(q)||e.fa.some(a=>a.includes(q))};
const stackKey=e=>e.c.length>1?"fleiri":e.c[0];

// haus
(function(){const au=new Set(DATA.flatMap(e=>e.a));
  $("stats").innerHTML=`<span><b>${DATA.length}</b>færslur</span>`+CATS.map(c=>`<span><b>${DATA.filter(e=>e.c.includes(c.k)).length}</b>${c.pl.toLowerCase()}</span>`).join("")+`<span><b>${au.size}</b>höfundar</span>`;
  $("total").textContent=DATA.length;
  $("legend").innerHTML=CATS.map(c=>`<span><i style="background:var(--${c.col})"></i>${c.l}</span>`).join("")+`<span><i style="background:var(--fleiri)"></i>Fleiri en einn flokkur</span>`;
  $("typechips").innerHTML=`<button class="chip" data-type="all">Allt</button>`+CATS.map(c=>`<button class="chip" data-type="${c.k}">${c.pl}</button>`).join("");
})();
for(const id of["yfrom","yto"])$(id).innerHTML=YEARS.map(y=>`<option>${y}</option>`).join("");
$("yfrom").onchange=e=>{S.from=+e.target.value;if(S.to<S.from)S.to=S.from;render()};
$("yto").onchange=e=>{S.to=+e.target.value;if(S.from>S.to)S.from=S.to;render()};
$("q").oninput=e=>{S.q=e.target.value;S.limit=80;render()};
document.querySelectorAll("#typechips .chip").forEach(b=>b.onclick=()=>{S.type=b.dataset.type;render()});
document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>setView(b.dataset.view));
$("sort").onchange=e=>{if(S.view==="skra")S.sortS=e.target.value;else{const[k,d]=e.target.value.split(":");S.sortA=k;S.dirA=+d}render()};
function setView(v){S.view=v;try{localStorage.setItem("hof-view",v)}catch(e){}history.replaceState(null,"","#"+v);render()}
function pickAuthor(a){S.author=a;S.q="";$("q").value="";S.view="skra";S.limit=500;render();$("result").scrollIntoView({block:"start",behavior:"smooth"})}
function pickYear(y){if(S.from===y&&S.to===y){S.from=2016;S.to=2026}else{S.from=S.to=y}render()}

function renderChart(){
  const base=DATA.filter(e=>typeOk(e)&&authOk(e)&&qOk(e));
  const keys=[...CATS.map(c=>c.k),"fleiri"];
  const per=YEARS.map(y=>{const r={y,t:0};keys.forEach(k=>r[k]=0);base.forEach(e=>{if(e.y===y){r[stackKey(e)]++;r.t++}});return r});
  const max=Math.max(1,...per.map(r=>r.t));const H=140;
  $("bars").innerHTML=per.map(r=>{const off=r.y<S.from||r.y>S.to;
    const desc=CATS.filter(c=>r[c.k]).map(c=>cnt(r[c.k],c)).concat(r.fleiri?[`${r.fleiri} í fleiri en einum flokki`]:[]).join(", ")||"engar færslur";
    const seg=keys.map(k=>r[k]?`<span style="height:${r[k]/max*H}px;background:var(--${CAT[k]?CAT[k].col:"fleiri"})"></span>`:"").join("");
    return `<button class="bar${off?" off":""}" data-y="${r.y}" aria-label="${r.y}: ${desc}" title="${r.y}: ${desc}"><span class="val">${r.t}</span><span class="stack">${seg}</span></button>`}).join("");
  $("years").innerHTML=YEARS.map(y=>`<span>${y}</span>`).join("");
  $("bars").querySelectorAll(".bar").forEach(b=>b.onclick=()=>pickYear(+b.dataset.y));
}
function renderActive(){
  const parts=[];
  if(S.author&&S.view==="skra")parts.push(`<button class="pill-x" data-clear="author" aria-label="Fjarlægja höfundasíu">Höfundur: ${esc(S.author)}</button>`);
  if(S.from!==2016||S.to!==2026)parts.push(`<button class="pill-x" data-clear="years">Ár: ${S.from===S.to?S.from:S.from+"–"+S.to}</button>`);
  if(S.type!=="all")parts.push(`<button class="pill-x" data-clear="type">${CAT[S.type].pl}</button>`);
  if(S.nG!==null&&S.view==="hofundar")parts.push(`<button class="pill-x" data-clear="nG">Höfundar með ${S.nG?cnt(S.nG,metricCat()):metricCat().none.toLowerCase()}</button>`);
  if(S.q.trim())parts.push(`<button class="pill-x" data-clear="q">Leit: „${esc(S.q.trim())}“</button>`);
  if(parts.length>1)parts.push(`<button class="linkbtn" data-clear="all">Hreinsa allt</button>`);
  $("active").innerHTML=parts.join("");
  $("active").querySelectorAll("[data-clear]").forEach(b=>b.onclick=()=>{const c=b.dataset.clear;
    if(c==="author"||c==="all")S.author=null;if(c==="years"||c==="all"){S.from=2016;S.to=2026}
    if(c==="type"||c==="all")S.type="all";if(c==="nG"||c==="all")S.nG=null;if(c==="q"||c==="all"){S.q="";$("q").value=""}render()});
}
function summary(list){return CATS.map(c=>[c,list.filter(e=>e.c.includes(c.k)).length]).filter(x=>x[1]).map(([c,n])=>cnt(n,c)).join(" · ")}
function renderEntries(){
  let list=DATA.filter(e=>typeOk(e)&&yearOk(e)&&authOk(e)&&qOk(e));
  const [k,d]=S.sortS.split("-");const dir=d==="desc"?-1:1;
  const tk=s=>s.replace(/^[„“"]/,"");
  list.sort((a,b)=>k==="yr"?dir*(a.y-b.y)||a.n-b.n:k==="nr"?dir*(a.n-b.n):dir*coll.compare(tk(a.titill),tk(b.titill)));
  $("result").textContent=`${cnt(list.length,ALLS)}${list.length?" · "+summary(list):""}`;
  if(!list.length){$("view").innerHTML=`<p class="empty">Engin færsla passar við þessa leit. Prófaðu að víkka árabilið eða hreinsa síur.</p>`;return}
  const shown=list.slice(0,S.limit);
  $("view").innerHTML=`<ol class="entries">${shown.map(e=>`<li class="entry"><div class="yr">${e.y}</div><div class="main">
    <div class="ttl">${hl(e.titill)}</div>
    ${e.bok?`<div class="sub">Um bókina <i>${hl(e.bok.titill)}</i> eftir ${hl(e.bok.hofundur)}${e.bok.ar?` (${e.bok.ar})`:""}</div>`:""}
    ${e.v.length?`<div class="sub">Viðmælandi: ${e.v.map(hl).join(", ")}</div>`:""}
    <div class="meta">${e.c.map(c=>`<span class="type ${c}">${CAT[c].l}</span>`).join("")}${e.a.length?e.a.map(a=>`<button class="au" data-a="${esc(a)}">${hl(a)}</button>`).join(", "):`<em>Höfundur ekki tilgreindur</em>`}<span class="nr">nr. ${e.n}</span></div>
  </div></li>`).join("")}</ol>${list.length>S.limit?`<button class="more" id="more">Sýna fleiri (${list.length-S.limit} eftir)</button>`:""}`;
  $("view").querySelectorAll(".au").forEach(b=>b.onclick=()=>pickAuthor(b.dataset.a));
  const m=$("more");if(m)m.onclick=()=>{S.limit+=200;render()};
}
const metricCat=()=>S.metric==="t"?ALLS:CAT[S.metric];
function renderAuthors(){
  const ents=DATA.filter(e=>typeOk(e)&&yearOk(e));const map=new Map();
  ents.forEach(e=>e.a.forEach(a=>{let r=map.get(a);if(!r){r={a,t:0,yrs:{}};CATS.forEach(c=>r[c.k]=0);map.set(a,r)}
    r.t++;e.c.forEach(c=>r[c]++);(r.yrs[e.y]??={n:0,c:{}});r.yrs[e.y].n++;r.yrs[e.y].c[stackKey(e)]=(r.yrs[e.y].c[stackKey(e)]||0)+1}));
  const q=fold(S.q.trim());const M=S.metric;const mc=metricCat();
  const all=[...map.values()].filter(r=>!q||fold(r.a).includes(q));
  const dist=new Map();all.forEach(r=>dist.set(r[M],(dist.get(r[M])||0)+1));
  if(S.nG!==null&&!dist.has(S.nG))S.nG=null;
  let rows=all.filter(r=>S.nG===null||r[M]===S.nG);
  const key=S.sortA,dir=S.dirA;
  rows.sort((x,y)=>key==="a"?dir*coll.compare(x.a,y.a):dir*(x[key]-y[key])||y.t-x.t||coll.compare(x.a,y.a));
  $("result").textContent=`${rows.length} ${hf(rows.length)}${S.from!==2016||S.to!==2026||S.type!=="all"?" með færslur innan síunnar":""}`;
  const shownCats=CATS.filter(c=>ents.some(e=>e.c.includes(c.k)));
  const ks=[...dist.keys()].sort((a,b)=>b-a),dmx=Math.max(1,...dist.values());
  const distHtml=`<section class="dist" aria-label="Höfundar eftir fjölda"><div class="dist-head"><h2><label for="metric">Höfundar eftir fjölda</label> <select id="metric">${
      [...shownCats,ALLS].map(c=>`<option value="${c.k}"${c.k===M?" selected":""}>${c.gen}</option>`).join("")}</select></h2><span>Smelltu á línu til að sjá aðeins þá höfunda</span></div><div class="dist-rows">${
    ks.map(k=>`<button class="drow" data-k="${k}" aria-pressed="${S.nG===k}"><span class="dk">${k?cnt(k,mc):mc.none}</span><span class="dbar"><span style="width:${dist.get(k)/dmx*100}%"></span></span><span class="dn">${dist.get(k)} ${hf(dist.get(k))}</span></button>`).join("")}</div></section>`;
  if(!rows.length){$("view").innerHTML=distHtml+`<p class="empty">Enginn höfundur passar við þessa leit.</p>`;bindAuthors();return}
  const mx=Math.max(1,...rows.flatMap(r=>Object.values(r.yrs).map(v=>v.n)));
  const th=(k,l,n)=>`<th${n?' class="n"':""} aria-sort="${S.sortA===k?(S.dirA>0?"ascending":"descending"):"none"}"><button data-k="${k}"${S.sortA===k?` data-dir="${S.dirA>0?"↑":"↓"}"`:""}>${l}</button></th>`;
  const cell=v=>`<td class="n${v?"":" zero"}">${v}</td>`;
  const ncol=shownCats.length+3;
  $("view").innerHTML=distHtml+`<div class="tablewrap"><table><thead><tr>${th("a","Höfundur")}${shownCats.map(c=>th(c.k,c.pl,1)).join("")}${th("t","Alls",1)}<th>2016–2026</th></tr></thead><tbody>${
    rows.map((r,i)=>`${S.sortA===M&&(i===0||rows[i-1][M]!==r[M])?`<tr class="grp"><th colspan="${ncol}">${r[M]?cnt(r[M],mc):mc.none} · ${dist.get(r[M])} ${hf(dist.get(r[M]))}</th></tr>`:""}<tr><td><button class="au" data-a="${esc(r.a)}">${hl(r.a)}</button></td>${shownCats.map(c=>cell(r[c.k])).join("")}<td class="n"><b>${r.t}</b></td><td><div class="spark" title="${esc(Object.entries(r.yrs).map(([y,v])=>y+": "+v.n).join(", "))}">${
      YEARS.map(y=>{const v=r.yrs[y];if(!v)return'<span class="e"></span>';const top=Object.entries(v.c).sort((a,b)=>b[1]-a[1])[0][0];
        return`<span style="height:${Math.max(3,v.n/mx*22)}px;background:var(--${CAT[top]?CAT[top].col:"fleiri"})"></span>`}).join("")}</div></td></tr>`).join("")
  }</tbody></table></div><p class="tnote">Færsla sem er í fleiri en einum flokki telst í hverjum þeirra en aðeins einu sinni í Alls. Þeir sem tóku viðtal teljast höfundar þess, viðmælendur ekki.</p>`;
  bindAuthors();
}
function bindAuthors(){
  $("view").querySelectorAll("th button").forEach(b=>b.onclick=()=>{const k=b.dataset.k;if(S.sortA===k)S.dirA*=-1;else{S.sortA=k;S.dirA=k==="a"?1:-1}render()});
  $("view").querySelectorAll(".au").forEach(b=>b.onclick=()=>pickAuthor(b.dataset.a));
  $("view").querySelectorAll(".drow").forEach(b=>b.onclick=()=>{const k=+b.dataset.k;S.nG=S.nG===k?null:k;render()});
  const m=$("metric");if(m)m.onchange=e=>{S.metric=e.target.value;S.sortA=S.metric;S.dirA=-1;S.nG=null;render()};
}
function render(){
  document.querySelectorAll(".tab").forEach(b=>b.setAttribute("aria-selected",b.dataset.view===S.view));
  document.querySelectorAll("#typechips .chip").forEach(b=>b.setAttribute("aria-pressed",b.dataset.type===S.type));
  $("yfrom").value=S.from;$("yto").value=S.to;
  $("q").placeholder=S.view==="skra"?"Leita að titli, höfundi, viðmælanda eða bók…":"Leita að höfundi…";
  const opts=S.view==="skra"?[["yr-desc","Nýjast fyrst"],["yr-asc","Elst fyrst"],["ttl-asc","Titill A–Ö"],["nr-asc","Númer í skrá"]]
    :[...CATS.map(c=>[c.k+":-1",c.most]),["t:-1",ALLS.most],["a:1","Nafn A–Ö"]];
  $("sort").innerHTML=opts.map(([v,l])=>`<option value="${v}">${l}</option>`).join("");
  const cur=S.view==="skra"?S.sortS:`${S.sortA}:${S.dirA}`;
  if(opts.some(o=>o[0]===cur))$("sort").value=cur;else{$("sort").insertAdjacentHTML("beforeend",`<option value="${cur}">Sérröðun</option>`);$("sort").value=cur}
  renderChart();renderActive();
  S.view==="skra"?renderEntries():renderAuthors();
}
render();
