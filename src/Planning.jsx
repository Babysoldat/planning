import React, { useState, useEffect, useCallback } from "react";
import { loadPlanning, savePlanning } from "./supabase.js";

const CC={serie:"#ff0050",live:"#cc2d4a",telegram:"#2a9fd6",business:"#7c6bbd",hyppest:"#1db954",sport:"#f5c242",priere:"#2e9e7a",pause:"#5a7a8c",libre:"#444",prep:"#4a90c4",formation:"#e05a33",vip:"#e8783a",manychat:"#0084ff",educative:"#2DD4BF",mindset:"#AFA9EC"};
const CL={serie:"Série YT",live:"Live",telegram:"Telegram",business:"Business",hyppest:"Hyppest",sport:"Sport",priere:"Prière/Perso",pause:"Pause/Repas",libre:"Libre",prep:"Préparation",formation:"Formation",vip:"VIP",manychat:"ManyChat",educative:"Éducative",mindset:"Mindset/Vlog"};

const DW={
Lundi:[
{t:"11:00",cat:"priere",note:"Réveil + routine"},{t:"12:00",cat:"pause",note:"Déjeuner"},
{t:"13:00",cat:"serie",note:"🎥 Segment 1 — Intro semaine + CTA ebook"},
{t:"13:30",cat:"serie",note:"🎥 Segment 2 — Analyse marchés"},
{t:"14:00",cat:"serie",note:"🎥 Segment 3 — Mindset"},
{t:"15:00",cat:"formation",note:"🎓 Tournage formation (1/3)"},
{t:"16:00",cat:"formation",note:"🎓 Tournage formation (2/3)"},
{t:"17:00",cat:"formation",note:"🎓 Tournage formation (3/3) + ⚠️ PUBLIER EBOOK MANYCHAT"},
{t:"18:00",cat:"manychat",note:"📢 Broadcast ManyChat — conversion VIP"},
{t:"19:00",cat:"libre",note:""},{t:"20:00",cat:"telegram",note:"📨 Envoi plans VIP + Dîner"},
{t:"21:00",cat:"libre",note:""},{t:"22:00",cat:"libre",note:""},
{t:"23:00",cat:"libre",note:"Décompression"},{t:"00:00",cat:"priere",note:"Coucher"},
],
Mardi:[
{t:"11:00",cat:"priere",note:"Réveil + routine"},{t:"12:00",cat:"educative",note:"🎬 Tournage 2 vidéos éducatives (batch 1/2)"},
{t:"13:00",cat:"educative",note:"🎬 Tournage éducatives (batch 2/2) + envoi rushs"},
{t:"14:00",cat:"pause",note:"Déjeuner"},
{t:"15:00",cat:"serie",note:"🎥 Segment 4 — Prépa session trading avant le live"},
{t:"16:00",cat:"telegram",note:"🎙️ Audios canal public + bulles promo live (1h)"},
{t:"17:00",cat:"hyppest",note:"📞 Point mi-semaine Hyppest"},
{t:"18:00",cat:"sport",note:"🏋️ Salle de muscu"},
{t:"19:00",cat:"libre",note:""},{t:"20:00",cat:"telegram",note:"📨 Envoi plans VIP + Dîner"},
{t:"21:30",cat:"live",note:"🔴 LIVE TikTok + YouTube (session US)"},
{t:"22:30",cat:"live",note:"🔴 LIVE — suite"},{t:"23:30",cat:"live",note:"🔴 LIVE — fin"},
{t:"00:00",cat:"priere",note:"Coucher"},
],
Mercredi:[
{t:"11:00",cat:"priere",note:"Réveil + routine"},{t:"12:00",cat:"pause",note:"Déjeuner"},
{t:"13:00",cat:"serie",note:"🎥 Segment 5 — Sortie KL + vlog lifestyle"},
{t:"14:00",cat:"serie",note:"🎥 Segment 5 — Vlog suite"},
{t:"15:00",cat:"libre",note:""},{t:"16:00",cat:"libre",note:""},
{t:"17:00",cat:"sport",note:"🏋️ Salle de muscu"},
{t:"18:00",cat:"libre",note:""},{t:"19:00",cat:"libre",note:""},
{t:"20:00",cat:"telegram",note:"📨 Envoi plans VIP + Dîner"},
{t:"20:30",cat:"manychat",note:"📢 Broadcast ManyChat — conversion VIP"},
{t:"21:30",cat:"live",note:"🔴 LIVE TikTok + YouTube (session US)"},
{t:"22:30",cat:"live",note:"🔴 LIVE — suite"},{t:"23:30",cat:"live",note:"🔴 LIVE — fin"},
{t:"00:00",cat:"priere",note:"Coucher"},
],
Jeudi:[
{t:"11:00",cat:"priere",note:"Réveil + routine"},{t:"12:00",cat:"pause",note:"Déjeuner"},
{t:"13:00",cat:"vip",note:"🎬 Tournage vidéo éducative VIP (1h)"},
{t:"14:00",cat:"mindset",note:"🎬 Tournage vidéo business/mindset de la semaine"},
{t:"15:00",cat:"serie",note:"🎥 Segment 6 — Trade breakdown"},
{t:"16:00",cat:"telegram",note:"🎙️ Audios canal public + bulles promo live (1h)"},
{t:"17:00",cat:"libre",note:""},{t:"18:00",cat:"sport",note:"🏋️ Salle de muscu"},
{t:"19:00",cat:"libre",note:""},{t:"20:00",cat:"telegram",note:"📨 Envoi plans VIP + Dîner"},
{t:"21:30",cat:"live",note:"🔴 LIVE TikTok + YouTube (session US)"},
{t:"22:30",cat:"live",note:"🔴 LIVE — suite"},{t:"23:30",cat:"live",note:"🔴 LIVE — fin"},
{t:"00:00",cat:"priere",note:"Coucher"},
],
Vendredi:[
{t:"11:00",cat:"priere",note:"Réveil + routine"},{t:"12:00",cat:"priere",note:"🕌 Jumu'ah"},
{t:"13:00",cat:"pause",note:"Déjeuner"},
{t:"14:00",cat:"serie",note:"🎥 Segment 7 — Bilan semaine + CTA final"},
{t:"15:00",cat:"business",note:"📊 Bilan semaine — chiffres, objectifs"},
{t:"15:30",cat:"manychat",note:"📢 Broadcast ManyChat — conversion VIP"},
{t:"16:00",cat:"libre",note:"Repos"},{t:"17:00",cat:"libre",note:"Repos"},
{t:"18:00",cat:"serie",note:"🎥 Sortie KL lifestyle — bilan épisode"},
{t:"19:00",cat:"serie",note:"🎥 Sortie KL — suite"},
{t:"20:00",cat:"pause",note:"Dîner"},
{t:"21:00",cat:"libre",note:"Soirée libre"},{t:"22:00",cat:"libre",note:"Soirée libre"},
{t:"23:00",cat:"libre",note:"Détente"},{t:"00:00",cat:"priere",note:"Coucher"},
],
Samedi:[
{t:"11:00",cat:"priere",note:"Réveil + routine"},{t:"12:00",cat:"pause",note:"Déjeuner"},
{t:"13:00",cat:"hyppest",note:"⚡ Tournage contenu Hyppest — batch"},
{t:"14:00",cat:"hyppest",note:"⚡ Tournage Hyppest — suite"},
{t:"15:00",cat:"hyppest",note:"⚡ Upload tout contenu Hyppest"},
{t:"16:00",cat:"libre",note:""},
{t:"17:00",cat:"business",note:"📞 Point avec maman — projet (2h)"},
{t:"18:00",cat:"business",note:"📞 Point maman — suite"},
{t:"19:00",cat:"libre",note:""},{t:"20:00",cat:"pause",note:"Dîner"},
{t:"21:00",cat:"libre",note:"Soirée libre"},{t:"22:00",cat:"libre",note:"Soirée libre"},
{t:"23:00",cat:"libre",note:"Détente"},{t:"00:00",cat:"priere",note:"Coucher"},
],
Dimanche:[
{t:"11:00",cat:"priere",note:"Réveil + routine"},{t:"12:00",cat:"pause",note:"Déjeuner"},
{t:"13:00",cat:"prep",note:"📝 Préparation ebook semaine"},
{t:"14:00",cat:"prep",note:"📝 Préparation calendrier Telegram"},
{t:"15:00",cat:"business",note:"💼 Admin — factures, compta LLC"},
{t:"16:00",cat:"libre",note:""},{t:"17:00",cat:"libre",note:""},{t:"18:00",cat:"libre",note:""},
{t:"19:00",cat:"pause",note:"Dîner"},
{t:"20:00",cat:"prep",note:"📝 Prépa live — notes"},
{t:"21:00",cat:"libre",note:""},{t:"22:00",cat:"libre",note:""},
{t:"23:00",cat:"live",note:"🔴 LIVE analyse de la semaine"},
{t:"00:00",cat:"live",note:"🔴 LIVE — suite"},{t:"01:00",cat:"priere",note:"Coucher"},
],
};
const DAYS=Object.keys(DW);

