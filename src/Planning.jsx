import React, { useState, useEffect, useCallback } from "react";
import { loadPlanning, savePlanning } from "./supabase.js";

// ── CATEGORIES ──
const CC = {
  serie:"#ff0050",live:"#cc2d4a",telegram:"#2a9fd6",business:"#7c6bbd",
  hyppest:"#1db954",sport:"#f5c242",priere:"#2e9e7a",pause:"#5a7a8c",
  libre:"#444",prep:"#4a90c4",formation:"#e05a33",vip:"#e8783a",manychat:"#0084ff",
  educative:"#2DD4BF",mindset:"#AFA9EC",vlog:"#AFA9EC",storytelling:"#e05a33"
};
const CL = {
  serie:"Série YT",live:"Live",telegram:"Telegram",business:"Business",
  hyppest:"Hyppest",sport:"Sport",priere:"Prière/Perso",pause:"Pause/Repas",
  libre:"Libre",prep:"Préparation",formation:"Formation",vip:"VIP",manychat:"ManyChat",
  educative:"Éducative",mindset:"Mindset",vlog:"Vlog",storytelling:"Storytelling"
};

// ── DEFAULT WEEK ──
const DW = {
  Lundi: [
    {t:"11:00",cat:"priere",note:"Réveil + routine"},
    {t:"12:00",cat:"pause",note:"Déjeuner"},
    {t:"13:00",cat:"serie",note:"🎥 Segment 1 — Intro semaine + CTA ebook"},
    {t:"13:30",cat:"serie",note:"🎥 Segment 2 — Analyse marchés de la semaine"},
    {t:"14:00",cat:"serie",note:"🎥 Segment 3 — Mindset"},
    {t:"15:00",cat:"formation",note:"🎓 Tournage épisode formation (1/3)"},
    {t:"16:00",cat:"formation",note:"🎓 Tournage formation (2/3)"},
    {t:"17:00",cat:"formation",note:"🎓 Tournage formation (3/3) + ⚠️ PUBLIER EBOOK MANYCHAT"},
    {t:"18:00",cat:"manychat",note:"📢 Broadcast ManyChat — conversion VIP"},
    {t:"19:00",cat:"libre",note:""},
    {t:"20:00",cat:"telegram",note:"📨 Envoi plans VIP (20 min) + Dîner"},
    {t:"21:00",cat:"libre",note:""},
    {t:"22:00",cat:"libre",note:""},
    {t:"23:00",cat:"libre",note:"Décompression"},
    {t:"00:00",cat:"priere",note:"Coucher"},
  ],
  Mardi: [
    {t:"11:00",cat:"priere",note:"Réveil + routine"},
    {t:"12:00",cat:"vip",note:"📝 Préparation vidéo éducative VIP (1h)"},
    {t:"13:00",cat:"telegram",note:"🎙️ Audios canal public + bulles promo live (1h)"},
    {t:"14:00",cat:"pause",note:"Déjeuner"},
    {t:"15:00",cat:"serie",note:"🎥 Segment 4 — Prépa session trading avant le live"},
    {t:"16:00",cat:"libre",note:""},
    {t:"17:00",cat:"hyppest",note:"📞 Point mi-semaine Hyppest"},
    {t:"18:00",cat:"sport",note:"🏋️ Salle de muscu"},
    {t:"19:00",cat:"libre",note:""},
    {t:"20:00",cat:"telegram",note:"📨 Envoi plans VIP (20 min) + Dîner"},
    {t:"21:30",cat:"live",note:"🔴 LIVE TikTok + YouTube (session US)"},
    {t:"22:30",cat:"live",note:"🔴 LIVE — suite"},
    {t:"23:30",cat:"live",note:"🔴 LIVE — fin"},
    {t:"00:00",cat:"priere",note:"Coucher"},
  ],
  Mercredi: [
    {t:"11:00",cat:"priere",note:"Réveil + routine"},
    {t:"12:00",cat:"pause",note:"Déjeuner"},
    {t:"13:00",cat:"educative",note:"🎬 Tournage vidéo éducative mercredi (calendrier éditorial)"},
    {t:"14:00",cat:"educative",note:"🎬 Tournage éducative — suite + envoi rushs monteur"},
    {t:"15:00",cat:"serie",note:"🎥 Segment 5 — Sortie KL + vlog lifestyle"},
    {t:"16:00",cat:"serie",note:"🎥 Segment 5 — Vlog suite"},
    {t:"17:00",cat:"sport",note:"🏋️ Salle de muscu"},
    {t:"18:00",cat:"libre",note:""},
    {t:"19:00",cat:"libre",note:""},
    {t:"20:00",cat:"telegram",note:"📨 Envoi plans VIP (20 min) + Dîner"},
    {t:"20:30",cat:"manychat",note:"📢 Broadcast ManyChat — conversion VIP"},
    {t:"21:30",cat:"live",note:"🔴 LIVE TikTok + YouTube (session US)"},
    {t:"22:30",cat:"live",note:"🔴 LIVE — suite"},
    {t:"23:30",cat:"live",note:"🔴 LIVE — fin"},
    {t:"00:00",cat:"priere",note:"Coucher"},
  ],
  Jeudi: [
    {t:"11:00",cat:"priere",note:"Réveil + routine"},
    {t:"12:00",cat:"pause",note:"Déjeuner"},
    {t:"13:00",cat:"vip",note:"🎬 Tournage vidéo éducative VIP (1h)"},
    {t:"14:00",cat:"telegram",note:"🎙️ Audios canal public + bulles promo live (1h)"},
    {t:"15:00",cat:"serie",note:"🎥 Segment 6 — Trade breakdown de la semaine"},
    {t:"16:00",cat:"libre",note:""},
    {t:"17:00",cat:"libre",note:""},
    {t:"18:00",cat:"sport",note:"🏋️ Salle de muscu"},
    {t:"19:00",cat:"libre",note:""},
    {t:"20:00",cat:"telegram",note:"📨 Envoi plans VIP (20 min) + Dîner"},
    {t:"21:30",cat:"live",note:"🔴 LIVE TikTok + YouTube (session US)"},
    {t:"22:30",cat:"live",note:"🔴 LIVE — suite"},
    {t:"23:30",cat:"live",note:"🔴 LIVE — fin"},
    {t:"00:00",cat:"priere",note:"Coucher"},
  ],
  Vendredi: [
    {t:"11:00",cat:"priere",note:"Réveil + routine"},
    {t:"12:00",cat:"priere",note:"🕌 Jumu'ah"},
    {t:"13:00",cat:"pause",note:"Déjeuner"},
    {t:"14:00",cat:"serie",note:"🎥 Segment 7 — Bilan semaine + CTA final"},
    {t:"14:30",cat:"mindset",note:"🎬 Tournage vidéo mindset/vlog vendredi (calendrier éditorial)"},
    {t:"15:00",cat:"business",note:"📊 Bilan semaine — chiffres, objectifs"},
    {t:"15:30",cat:"manychat",note:"📢 Broadcast ManyChat — conversion VIP"},
    {t:"16:00",cat:"libre",note:"Repos"},
    {t:"17:00",cat:"libre",note:"Repos"},
    {t:"18:00",cat:"serie",note:"🎥 Sortie KL lifestyle — bilan épisode série"},
    {t:"19:00",cat:"serie",note:"🎥 Sortie KL — suite"},
    {t:"20:00",cat:"pause",note:"Dîner"},
    {t:"21:00",cat:"libre",note:"Soirée libre"},
    {t:"22:00",cat:"libre",note:"Soirée libre"},
    {t:"23:00",cat:"libre",note:"Détente"},
    {t:"00:00",cat:"priere",note:"Coucher"},
  ],
  Samedi: [
    {t:"11:00",cat:"priere",note:"Réveil + routine"},
    {t:"12:00",cat:"pause",note:"Déjeuner"},
    {t:"13:00",cat:"hyppest",note:"⚡ Tournage contenu Hyppest — batch"},
    {t:"14:00",cat:"hyppest",note:"⚡ Tournage Hyppest — suite"},
    {t:"15:00",cat:"hyppest",note:"⚡ Upload tout contenu Hyppest"},
    {t:"16:00",cat:"libre",note:""},
    {t:"17:00",cat:"business",note:"📞 Point avec maman — projet (2h)"},
    {t:"18:00",cat:"business",note:"📞 Point maman — suite"},
    {t:"19:00",cat:"libre",note:""},
    {t:"20:00",cat:"pause",note:"Dîner"},
    {t:"21:00",cat:"libre",note:"Soirée libre"},
    {t:"22:00",cat:"libre",note:"Soirée libre"},
    {t:"23:00",cat:"libre",note:"Détente"},
    {t:"00:00",cat:"priere",note:"Coucher"},
  ],
  Dimanche: [
    {t:"11:00",cat:"priere",note:"Réveil + routine"},
    {t:"12:00",cat:"pause",note:"Déjeuner"},
    {t:"13:00",cat:"prep",note:"📝 Préparation ebook semaine prochaine"},
    {t:"14:00",cat:"prep",note:"📝 Préparation calendrier Telegram"},
    {t:"15:00",cat:"business",note:"💼 Admin — factures, clients, compta LLC"},
    {t:"16:00",cat:"libre",note:""},
    {t:"17:00",cat:"libre",note:""},
    {t:"18:00",cat:"libre",note:""},
    {t:"19:00",cat:"pause",note:"Dîner"},
    {t:"20:00",cat:"prep",note:"📝 Prépa live — notes et structure"},
    {t:"21:00",cat:"libre",note:""},
    {t:"22:00",cat:"libre",note:""},
    {t:"23:00",cat:"live",note:"🔴 LIVE analyse de la semaine"},
    {t:"00:00",cat:"live",note:"🔴 LIVE — suite"},
    {t:"01:00",cat:"priere",note:"Coucher"},
  ],
};
const DAYS=Object.keys(DW);