const ED=[
{w:"27/04→03/05",items:[{id:"V03",d:"Mer",tp:"Storytelling",t:"Comment Jesse Livermore est passé de 5$ à 100M$ (puis a tout perdu)",s:"Script prêt",f:"→ Telegram"},{id:"F01",d:"Ven",tp:"Mindset",t:"À définir",s:"À définir",f:""},{id:"EP01",d:"Dim",tp:"Série",t:"Vivre de son trading en Malaisie",s:"À tourner",f:""}]},
{w:"04/05→10/05",items:[{id:"V04",d:"Mer",tp:"Éducative",t:"Ma routine complète de trader (tout ce que je fais AVANT de trader)",s:"Script prêt",f:"→ V01+Telegram"},{id:"F02",d:"Ven",tp:"Vlog",t:"72h pour convaincre mon pote trader de quitter Dubaï",s:"Tourné",f:""},{id:"EP02",d:"Dim",tp:"Série",t:"Série Malaisie",s:"À tourner",f:""}]},
{w:"11/05→17/05",items:[{id:"V05",d:"Mer",tp:"Investissement",t:"La composition de mon portefeuille boursier (je montre tout)",s:"À écrire",f:"→ Commentaires"},{id:"F03",d:"Ven",tp:"Mindset",t:"À définir",s:"À définir",f:""},{id:"EP03",d:"Dim",tp:"Série",t:"Série Malaisie",s:"À tourner",f:""}]},
{w:"18/05→24/05",items:[{id:"V06",d:"Mer",tp:"Technique",t:"Comment utiliser Fibonacci en trading (méthode complète)",s:"À tourner",f:"→ V01+Telegram"},{id:"F04",d:"Ven",tp:"Vlog",t:"Podcast BabySoldat x Adnane",s:"Tourné",f:""},{id:"EP04",d:"Dim",tp:"Série",t:"Série Malaisie",s:"À tourner",f:""}]},
{w:"25/05→31/05",items:[{id:"V07",d:"Mer",tp:"Storytelling",t:"Il a fait couler une banque de 233 ans à lui tout seul (Nick Leeson)",s:"À écrire",f:"→ V03 Livermore"},{id:"F05",d:"Ven",tp:"Mindset",t:"À définir",s:"À définir",f:""},{id:"EP05",d:"Dim",tp:"Série",t:"Série Malaisie",s:"À tourner",f:""}]},
{w:"01/06→07/06",items:[{id:"V08",d:"Mer",tp:"Éducative",t:"CFD ou Futures ? Quelle est la vraie différence",s:"À écrire",f:"→ Telegram"},{id:"F06",d:"Ven",tp:"Vlog",t:"À définir",s:"À définir",f:""},{id:"EP06",d:"Dim",tp:"Série",t:"Série Malaisie",s:"À tourner",f:""}]},
{w:"08/06→14/06",items:[{id:"V09",d:"Mer",tp:"Investissement",t:"Un ETF c'est quoi ? Le guide pour investir sans se prendre la tête",s:"À écrire",f:"→ Telegram"},{id:"F07",d:"Ven",tp:"Mindset",t:"À définir",s:"À définir",f:""},{id:"EP07",d:"Dim",tp:"Série",t:"Série Malaisie",s:"À tourner",f:""}]},
{w:"15/06→21/06",items:[{id:"V10",d:"Mer",tp:"Technique",t:"Le Volume Profile expliqué (comment je trouve mes zones de prix)",s:"À écrire",f:"→ V04 Routine"},{id:"F08",d:"Ven",tp:"Vlog",t:"À définir",s:"À définir",f:""},{id:"EP08",d:"Dim",tp:"Série",t:"Série Malaisie",s:"À tourner",f:""}]},
{w:"22/06→28/06",items:[{id:"V11",d:"Mer",tp:"Storytelling",t:"L'homme qui a fait plier la Banque d'Angleterre (George Soros)",s:"À écrire",f:"→ V03+V07"},{id:"F09",d:"Ven",tp:"Mindset",t:"À définir",s:"À définir",f:""},{id:"EP09",d:"Dim",tp:"Série",t:"Série Malaisie",s:"À tourner",f:""}]},
{w:"29/06→05/07",items:[{id:"V12",d:"Mer",tp:"Éducative",t:"Gère ton risque de cette manière et tu seras rentable",s:"À écrire",f:"→ Telegram"},{id:"F10",d:"Ven",tp:"Vlog",t:"À définir",s:"À définir",f:""},{id:"EP10",d:"Dim",tp:"Série",t:"Série Malaisie",s:"À tourner",f:""}]},
{w:"06/07→12/07",items:[{id:"V13",d:"Mer",tp:"Investissement",t:"Comprendre la blockchain et le Bitcoin en 15 minutes",s:"À écrire",f:"→ Telegram"},{id:"F11",d:"Ven",tp:"Mindset",t:"À définir",s:"À définir",f:""},{id:"EP11",d:"Dim",tp:"Série",t:"Série Malaisie",s:"À tourner",f:""}]},
{w:"13/07→19/07",items:[{id:"V14",d:"Mer",tp:"Technique",t:"Je prends un trade en direct et j'explique chaque décision",s:"Script prêt",f:"→ Telegram live"},{id:"F12",d:"Ven",tp:"Vlog",t:"À définir",s:"À définir",f:""},{id:"EP12",d:"Dim",tp:"Série",t:"Série Malaisie",s:"À tourner",f:""}]},
{w:"20/07→26/07",items:[{id:"V15",d:"Mer",tp:"Storytelling",t:"Paul Tudor Jones : le trader qui a prédit le crash de 87",s:"À écrire",f:"→ V03+V07+V11"},{id:"F13",d:"Ven",tp:"Mindset",t:"À définir",s:"À définir",f:""},{id:"EP13",d:"Dim",tp:"Série",t:"Série Malaisie",s:"À tourner",f:""}]},
{w:"27/07→02/08",items:[{id:"V16",d:"Mer",tp:"Éducative",t:"Les outils concrets pour gérer sa psychologie en trading",s:"À écrire",f:"→ Telegram"},{id:"F14",d:"Ven",tp:"Vlog",t:"À définir",s:"À définir",f:""},{id:"EP14",d:"Dim",tp:"Série",t:"Série Malaisie",s:"À tourner",f:""}]},
{w:"03/08→09/08",items:[{id:"V17",d:"Mer",tp:"Technique",t:"Le carnet d'ordres expliqué (Order Flow pour débutants)",s:"À écrire",f:"→ Telegram"},{id:"F15",d:"Ven",tp:"Mindset",t:"À définir",s:"À définir",f:""},{id:"EP15",d:"Dim",tp:"Série",t:"Série Malaisie",s:"À tourner",f:""}]},
{w:"10/08→16/08",items:[{id:"V18",d:"Mer",tp:"Storytelling",t:"Stanley Druckenmiller : le plus grand trader que personne ne connaît",s:"À écrire",f:"→ V03+V07+V11+V15"},{id:"F16",d:"Ven",tp:"Vlog",t:"À définir",s:"À définir",f:""},{id:"EP16",d:"Dim",tp:"Série",t:"Série Malaisie",s:"À tourner",f:""}]},
{w:"17/08→23/08",items:[{id:"V19",d:"Mer",tp:"Éducative",t:"Smart Money Concepts : la vérité (arnaque ou méthode ?)",s:"À écrire",f:"→ Telegram"},{id:"F17",d:"Ven",tp:"Mindset",t:"À définir",s:"À définir",f:""},{id:"EP17",d:"Dim",tp:"Série",t:"Série Malaisie",s:"À tourner",f:""}]},
{w:"24/08→30/08",items:[{id:"V20",d:"Mer",tp:"Investissement",t:"Actions vs Crypto vs Forex : où mettre son argent en 2026 ?",s:"À écrire",f:"→ Telegram"},{id:"F18",d:"Ven",tp:"Vlog",t:"À définir",s:"À définir",f:""},{id:"EP18",d:"Dim",tp:"Série",t:"Série Malaisie",s:"À tourner",f:""}]},
];

const DT={daily:["Tourner + poster 5 shorts (IG/TikTok/YT)","Envoi rushs au monteur"],weekday:["Plans VIP Telegram à 20h"],weekly:["Écrire script vidéo mercredi","Définir sujet vidéo vendredi","Prépa ebook + calendrier Telegram","Admin — factures, compta LLC"]};

function db(fn,ms){let t;return(...a)=>{clearTimeout(t);t=setTimeout(()=>fn(...a),ms)}}
const sc=(s)=>s.includes("Publié")||s.includes("Tourné")?{b:"#0D3331",c:"#2DD4BF"}:s.includes("Script")?{b:"#3D2E0A",c:"#EF9F27"}:s.includes("tourner")?{b:"#3D1111",c:"#E24B4A"}:s.includes("écrire")?{b:"#1C2128",c:"#7D8590"}:{b:"#1C2128",c:"#7D8590"};
const tc=(t)=>t==="Storytelling"?"#e05a33":t==="Éducative"?"#2DD4BF":t==="Investissement"?"#378ADD":t==="Technique"?"#EF9F27":t==="Mindset"||t==="Vlog"?"#AFA9EC":t==="Série"?"#ff0050":"#7D8590";

export default function App(){
  const[week,setWeek]=useState(DW);const[checked,setChecked]=useState({});
  const[tasks,setTasks]=useState(DT);const[taskChecks,setTaskChecks]=useState({});
  const[stats,setStats]=useState([]);const[view,setView]=useState("home");
  const ti=new Date().getDay();const[selDay,setSelDay]=useState(DAYS[ti===0?6:ti-1]);
  const[editing,setEditing]=useState(null);const[editNote,setEditNote]=useState("");const[editCat,setEditCat]=useState("");
  const[newTask,setNewTask]=useState("");const[menu,setMenu]=useState(false);
  const[planView,setPlanView]=useState("day");const[contView,setContView]=useState("detail");const[contFilter,setContFilter]=useState("Tout");
  const[statForm,setStatForm]=useState({tiktok:"",ig:"",yt:"",affil:"",vip_count:"",vip_rev:""});
  const[loaded,setLoaded]=useState(false);const[synced,setSynced]=useState(true);

  const save=useCallback(db(async(k,v)=>{setSynced(false);await savePlanning(k,v);setSynced(true)},800),[]);
  useEffect(()=>{(async()=>{
    try{const w=await loadPlanning("week");if(w)setWeek(w)}catch{}
    try{const c=await loadPlanning("checks");if(c)setChecked(c)}catch{}
    try{const t=await loadPlanning("tasks");if(t)setTasks(t)}catch{}
    try{const tc2=await loadPlanning("taskChecks");if(tc2)setTaskChecks(tc2)}catch{}
    try{const s=await loadPlanning("stats");if(s)setStats(s)}catch{}
    setLoaded(true)})()},[]);

  const uw=(w)=>{setWeek(w);save("week",w)};const uc=(c)=>{setChecked(c);save("checks",c)};
  const ut=(t)=>{setTasks(t);save("tasks",t)};const utc=(c)=>{setTaskChecks(c);save("taskChecks",c)};
  const us=(s)=>{setStats(s);save("stats",s)};

  const toggle=(d,i)=>{uc({...checked,[`${d}-${i}`]:!checked[`${d}-${i}`]})};
  const toggleTask=(k)=>{utc({...taskChecks,[k]:!taskChecks[k]})};
  const startEdit=(d,i)=>{setEditing({day:d,idx:i});setEditNote(week[d][i].note);setEditCat(week[d][i].cat)};
  const saveEdit=()=>{if(!editing)return;const w={...week};w[editing.day]=[...w[editing.day]];w[editing.day][editing.idx]={...w[editing.day][editing.idx],note:editNote,cat:editCat};uw(w);setEditing(null)};
  const addTask=()=>{if(!newTask.trim())return;ut({...tasks,weekly:[...tasks.weekly,newTask.trim()]});setNewTask("")};
  const removeTask=(i)=>{ut({...tasks,weekly:tasks.weekly.filter((_,j)=>j!==i)})};
  const submitStats=()=>{const e={date:new Date().toISOString().slice(0,10),tiktok:+statForm.tiktok||0,ig:+statForm.ig||0,yt:+statForm.yt||0,affil:+statForm.affil||0,vip_count:+statForm.vip_count||0,vip_rev:+statForm.vip_rev||0,execution:weekPct};us([...stats,e]);setStatForm({tiktok:"",ig:"",yt:"",affil:"",vip_count:"",vip_rev:""})};
  const resetAll=()=>{if(confirm("Reset tout ?")){uw(DW);uc({});ut(DT);utc({})}};
  const uncheckDay=(d)=>{const c={...checked};week[d].forEach((_,i)=>delete c[`${d}-${i}`]);uc(c)};

  const ne=(d,i)=>!!week[d][i].note;
  const dD=(d)=>week[d].filter((_,i)=>checked[`${d}-${i}`]&&ne(d,i)).length;
  const dT=(d)=>week[d].filter((_,i)=>ne(d,i)).length;
  const dP=(d)=>dT(d)?Math.round(dD(d)/dT(d)*100):0;
  const tDn=DAYS.reduce((a,d)=>a+dD(d),0);const tTl=DAYS.reduce((a,d)=>a+dT(d),0);
  const weekPct=tTl?Math.round(tDn/tTl*100):0;
  const pc=(p)=>p>=90?"#2DD4BF":p>=50?"#f5c242":p>0?"#e8783a":"#21262D";
  const nextTask=(week[selDay]||[]).find((_,i)=>!checked[`${selDay}-${i}`]&&ne(selDay,i));
  const lastStat=stats[stats.length-1];

  const nav=(v)=>{setView(v);setMenu(false)};

  if(!loaded)return<div style={{background:"#0E1117",color:"#7D8590",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"system-ui"}}>Chargement...</div>;

  const pill=(bg,c,text)=><span style={{fontSize:9,padding:"2px 7px",borderRadius:4,background:bg,color:c}}>{text}</span>;
  const chk=(done,onClick)=><div onClick={onClick} style={{width:18,height:18,borderRadius:4,flexShrink:0,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,...(done?{background:"#2DD4BF",color:"#0E1117"}:{border:"2px solid #21262D"})}}>{done?"✓":""}</div>;
  const card=(ch)=><div style={{background:"#161B22",borderRadius:10,padding:"14px 16px",marginBottom:10,border:"0.5px solid #21262D"}}>{ch}</div>;
  const sect=(t)=><p style={{fontSize:11,color:"#2DD4BF",textTransform:"uppercase",letterSpacing:"1px",marginBottom:10,fontWeight:500}}>{t}</p>;
  const inp=(v,onChange,ph,extra)=><input value={v} onChange={onChange} placeholder={ph} style={{background:"#0E1117",border:"1px solid #21262D",color:"#E6EDF3",padding:"6px 10px",borderRadius:6,fontSize:13,fontFamily:"inherit",width:"100%",...extra}}/>;

  return(
<div style={{fontFamily:"system-ui,-apple-system,sans-serif",background:"#0E1117",color:"#E6EDF3",minHeight:"100vh"}}>

{/* HAMBURGER BUTTON */}
<div style={{position:"fixed",top:12,left:12,zIndex:30,cursor:"pointer",padding:8}} onClick={()=>setMenu(!menu)}>
<div style={{width:22,height:2,background:"#E6EDF3",marginBottom:5,borderRadius:1}}/>
<div style={{width:22,height:2,background:"#E6EDF3",marginBottom:5,borderRadius:1}}/>
<div style={{width:16,height:2,background:"#2DD4BF",borderRadius:1}}/>
</div>

{/* SYNC INDICATOR */}
<div style={{position:"fixed",top:18,right:16,zIndex:30,width:8,height:8,borderRadius:"50%",background:synced?"#2DD4BF":"#f5c242"}}/>

{/* SIDEBAR */}
{menu&&<div style={{position:"fixed",inset:0,zIndex:20,display:"flex"}}>
<div style={{width:260,background:"#161B22",borderRight:"0.5px solid #21262D",padding:"60px 20px 20px",display:"flex",flexDirection:"column",gap:4}}>
{[["home","🏠","Home"],["plan","📋","Planning"],["cont","📅","Contenu"],["task","✅","Tâches"],["stat","📊","Stats"]].map(([k,ic,lb])=>(
<div key={k} onClick={()=>nav(k)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:8,background:view===k?"#1C2128":"transparent",cursor:"pointer"}}>
<span style={{fontSize:18}}>{ic}</span>
<span style={{fontSize:14,color:view===k?"#2DD4BF":"#E6EDF3",fontWeight:view===k?500:400}}>{lb}</span>
</div>))}
<div style={{marginTop:"auto",borderTop:"0.5px solid #21262D",paddingTop:12}}>
<div onClick={resetAll} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:8,cursor:"pointer"}}>
<span style={{fontSize:14,color:"#E24B4A"}}>Reset planning</span>
</div></div>
</div>
<div style={{flex:1,background:"rgba(0,0,0,0.5)"}} onClick={()=>setMenu(false)}/>
</div>}