// ── EDITORIAL CALENDAR ──
const EDITORIAL = [
  {w:"27/04 → 03/05",items:[
    {id:"V03",day:"Mercredi",type:"Storytelling",title:"Comment Jesse Livermore est passé de 5$ à 100M$",status:"Script prêt",funnel:"Telegram"},
    {id:"F01",day:"Vendredi",type:"Mindset",title:"À définir",status:"À définir",funnel:""},
    {id:"EP01",day:"Dimanche",type:"Série",title:"Vivre de son trading en Malaisie",status:"À tourner",funnel:""},
  ]},
  {w:"04/05 → 10/05",items:[
    {id:"V04",day:"Mercredi",type:"Éducative",title:"Ma routine complète de trader",status:"Script prêt",funnel:"V01 + Telegram"},
    {id:"F02",day:"Vendredi",type:"Vlog",title:"72h pour convaincre mon pote trader de quitter Dubaï",status:"Tourné",funnel:""},
    {id:"EP02",day:"Dimanche",type:"Série",title:"Série Malaisie",status:"À tourner",funnel:""},
  ]},
  {w:"11/05 → 17/05",items:[
    {id:"V05",day:"Mercredi",type:"Investissement",title:"La composition de mon portefeuille boursier",status:"À écrire",funnel:"Commentaires"},
    {id:"F03",day:"Vendredi",type:"Mindset",title:"À définir",status:"À définir",funnel:""},
    {id:"EP03",day:"Dimanche",type:"Série",title:"Série Malaisie",status:"À tourner",funnel:""},
  ]},
  {w:"18/05 → 24/05",items:[
    {id:"V06",day:"Mercredi",type:"Technique",title:"Comment utiliser Fibonacci en trading",status:"À tourner",funnel:"V01 + Telegram"},
    {id:"F04",day:"Vendredi",type:"Vlog",title:"Podcast BabySoldat x Adnane",status:"Tourné",funnel:""},
    {id:"EP04",day:"Dimanche",type:"Série",title:"Série Malaisie",status:"À tourner",funnel:""},
  ]},
  {w:"25/05 → 31/05",items:[
    {id:"V07",day:"Mercredi",type:"Storytelling",title:"Il a fait couler une banque de 233 ans (Nick Leeson)",status:"À écrire",funnel:"V03 Livermore"},
    {id:"F05",day:"Vendredi",type:"Mindset",title:"À définir",status:"À définir",funnel:""},
    {id:"EP05",day:"Dimanche",type:"Série",title:"Série Malaisie",status:"À tourner",funnel:""},
  ]},
  {w:"01/06 → 07/06",items:[
    {id:"V08",day:"Mercredi",type:"Éducative",title:"CFD ou Futures ? La vraie différence",status:"À écrire",funnel:"Telegram"},
    {id:"F06",day:"Vendredi",type:"Vlog",title:"À définir",status:"À définir",funnel:""},
    {id:"EP06",day:"Dimanche",type:"Série",title:"Série Malaisie",status:"À tourner",funnel:""},
  ]},
];