<div style={{maxWidth:900,margin:"0 auto",padding:"50px 16px 30px"}}>

{/* ═══ HOME ═══ */}
{view==="home"&&<>
<p style={{fontSize:13,color:"#7D8590"}}>{new Date().toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"})}</p>
<h1 style={{fontSize:26,fontWeight:500,margin:"2px 0 16px"}}>Salam 👋</h1>

{card(<>
<div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:13,color:"#7D8590"}}>Progression semaine</span><span style={{fontSize:20,fontWeight:500,color:pc(weekPct)}}>{weekPct}%</span></div>
<div style={{height:5,background:"#134E4A",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${weekPct}%`,background:"#2DD4BF",borderRadius:3,transition:"width 0.3s"}}/></div>
<div style={{display:"flex",gap:3,marginTop:10}}>
{DAYS.map(d=>{const p=dP(d);return<div key={d} onClick={()=>{setSelDay(d);nav("plan")}} style={{flex:1,textAlign:"center",padding:"5px 0",borderRadius:5,background:p>=90?"#2DD4BF":p>0?"#134E4A":"#1C2128",color:p>=90?"#0E1117":p>0?"#2DD4BF":"#7D8590",fontSize:9,fontWeight:500,cursor:"pointer",border:d===selDay?"1.5px solid #2DD4BF":"1.5px solid transparent"}}>{d.slice(0,3)}<br/>{p>0?p+"%":"—"}</div>})}
</div></>)}

{nextTask&&card(<>{sect("Maintenant")}<div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:36,height:36,borderRadius:8,background:"#0D3331",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>📋</div><div style={{flex:1}}><p style={{fontSize:14,fontWeight:500}}>{nextTask.note}</p><p style={{fontSize:12,color:"#7D8590"}}>{nextTask.t}</p></div></div></>)}

{card(<>{sect("Contenus cette semaine")}{ED[0]?.items.map((it,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",background:"#1C2128",borderRadius:6,marginBottom:4,borderLeft:`3px solid ${tc(it.tp)}`}}><span style={{fontSize:12,flex:1}}>{it.id} — {it.t.length>35?it.t.slice(0,35)+"…":it.t}</span>{pill(sc(it.s).b,sc(it.s).c,it.s)}</div>)}</>)}
</>}

{/* ═══ PLANNING ═══ */}
{view==="plan"&&<>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
<h1 style={{fontSize:24,fontWeight:500}}>Planning</h1>
<div style={{display:"flex",gap:4}}>
<button onClick={()=>setPlanView("day")} style={{padding:"6px 14px",borderRadius:6,border:"none",background:planView==="day"?"#2DD4BF":"#1C2128",color:planView==="day"?"#0E1117":"#7D8590",fontWeight:500,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>Jour</button>
<button onClick={()=>setPlanView("week")} style={{padding:"6px 14px",borderRadius:6,border:"none",background:planView==="week"?"#2DD4BF":"#1C2128",color:planView==="week"?"#0E1117":"#7D8590",fontWeight:500,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>Semaine</button>
</div></div>

{planView==="day"&&<>
<div style={{display:"flex",gap:3,marginBottom:10}}>
{DAYS.map(d=><button key={d} onClick={()=>setSelDay(d)} style={{flex:1,padding:"7px 0",borderRadius:5,border:d===selDay?"2px solid #E6EDF3":"1px solid #21262D",background:d===selDay?"#1C2128":"transparent",color:d===selDay?"#E6EDF3":"#7D8590",fontWeight:700,fontSize:10,cursor:"pointer",fontFamily:"inherit"}}>{d.slice(0,3)}{dP(d)>0&&<><br/><span style={{color:pc(dP(d)),fontSize:9}}>{dP(d)}%</span></>}</button>)}
</div>
{card(<><div style={{display:"flex",justifyContent:"space-between",fontSize:11}}><span style={{color:"#7D8590"}}>{selDay} {dD(selDay)}/{dT(selDay)}</span><span style={{fontWeight:500,color:pc(dP(selDay))}}>{dP(selDay)}%</span></div><div style={{height:4,background:"#21262D",borderRadius:2,marginTop:4,overflow:"hidden"}}><div style={{height:"100%",width:`${dP(selDay)}%`,background:pc(dP(selDay)),transition:"width 0.3s"}}/></div></>)}
<div style={{display:"flex",justifyContent:"flex-end",marginBottom:6}}><button onClick={()=>uncheckDay(selDay)} style={{fontSize:10,color:"#7D8590",background:"transparent",border:"1px solid #21262D",borderRadius:4,padding:"3px 10px",cursor:"pointer",fontFamily:"inherit"}}>Décocher</button></div>
{week[selDay].map((sl,i)=>{const done=checked[`${selDay}-${i}`];const col=CC[sl.cat]||"#444";const isEd=editing?.day===selDay&&editing?.idx===i;const dead=sl.note.includes("⚠️");const empty=!sl.note;
return<div key={i} style={{display:"flex",alignItems:"flex-start",gap:6,padding:"7px 8px",marginBottom:2,borderRadius:6,borderLeft:`3px solid ${col}`,background:done?"#111216":"#161B22",opacity:done?0.4:empty?0.4:1}}>
<div style={{fontSize:11,fontWeight:700,color:"#555",width:42,flexShrink:0,paddingTop:2}}>{sl.t}</div>
{chk(done,()=>toggle(selDay,i))}
<div style={{flex:1,minWidth:0}}>
{isEd?<div style={{display:"flex",flexDirection:"column",gap:6}}>
{inp(editNote,e=>setEditNote(e.target.value),"Tâche...")}
<div style={{display:"flex",gap:3,flexWrap:"wrap"}}>{Object.entries(CL).slice(0,10).map(([k,l])=><button key={k} onClick={()=>setEditCat(k)} style={{padding:"2px 7px",borderRadius:3,fontSize:9,fontFamily:"inherit",cursor:"pointer",background:editCat===k?CC[k]:"transparent",border:`1px solid ${CC[k]}`,color:editCat===k?"#fff":CC[k]}}>{l}</button>)}</div>
<div style={{display:"flex",gap:4}}><button onClick={saveEdit} style={{padding:"6px 14px",borderRadius:6,background:"#2DD4BF",color:"#0E1117",border:"none",fontWeight:500,cursor:"pointer",fontFamily:"inherit"}}>OK</button><button onClick={()=>setEditing(null)} style={{padding:"6px 14px",borderRadius:6,background:"transparent",color:"#7D8590",border:"1px solid #21262D",cursor:"pointer",fontFamily:"inherit"}}>Annuler</button></div>
</div>:
<div onClick={()=>startEdit(selDay,i)} style={{cursor:"pointer",minHeight:20}}>
<div style={{fontSize:12,lineHeight:1.4,textDecoration:done?"line-through":"none",color:empty?"#444":dead?"#E24B4A":"#E6EDF3",fontWeight:dead?700:400,fontStyle:empty?"italic":"normal"}}>{empty?"Case libre — clique pour remplir":sl.note}</div>
{!empty&&<div style={{fontSize:9,color:col,marginTop:2,fontWeight:600}}>{CL[sl.cat]}</div>}
</div>}
</div></div>})}
</>}

{planView==="week"&&<div style={{overflowX:"auto"}}>
<div style={{display:"grid",gridTemplateColumns:"50px repeat(7,minmax(90px,1fr))",gap:1,minWidth:700,fontSize:10}}>
<div style={{background:"#0E1117"}}/>
{DAYS.map(d=><div key={d} onClick={()=>{setSelDay(d);setPlanView("day")}} style={{padding:6,background:"#161B22",fontWeight:700,textAlign:"center",color:"#E6EDF3",cursor:"pointer"}}>{d.slice(0,3)}<div style={{color:pc(dP(d)),fontSize:9,marginTop:2}}>{dP(d)}%</div></div>)}
{(()=>{const mx=Math.max(...DAYS.map(d=>week[d].length));return Array.from({length:mx}).map((_,r)=><React.Fragment key={r}>
<div style={{padding:"3px 4px",background:"#111216",color:"#555",fontWeight:700,fontSize:9,display:"flex",alignItems:"center",justifyContent:"center"}}>{week.Lundi[r]?.t||""}</div>
{DAYS.map(d=>{const s=week[d][r];if(!s)return<div key={d} style={{background:"#0E1117"}}/>;const dn=checked[`${d}-${r}`];return<div key={d} onClick={()=>toggle(d,r)} style={{padding:"3px 4px",borderLeft:`2px solid ${CC[s.cat]||"#444"}`,background:dn?"#0E1117":"#161B22",cursor:"pointer",opacity:dn?0.3:s.note?1:0.3,textDecoration:dn?"line-through":"none",color:s.note?"#ccc":"#333",lineHeight:1.3,minHeight:28,fontStyle:s.note?"normal":"italic"}}>{s.note?(s.note.length>25?s.note.slice(0,25)+"…":s.note):"—"}</div>})}
</React.Fragment>)})()}
</div></div>}
</>}

{/* ═══ CONTENU ═══ */}
{view==="cont"&&<>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
<h1 style={{fontSize:24,fontWeight:500}}>Calendrier éditorial</h1>
<div style={{display:"flex",gap:4}}>
<button onClick={()=>setContView("overview")} style={{padding:"6px 14px",borderRadius:6,border:"none",background:contView==="overview"?"#2DD4BF":"#1C2128",color:contView==="overview"?"#0E1117":"#7D8590",fontWeight:500,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>Vue d'ensemble</button>
<button onClick={()=>setContView("detail")} style={{padding:"6px 14px",borderRadius:6,border:"none",background:contView==="detail"?"#2DD4BF":"#1C2128",color:contView==="detail"?"#0E1117":"#7D8590",fontWeight:500,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>Détail</button>
</div></div>
<p style={{fontSize:12,color:"#7D8590",marginBottom:12}}>Avril → Septembre 2026 · {ED.length} semaines</p>

{contView==="overview"&&<div style={{overflowX:"auto"}}>
<div style={{display:"grid",gridTemplateColumns:"110px repeat(3,minmax(140px,1fr))",gap:1,minWidth:560,fontSize:10}}>
<div style={{padding:6,background:"#161B22",fontWeight:700,color:"#7D8590"}}>Semaine</div>
<div style={{padding:6,background:"#161B22",fontWeight:700,color:"#2DD4BF",textAlign:"center"}}>Mercredi</div>
<div style={{padding:6,background:"#161B22",fontWeight:700,color:"#AFA9EC",textAlign:"center"}}>Vendredi</div>
<div style={{padding:6,background:"#161B22",fontWeight:700,color:"#ff0050",textAlign:"center"}}>Dimanche</div>
{ED.map((wk,wi)=><React.Fragment key={wi}>
<div style={{padding:"6px 8px",background:"#111216",color:"#7D8590",fontWeight:500,fontSize:10,display:"flex",alignItems:"center"}}>{wk.w}</div>
{wk.items.map((it,i)=>{const scc=sc(it.s);return<div key={i} style={{padding:"5px 6px",background:"#161B22",borderLeft:`2px solid ${tc(it.tp)}`,lineHeight:1.3}}>
<div style={{color:"#E6EDF3",fontSize:10,marginBottom:2}}>{it.id}</div>
<div style={{color:"#7D8590",fontSize:9}}>{it.t.length>30?it.t.slice(0,30)+"…":it.t}</div>
<div style={{marginTop:3}}>{pill(scc.b,scc.c,it.s)}</div>
</div>})}
</React.Fragment>)}
</div></div>}

{contView==="detail"&&<>
<div style={{display:"flex",gap:4,marginBottom:14,flexWrap:"wrap"}}>
{["Tout","Éducative","Investissement","Technique","Storytelling","Mindset","Vlog","Série"].map(f=><button key={f} onClick={()=>setContFilter(f)} style={{padding:"5px 12px",borderRadius:5,border:"none",background:contFilter===f?"#2DD4BF":"#1C2128",color:contFilter===f?"#0E1117":"#7D8590",fontSize:11,fontWeight:500,cursor:"pointer",fontFamily:"inherit"}}>{f}</button>)}
</div>
{ED.map((wk,wi)=>{const filtered=contFilter==="Tout"?wk.items:wk.items.filter(it=>it.tp===contFilter);if(!filtered.length)return null;return card(<div key={wi}>{sect(wk.w)}{filtered.map((it,i)=>{const scc=sc(it.s);return<div key={i} style={{padding:10,background:"#1C2128",borderRadius:8,marginBottom:6,borderLeft:`3px solid ${tc(it.tp)}`}}>
<div style={{display:"flex",gap:6,marginBottom:4,flexWrap:"wrap"}}>{pill("#1C2128","#7D8590",it.d)}{pill(tc(it.tp)+"20",tc(it.tp),it.tp)}</div>
<p style={{fontSize:13,fontWeight:500,lineHeight:1.3}}>{it.id} — {it.t}</p>
<div style={{display:"flex",gap:6,marginTop:6,alignItems:"center"}}>{pill(scc.b,scc.c,it.s)}{it.f&&<span style={{fontSize:10,color:"#7D8590"}}>{it.f}</span>}</div>
</div>})}</div>)})}
</>}
</>}

{/* ═══ TÂCHES ═══ */}
{view==="task"&&<>
<h1 style={{fontSize:24,fontWeight:500,marginBottom:16}}>Tâches</h1>
{card(<>{sect("Récurrentes — tous les jours")}{tasks.daily.map((t,i)=>{const k=`daily-${i}`;const d=taskChecks[k];return<div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 0"}}>{chk(d,()=>toggleTask(k))}<span style={{fontSize:12,color:d?"#7D8590":"#E6EDF3",textDecoration:d?"line-through":"none"}}>{t}</span></div>})}</>)}
{card(<>{sect("Récurrentes — jours ouvrables")}{tasks.weekday.map((t,i)=>{const k=`weekday-${i}`;const d=taskChecks[k];return<div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 0"}}>{chk(d,()=>toggleTask(k))}<span style={{fontSize:12,color:d?"#7D8590":"#E6EDF3",textDecoration:d?"line-through":"none"}}>{t}</span></div>})}</>)}
{card(<>{sect("Cette semaine")}{tasks.weekly.map((t,i)=>{const k=`weekly-${i}`;const d=taskChecks[k];return<div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 0"}}>{chk(d,()=>toggleTask(k))}<span style={{fontSize:12,color:d?"#7D8590":"#E6EDF3",textDecoration:d?"line-through":"none",flex:1}}>{t}</span><button onClick={()=>removeTask(i)} style={{background:"transparent",border:"none",color:"#E24B4A",cursor:"pointer",fontSize:16,padding:4}}>×</button></div>})}
<div style={{display:"flex",gap:6,marginTop:10}}>{inp(newTask,e=>setNewTask(e.target.value),"Nouvelle tâche...",{flex:1})}<button onClick={addTask} style={{padding:"6px 14px",borderRadius:6,background:"#2DD4BF",color:"#0E1117",border:"none",fontWeight:700,cursor:"pointer",fontFamily:"inherit",fontSize:16}}>+</button></div></>)}
</>}

{/* ═══ STATS ═══ */}
{view==="stat"&&<>
<h1 style={{fontSize:24,fontWeight:500,marginBottom:16}}>Stats</h1>
{card(<>{sect("Exécution (auto)")}<div style={{display:"flex",gap:8}}><div style={{flex:1,background:"#1C2128",borderRadius:8,padding:10,textAlign:"center"}}><p style={{fontSize:10,color:"#7D8590"}}>Planning</p><p style={{fontSize:22,fontWeight:500,color:"#2DD4BF"}}>{weekPct}%</p></div><div style={{flex:1,background:"#1C2128",borderRadius:8,padding:10,textAlign:"center"}}><p style={{fontSize:10,color:"#7D8590"}}>Tâches</p><p style={{fontSize:22,fontWeight:500,color:"#2DD4BF"}}>{Object.values(taskChecks).filter(Boolean).length}/{[...tasks.daily,...tasks.weekday,...tasks.weekly].length}</p></div></div>
{stats.length>0&&<><p style={{fontSize:10,color:"#7D8590",margin:"10px 0 6px"}}>Historique</p><div style={{display:"flex",alignItems:"flex-end",gap:4,height:50}}>{stats.slice(-8).map((s,i)=><div key={i} style={{flex:1,background:"#2DD4BF",borderRadius:"3px 3px 0 0",height:`${s.execution||0}%`,opacity:0.4+i*0.08}}/>)}</div></>}</>)}

{card(<>{sect("Vues shorts")}{[["tiktok","TikTok","#ff0050"],["ig","Instagram","#E1306C"],["yt","YouTube","#E24B4A"]].map(([k,l,c])=><div key={k} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><div style={{width:8,height:8,borderRadius:"50%",background:c}}/><span style={{fontSize:12,width:80}}>{l}</span>{inp(statForm[k],e=>setStatForm({...statForm,[k]:e.target.value}),"0",{flex:1,textAlign:"right"})}</div>)}</>)}

{card(<>{sect("Revenus du mois")}{[["affil","Affiliation net ($)"],["vip_count","Membres VIP actifs"],["vip_rev","Revenu VIP ($)"]].map(([k,l])=><div key={k} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><span style={{fontSize:12,flex:1}}>{l}</span>{inp(statForm[k],e=>setStatForm({...statForm,[k]:e.target.value}),"0",{width:100,textAlign:"right"})}</div>)}</>)}

<button onClick={submitStats} style={{width:"100%",padding:12,borderRadius:8,background:"#2DD4BF",color:"#0E1117",fontWeight:500,fontSize:14,border:"none",cursor:"pointer",fontFamily:"inherit",marginBottom:10}}>Enregistrer le bilan</button>

{stats.length>0&&card(<>{sect("Historique")}{stats.slice(-5).reverse().map((s,i)=><div key={i} style={{padding:"8px 10px",background:"#1C2128",borderRadius:6,marginBottom:4}}>
<div style={{display:"flex",justifyContent:"space-between",fontSize:11}}><span style={{color:"#7D8590"}}>{s.date}</span><span style={{color:"#2DD4BF"}}>Exec: {s.execution}%</span></div>
<div style={{display:"flex",gap:8,fontSize:11,marginTop:4}}><span style={{color:"#ff0050"}}>TT:{(s.tiktok||0).toLocaleString()}</span><span style={{color:"#E1306C"}}>IG:{(s.ig||0).toLocaleString()}</span><span style={{color:"#E24B4A"}}>YT:{(s.yt||0).toLocaleString()}</span></div>
<div style={{fontSize:11,color:"#7D8590",marginTop:2}}>Affil: ${s.affil||0} · VIP: {s.vip_count||0} (${s.vip_rev||0})</div>
</div>)}</>)}

{lastStat&&<div style={{background:"#0D3331",borderRadius:10,padding:"14px 16px",border:"0.5px solid #134E4A"}}>
<div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:11,color:"#2DD4BF"}}>Objectif 100k/mois</span><span style={{fontSize:11,color:"#2DD4BF",fontWeight:500}}>${((lastStat.affil||0)+(lastStat.vip_rev||0)).toLocaleString()} / $100,000</span></div>
<div style={{height:6,background:"#134E4A",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${Math.min(((lastStat.affil||0)+(lastStat.vip_rev||0))/1000,100)}%`,background:"#2DD4BF",borderRadius:3}}/></div>
</div>}
</>}

</div>
</div>);
}