const DEFAULT_TASKS = {
  daily: ["Tourner + poster 5 shorts (IG/TikTok/YT)","Envoi rushs au monteur"],
  weekday: ["Plans VIP Telegram à 20h"],
  weekly: ["Écrire script vidéo mercredi","Définir sujet vidéo vendredi","Prépa ebook + calendrier Telegram","Admin — factures, compta LLC"],
};

const DEFAULT_STATS = [];

// ── HELPERS ──
function db(fn,ms){let t;return(...a)=>{clearTimeout(t);t=setTimeout(()=>fn(...a),ms)}}
const statusColor=(s)=>{
  if(s.includes("Publié"))return{bg:"#0D3331",c:"#2DD4BF"};
  if(s.includes("Tourné"))return{bg:"#0D3331",c:"#2DD4BF"};
  if(s.includes("Script"))return{bg:"#3D2E0A",c:"#EF9F27"};
  if(s.includes("tourner"))return{bg:"#3D1111",c:"#E24B4A"};
  if(s.includes("écrire"))return{bg:"#1C2128",c:"#7D8590"};
  return{bg:"#1C2128",c:"#7D8590"};
};
const typeColor=(t)=>{
  if(t==="Storytelling")return"#e05a33";
  if(t==="Éducative")return"#2DD4BF";
  if(t==="Investissement")return"#378ADD";
  if(t==="Technique")return"#EF9F27";
  if(t==="Mindset")return"#AFA9EC";
  if(t==="Vlog")return"#AFA9EC";
  if(t==="Série")return"#ff0050";
  return"#7D8590";
};

// ── STYLES ──
const S={
  app:{fontFamily:"system-ui,-apple-system,'Segoe UI',sans-serif",background:"#0E1117",color:"#E6EDF3",minHeight:"100vh"},
  wrap:{maxWidth:700,margin:"0 auto",padding:"12px 16px 100px"},
  h1:{fontSize:24,fontWeight:500,color:"#E6EDF3",margin:"0 0 4px"},
  sub:{fontSize:13,color:"#7D8590",margin:"0 0 16px"},
  card:{background:"#161B22",borderRadius:10,padding:"14px 16px",marginBottom:10,border:"0.5px solid #21262D"},
  sect:{fontSize:11,color:"#2DD4BF",textTransform:"uppercase",letterSpacing:"1px",marginBottom:10,fontWeight:500},
  row:{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",background:"#1C2128",borderRadius:6,marginBottom:4},
  pill:(bg,c)=>({fontSize:9,padding:"2px 7px",borderRadius:4,background:bg,color:c,display:"inline-block"}),
  chkOff:{width:18,height:18,borderRadius:4,border:"2px solid #21262D",flexShrink:0,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"},
  chkOn:{width:18,height:18,borderRadius:4,background:"#2DD4BF",flexShrink:0,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#0E1117",fontWeight:700},
  tab:{padding:"8px 16px",borderRadius:6,border:"none",fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:"inherit"},
  input:{background:"#0E1117",border:"1px solid #21262D",color:"#E6EDF3",padding:"6px 10px",borderRadius:6,fontSize:13,fontFamily:"inherit",width:"100%"},
  bar:{position:"fixed",bottom:0,left:0,right:0,background:"#161B22",borderTop:"0.5px solid #21262D",padding:"8px 0 env(safe-area-inset-bottom,12px)",display:"flex",justifyContent:"space-around",zIndex:10},
  navItem:(a)=>({display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",fontSize:10,color:a?"#2DD4BF":"#7D8590",fontWeight:a?500:400}),
};

export default function App(){
  const[week,setWeek]=useState(DW);
  const[checked,setChecked]=useState({});
  const[tasks,setTasks]=useState(DEFAULT_TASKS);
  const[taskChecks,setTaskChecks]=useState({});
  const[stats,setStats]=useState(DEFAULT_STATS);
  const[view,setView]=useState("home");
  const ti=new Date().getDay();
  const[selDay,setSelDay]=useState(DAYS[ti===0?6:ti-1]);
  const[editing,setEditing]=useState(null);
  const[editNote,setEditNote]=useState("");
  const[editCat,setEditCat]=useState("");
  const[newTask,setNewTask]=useState("");
  const[statForm,setStatForm]=useState({tiktok:"",ig:"",yt:"",affil:"",vip_count:"",vip_rev:""});
  const[loaded,setLoaded]=useState(false);
  const[synced,setSynced]=useState(true);
  const[contFilter,setContFilter]=useState("Tout");

  const save=useCallback(db(async(k,v)=>{setSynced(false);await savePlanning(k,v);setSynced(true)},800),[]);

  useEffect(()=>{(async()=>{
    try{const w=await loadPlanning("week");if(w)setWeek(w)}catch{}
    try{const c=await loadPlanning("checks");if(c)setChecked(c)}catch{}
    try{const t=await loadPlanning("tasks");if(t)setTasks(t)}catch{}
    try{const tc=await loadPlanning("taskChecks");if(tc)setTaskChecks(tc)}catch{}
    try{const s=await loadPlanning("stats");if(s)setStats(s)}catch{}
    setLoaded(true);
  })()},[]);

  const uw=(w)=>{setWeek(w);save("week",w)};
  const uc=(c)=>{setChecked(c);save("checks",c)};
  const ut=(t)=>{setTasks(t);save("tasks",t)};
  const utc=(c)=>{setTaskChecks(c);save("taskChecks",c)};
  const us=(s)=>{setStats(s);save("stats",s)};

  const toggle=(d,i)=>{const k=`${d}-${i}`;uc({...checked,[k]:!checked[k]})};
  const toggleTask=(cat,i)=>{const k=`${cat}-${i}`;utc({...taskChecks,[k]:!taskChecks[k]})};

  const startEdit=(d,i)=>{setEditing({day:d,idx:i});setEditNote(week[d][i].note);setEditCat(week[d][i].cat)};
  const saveEdit=()=>{if(!editing)return;const w={...week};w[editing.day]=[...w[editing.day]];w[editing.day][editing.idx]={...w[editing.day][editing.idx],note:editNote,cat:editCat};uw(w);setEditing(null)};

  const addTask=()=>{if(!newTask.trim())return;const t={...tasks,weekly:[...tasks.weekly,newTask.trim()]};ut(t);setNewTask("")};
  const removeTask=(i)=>{const t={...tasks,weekly:tasks.weekly.filter((_,j)=>j!==i)};ut(t)};

  const submitStats=()=>{
    const entry={
      date:new Date().toISOString().slice(0,10),
      tiktok:Number(statForm.tiktok)||0,ig:Number(statForm.ig)||0,yt:Number(statForm.yt)||0,
      affil:Number(statForm.affil)||0,vip_count:Number(statForm.vip_count)||0,vip_rev:Number(statForm.vip_rev)||0,
      execution:weekPct,tasksTotal:allTasksTotal,tasksDone:allTasksDone,
    };
    const s=[...stats,entry];us(s);
    setStatForm({tiktok:"",ig:"",yt:"",affil:"",vip_count:"",vip_rev:""});
  };

  const resetAll=()=>{if(confirm("Reset tout le planning ?")){uw(DW);uc({});ut(DEFAULT_TASKS);utc({})}};
  const uncheckDay=(d)=>{const c={...checked};week[d].forEach((_,i)=>delete c[`${d}-${i}`]);uc(c)};

  // Computed
  const isNotEmpty=(d,i)=>!!week[d][i].note;
  const dDone=(d)=>week[d].filter((_,i)=>checked[`${d}-${i}`]&&isNotEmpty(d,i)).length;
  const dTotal=(d)=>week[d].filter((_,i)=>isNotEmpty(d,i)).length;
  const dPct=(d)=>dTotal(d)?Math.round(dDone(d)/dTotal(d)*100):0;
  const tDone=DAYS.reduce((a,d)=>a+dDone(d),0);
  const tTotal=DAYS.reduce((a,d)=>a+dTotal(d),0);
  const weekPct=tTotal?Math.round(tDone/tTotal*100):0;
  const pc=(p)=>p>=90?"#2DD4BF":p>=50?"#f5c242":p>0?"#e8783a":"#21262D";

  const allTasksDone=[...tasks.daily,...tasks.weekday,...tasks.weekly].filter((_,i)=>taskChecks[`all-${i}`]).length;
  const allTasksTotal=[...tasks.daily,...tasks.weekday,...tasks.weekly].length;

  const todaySlots=week[selDay]||[];
  const nextTask=todaySlots.find((_,i)=>!checked[`${selDay}-${i}`]&&isNotEmpty(selDay,i));

  const lastStat=stats[stats.length-1];

  if(!loaded)return<div style={{...S.app,display:"flex",alignItems:"center",justifyContent:"center",height:"100vh"}}><span style={{color:"#7D8590"}}>Chargement...</span></div>;

  return(
    <div style={S.app}>
      <div style={S.wrap}>

      {/* ═══ HOME ═══ */}
      {view==="home"&&<>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <p style={{fontSize:13,color:"#7D8590"}}>{new Date().toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"})}</p>
            <h1 style={{fontSize:26,fontWeight:500,color:"#E6EDF3",margin:"2px 0 0"}}>Salam 👋</h1>
          </div>
          <div style={{width:10,height:10,borderRadius:"50%",background:synced?"#2DD4BF":"#f5c242"}} title={synced?"Synchro OK":"En cours..."}/>
        </div>

        <div style={{...S.card,marginTop:16}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
            <span style={{fontSize:13,color:"#7D8590"}}>Progression semaine</span>
            <span style={{fontSize:20,fontWeight:500,color:pc(weekPct)}}>{weekPct}%</span>
          </div>
          <div style={{height:5,background:"#134E4A",borderRadius:3,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${weekPct}%`,background:"#2DD4BF",borderRadius:3,transition:"width 0.3s"}}/>
          </div>
          <div style={{display:"flex",gap:3,marginTop:10}}>
            {DAYS.map(d=>{const p=dPct(d);const isToday=d===selDay;return(
              <div key={d} onClick={()=>{setSelDay(d);setView("plan")}} style={{flex:1,textAlign:"center",padding:"5px 0",borderRadius:5,background:p>=90?"#2DD4BF":p>0?"#134E4A":"#1C2128",color:p>=90?"#0E1117":p>0?"#2DD4BF":"#7D8590",fontSize:9,fontWeight:500,cursor:"pointer",border:isToday?"1.5px solid #2DD4BF":"1.5px solid transparent"}}>{d.slice(0,3)}<br/>{p>0?p+"%":"—"}</div>
            )})}
          </div>
        </div>

        {nextTask&&<div style={S.card}>
          <p style={S.sect}>Maintenant</p>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:36,height:36,borderRadius:8,background:"#0D3331",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>📋</div>
            <div style={{flex:1}}><p style={{fontSize:14,fontWeight:500,color:"#E6EDF3"}}>{nextTask.note}</p><p style={{fontSize:12,color:"#7D8590"}}>{nextTask.t}</p></div>
          </div>
        </div>}

        <div style={S.card}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><p style={S.sect}>Contenus cette semaine</p></div>
          {EDITORIAL[0]?.items.map((it,i)=>(
            <div key={i} style={{...S.row,borderLeft:`3px solid ${typeColor(it.type)}`}}>
              <span style={{fontSize:12,color:"#E6EDF3",flex:1}}>{it.id} — {it.title.length>30?it.title.slice(0,30)+"…":it.title}</span>
              <span style={S.pill(statusColor(it.status).bg,statusColor(it.status).c)}>{it.status}</span>
            </div>
          ))}
        </div>

        <div style={S.card}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
            <p style={S.sect}>Tâches du jour</p>
            <span style={{fontSize:11,color:"#7D8590"}}>{allTasksDone}/{allTasksTotal}</span>
          </div>
          {[...tasks.daily,...tasks.weekday,...tasks.weekly].slice(0,5).map((t,i)=>{const done=taskChecks[`all-${i}`];return(
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"4px 0"}}>
              <div onClick={()=>toggleTask("all",i)} style={done?S.chkOn:S.chkOff}>{done?"✓":""}</div>
              <span style={{fontSize:12,color:done?"#7D8590":"#E6EDF3",textDecoration:done?"line-through":"none"}}>{t}</span>
            </div>
          )})}
        </div>
      </>}

      {/* ═══ PLANNING ═══ */}
      {view==="plan"&&<>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <h1 style={S.h1}>Planning</h1>
          <div style={{display:"flex",gap:4}}>
            <button onClick={resetAll} style={{...S.tab,background:"transparent",color:"#E24B4A",border:"1px solid #21262D"}}>Reset</button>
          </div>
        </div>

        <div style={{display:"flex",gap:3,margin:"12px 0"}}>
          {DAYS.map(d=>(
            <button key={d} onClick={()=>setSelDay(d)} style={{flex:1,padding:"7px 0",borderRadius:5,border:d===selDay?"2px solid #E6EDF3":"1px solid #21262D",background:d===selDay?"#1C2128":"transparent",color:d===selDay?"#E6EDF3":"#7D8590",fontWeight:700,fontSize:10,cursor:"pointer",fontFamily:"inherit"}}>{d.slice(0,3)}{dPct(d)>0&&<><br/><span style={{color:pc(dPct(d)),fontSize:9}}>{dPct(d)}%</span></>}</button>
          ))}
        </div>

        <div style={{...S.card,padding:"8px 12px"}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:11}}>
            <span style={{color:"#7D8590"}}>{selDay} {dDone(selDay)}/{dTotal(selDay)}</span>
            <span style={{fontWeight:500,color:pc(dPct(selDay))}}>{dPct(selDay)}%</span>
          </div>
          <div style={{height:4,background:"#21262D",borderRadius:2,marginTop:4,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${dPct(selDay)}%`,background:pc(dPct(selDay)),transition:"width 0.3s"}}/>
          </div>
        </div>

        <div style={{display:"flex",justifyContent:"flex-end",marginBottom:6}}>
          <button onClick={()=>uncheckDay(selDay)} style={{fontSize:10,color:"#7D8590",background:"transparent",border:"1px solid #21262D",borderRadius:4,padding:"3px 10px",cursor:"pointer",fontFamily:"inherit"}}>Décocher tout</button>
        </div>

        {week[selDay].map((slot,i)=>{
          const done=checked[`${selDay}-${i}`];
          const col=CC[slot.cat]||"#444";
          const isEd=editing?.day===selDay&&editing?.idx===i;
          const dead=slot.note.includes("⚠️");
          const empty=!slot.note;
          return(
            <div key={i} style={{display:"flex",alignItems:"flex-start",gap:6,padding:"7px 8px",marginBottom:2,borderRadius:6,borderLeft:`3px solid ${col}`,background:done?"#111216":"#161B22",opacity:done?0.4:empty?0.4:1}}>
              <div style={{fontSize:11,fontWeight:700,color:"#555",width:42,flexShrink:0,paddingTop:2}}>{slot.t}</div>
              <div onClick={()=>toggle(selDay,i)} style={done?S.chkOn:empty?{...S.chkOff,borderStyle:"dashed"}:S.chkOff}>{done?"✓":""}</div>
              <div style={{flex:1,minWidth:0}}>
                {isEd?<div style={{display:"flex",flexDirection:"column",gap:6}}>
                  <input value={editNote} onChange={e=>setEditNote(e.target.value)} autoFocus placeholder="Tâche..." style={S.input}/>
                  <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
                    {Object.entries(CL).slice(0,10).map(([k,l])=>(
                      <button key={k} onClick={()=>setEditCat(k)} style={{padding:"2px 7px",borderRadius:3,fontSize:9,fontFamily:"inherit",cursor:"pointer",background:editCat===k?CC[k]:"transparent",border:`1px solid ${CC[k]}`,color:editCat===k?"#fff":CC[k]}}>{l}</button>
                    ))}
                  </div>
                  <div style={{display:"flex",gap:4}}>
                    <button onClick={saveEdit} style={{...S.tab,background:"#2DD4BF",color:"#0E1117"}}>OK</button>
                    <button onClick={()=>setEditing(null)} style={{...S.tab,background:"transparent",color:"#7D8590",border:"1px solid #21262D"}}>Annuler</button>
                  </div>
                </div>:
                <div onClick={()=>startEdit(selDay,i)} style={{cursor:"pointer",minHeight:20}}>
                  <div style={{fontSize:12,lineHeight:1.4,textDecoration:done?"line-through":"none",color:empty?"#444":dead?"#E24B4A":"#E6EDF3",fontWeight:dead?700:400,fontStyle:empty?"italic":"normal"}}>{empty?"Case libre — clique pour remplir":slot.note}</div>
                  {!empty&&<div style={{fontSize:9,color:col,marginTop:2,fontWeight:600}}>{CL[slot.cat]}</div>}
                </div>}
              </div>
            </div>
          );
        })}
      </>}

      {/* ═══ CONTENU ═══ */}
      {view==="cont"&&<>
        <h1 style={S.h1}>Calendrier éditorial</h1>
        <p style={S.sub}>6 mois — Avril → Septembre 2026</p>

        <div style={{display:"flex",gap:4,marginBottom:14,flexWrap:"wrap"}}>
          {["Tout","Éducative","Mindset","Vlog","Storytelling","Série","Investissement","Technique"].map(f=>(
            <button key={f} onClick={()=>setContFilter(f)} style={{...S.tab,background:contFilter===f?"#2DD4BF":"#1C2128",color:contFilter===f?"#0E1117":"#7D8590",border:"none"}}>{f}</button>
          ))}
        </div>

        {EDITORIAL.map((wk,wi)=>{
          const filtered=contFilter==="Tout"?wk.items:wk.items.filter(it=>it.type===contFilter);
          if(!filtered.length)return null;
          return(
            <div key={wi} style={S.card}>
              <p style={S.sect}>{wk.w}</p>
              {filtered.map((it,i)=>{const sc=statusColor(it.status);return(
                <div key={i} style={{padding:10,background:"#1C2128",borderRadius:8,marginBottom:6,borderLeft:`3px solid ${typeColor(it.type)}`}}>
                  <div style={{display:"flex",gap:6,marginBottom:4,flexWrap:"wrap"}}>
                    <span style={S.pill("#1C2128","#7D8590")}>{it.day}</span>
                    <span style={S.pill(typeColor(it.type)+"20",typeColor(it.type))}>{it.type}</span>
                  </div>
                  <p style={{fontSize:13,color:"#E6EDF3",fontWeight:500,lineHeight:1.3}}>{it.id} — {it.title}</p>
                  <div style={{display:"flex",gap:6,marginTop:6,alignItems:"center"}}>
                    <span style={S.pill(sc.bg,sc.c)}>{it.status}</span>
                    {it.funnel&&<span style={{fontSize:10,color:"#7D8590"}}>→ {it.funnel}</span>}
                  </div>
                </div>
              )})}
            </div>
          );
        })}
      </>}

      {/* ═══ TÂCHES ═══ */}
      {view==="task"&&<>
        <h1 style={S.h1}>Tâches</h1>
        <p style={S.sub}>Récurrentes + ponctuelles</p>

        <div style={S.card}>
          <p style={S.sect}>Récurrentes — tous les jours</p>
          {tasks.daily.map((t,i)=>{const k=`daily-${i}`;const done=taskChecks[k];return(
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 0"}}>
              <div onClick={()=>toggleTask("daily",i)} style={done?S.chkOn:S.chkOff}>{done?"✓":""}</div>
              <span style={{fontSize:12,color:done?"#7D8590":"#E6EDF3",textDecoration:done?"line-through":"none"}}>{t}</span>
            </div>
          )})}
        </div>

        <div style={S.card}>
          <p style={S.sect}>Récurrentes — jours ouvrables</p>
          {tasks.weekday.map((t,i)=>{const k=`weekday-${i}`;const done=taskChecks[k];return(
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 0"}}>
              <div onClick={()=>toggleTask("weekday",i)} style={done?S.chkOn:S.chkOff}>{done?"✓":""}</div>
              <span style={{fontSize:12,color:done?"#7D8590":"#E6EDF3",textDecoration:done?"line-through":"none"}}>{t}</span>
            </div>
          )})}
        </div>

        <div style={S.card}>
          <p style={S.sect}>Cette semaine</p>
          {tasks.weekly.map((t,i)=>{const k=`weekly-${i}`;const done=taskChecks[k];return(
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 0"}}>
              <div onClick={()=>toggleTask("weekly",i)} style={done?S.chkOn:S.chkOff}>{done?"✓":""}</div>
              <span style={{fontSize:12,color:done?"#7D8590":"#E6EDF3",textDecoration:done?"line-through":"none",flex:1}}>{t}</span>
              <button onClick={()=>removeTask(i)} style={{background:"transparent",border:"none",color:"#E24B4A",cursor:"pointer",fontSize:14,padding:4}}>×</button>
            </div>
          )})}
          <div style={{display:"flex",gap:6,marginTop:10}}>
            <input value={newTask} onChange={e=>setNewTask(e.target.value)} placeholder="Nouvelle tâche..." onKeyDown={e=>e.key==="Enter"&&addTask()} style={{...S.input,flex:1}}/>
            <button onClick={addTask} style={{...S.tab,background:"#2DD4BF",color:"#0E1117",border:"none"}}>+</button>
          </div>
        </div>
      </>}

      {/* ═══ STATS ═══ */}
      {view==="stat"&&<>
        <h1 style={S.h1}>Stats</h1>
        <p style={S.sub}>Bilan du dimanche</p>

        <div style={S.card}>
          <p style={S.sect}>Exécution cette semaine (auto)</p>
          <div style={{display:"flex",gap:8,marginBottom:10}}>
            <div style={{flex:1,background:"#1C2128",borderRadius:8,padding:10,textAlign:"center"}}><p style={{fontSize:10,color:"#7D8590"}}>Planning</p><p style={{fontSize:22,fontWeight:500,color:"#2DD4BF"}}>{weekPct}%</p></div>
            <div style={{flex:1,background:"#1C2128",borderRadius:8,padding:10,textAlign:"center"}}><p style={{fontSize:10,color:"#7D8590"}}>Tâches</p><p style={{fontSize:22,fontWeight:500,color:"#2DD4BF"}}>{allTasksDone}/{allTasksTotal}</p></div>
          </div>
          {stats.length>0&&<>
            <p style={{fontSize:10,color:"#7D8590",marginBottom:6}}>Historique exécution</p>
            <div style={{display:"flex",alignItems:"flex-end",gap:4,height:50}}>
              {stats.slice(-8).map((s,i)=>(
                <div key={i} style={{flex:1,background:"#134E4A",borderRadius:"3px 3px 0 0",height:`${s.execution}%`}}><div style={{height:"100%",background:"#2DD4BF",borderRadius:"3px 3px 0 0",opacity:0.7+i*0.05}}/></div>
              ))}
            </div>
          </>}
        </div>

        <div style={S.card}>
          <p style={S.sect}>Saisie hebdo — vues shorts</p>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {[["tiktok","TikTok","#ff0050"],["ig","Instagram","#E1306C"],["yt","YouTube","#E24B4A"]].map(([k,l,c])=>(
              <div key={k} style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:c}}/>
                <span style={{fontSize:12,color:"#E6EDF3",width:80}}>{l}</span>
                <input value={statForm[k]} onChange={e=>setStatForm({...statForm,[k]:e.target.value})} placeholder="0" type="number" style={{...S.input,flex:1,textAlign:"right"}}/>
              </div>
            ))}
          </div>
        </div>

        <div style={S.card}>
          <p style={S.sect}>Revenus du mois</p>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:12,color:"#E6EDF3",flex:1}}>Affiliation net deposit ($)</span>
              <input value={statForm.affil} onChange={e=>setStatForm({...statForm,affil:e.target.value})} placeholder="0" type="number" style={{...S.input,width:100,textAlign:"right"}}/>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:12,color:"#E6EDF3",flex:1}}>Membres VIP actifs</span>
              <input value={statForm.vip_count} onChange={e=>setStatForm({...statForm,vip_count:e.target.value})} placeholder="0" type="number" style={{...S.input,width:100,textAlign:"right"}}/>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:12,color:"#E6EDF3",flex:1}}>Revenu VIP ce mois ($)</span>
              <input value={statForm.vip_rev} onChange={e=>setStatForm({...statForm,vip_rev:e.target.value})} placeholder="0" type="number" style={{...S.input,width:100,textAlign:"right"}}/>
            </div>
          </div>
        </div>

        <button onClick={submitStats} style={{width:"100%",padding:12,borderRadius:8,background:"#2DD4BF",color:"#0E1117",fontWeight:500,fontSize:14,border:"none",cursor:"pointer",fontFamily:"inherit",marginBottom:10}}>Enregistrer le bilan de la semaine</button>

        {stats.length>0&&<div style={S.card}>
          <p style={S.sect}>Historique</p>
          {stats.slice(-4).reverse().map((s,i)=>(
            <div key={i} style={{...S.row,flexDirection:"column",alignItems:"stretch",gap:4}}>
              <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:11,color:"#7D8590"}}>{s.date}</span><span style={{fontSize:11,color:"#2DD4BF"}}>Exec: {s.execution}%</span></div>
              <div style={{display:"flex",gap:8,fontSize:11}}>
                <span style={{color:"#ff0050"}}>TT: {(s.tiktok||0).toLocaleString()}</span>
                <span style={{color:"#E1306C"}}>IG: {(s.ig||0).toLocaleString()}</span>
                <span style={{color:"#E24B4A"}}>YT: {(s.yt||0).toLocaleString()}</span>
              </div>
              <div style={{display:"flex",gap:8,fontSize:11,color:"#7D8590"}}>
                <span>Affil: ${s.affil||0}</span>
                <span>VIP: {s.vip_count||0} ({s.vip_rev||0}$)</span>
              </div>
            </div>
          ))}
        </div>}

        {lastStat&&<div style={{...S.card,background:"#0D3331",border:"0.5px solid #134E4A"}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
            <span style={{fontSize:11,color:"#2DD4BF"}}>Objectif 100k/mois</span>
            <span style={{fontSize:11,color:"#2DD4BF",fontWeight:500}}>${((lastStat.affil||0)+(lastStat.vip_rev||0)).toLocaleString()} / $100,000</span>
          </div>
          <div style={{height:6,background:"#134E4A",borderRadius:3,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${Math.min(((lastStat.affil||0)+(lastStat.vip_rev||0))/1000,100)}%`,background:"#2DD4BF",borderRadius:3}}/>
          </div>
        </div>}
      </>}

      </div>

      {/* ═══ NAV BAR ═══ */}
      <div style={S.bar}>
        {[["home","🏠","Home"],["plan","📋","Planning"],["cont","📅","Contenu"],["task","✅","Tâches"],["stat","📊","Stats"]].map(([k,icon,label])=>(
          <div key={k} onClick={()=>setView(k)} style={S.navItem(view===k)}>
            <span style={{fontSize:18}}>{icon}</span>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
