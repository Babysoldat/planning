import React, { useState, useEffect, useCallback, useRef } from "react";
import { loadPlanning, savePlanning } from "./supabase.js";

const CAT_COLORS = {
  serie: "#ff0050", live: "#cc2d4a", telegram: "#2a9fd6", business: "#7c6bbd",
  hyppest: "#1db954", sport: "#f5c242", priere: "#2e9e7a", pause: "#5a7a8c",
  libre: "#666", prep: "#4a90c4", formation: "#e05a33", vip: "#e8783a", manychat: "#0084ff",
};

const CAT_LABELS = {
  serie: "Série YT", live: "Live", telegram: "Telegram", business: "Business",
  hyppest: "Hyppest", sport: "Sport", priere: "Prière/Perso", pause: "Pause/Repas",
  libre: "Libre", prep: "Préparation", formation: "Formation", vip: "VIP", manychat: "ManyChat",
};

const DEFAULT_WEEK = {
  Lundi: [
    { t: "11:00", cat: "priere", note: "Réveil + routine" },
    { t: "12:00", cat: "pause", note: "Déjeuner" },
    { t: "13:00", cat: "serie", note: "🎥 Segment 1 — Intro semaine + CTA ebook" },
    { t: "13:30", cat: "serie", note: "🎥 Segment 2 — Analyse marchés de la semaine" },
    { t: "14:00", cat: "serie", note: "🎥 Segment 3 — Mindset" },
    { t: "15:00", cat: "formation", note: "🎓 Tournage épisode formation (1/3)" },
    { t: "16:00", cat: "formation", note: "🎓 Tournage formation (2/3)" },
    { t: "17:00", cat: "formation", note: "🎓 Tournage formation (3/3)" },
    { t: "17:30", cat: "telegram", note: "⚠️ PUBLIER EBOOK MANYCHAT AVANT 17H" },
    { t: "18:00", cat: "manychat", note: "📢 Broadcast ManyChat — conversion VIP" },
    { t: "19:00", cat: "libre", note: "" },
    { t: "20:00", cat: "telegram", note: "📨 Envoi plans VIP (20 min) + Dîner" },
    { t: "21:00", cat: "libre", note: "" },
    { t: "22:00", cat: "libre", note: "" },
    { t: "23:00", cat: "libre", note: "Décompression" },
    { t: "00:00", cat: "priere", note: "Coucher" },
  ],
  Mardi: [
    { t: "11:00", cat: "priere", note: "Réveil + routine" },
    { t: "12:00", cat: "vip", note: "📝 Préparation vidéo éducative VIP (1h)" },
    { t: "13:00", cat: "telegram", note: "🎙️ Audios canal public + bulles promo live (1h)" },
    { t: "14:00", cat: "pause", note: "Déjeuner" },
    { t: "15:00", cat: "serie", note: "🎥 Segment 4 — Prépa session trading avant le live" },
    { t: "16:00", cat: "libre", note: "" },
    { t: "17:00", cat: "hyppest", note: "📞 Point mi-semaine Hyppest" },
    { t: "18:00", cat: "sport", note: "🏋️ Salle de muscu" },
    { t: "19:00", cat: "libre", note: "" },
    { t: "20:00", cat: "telegram", note: "📨 Envoi plans VIP (20 min) + Dîner" },
    { t: "21:30", cat: "live", note: "🔴 LIVE TikTok + YouTube (session US)" },
    { t: "22:30", cat: "live", note: "🔴 LIVE — suite" },
    { t: "23:30", cat: "live", note: "🔴 LIVE — fin" },
    { t: "00:00", cat: "priere", note: "Coucher" },
  ],
  Mercredi: [
    { t: "11:00", cat: "priere", note: "Réveil + routine" },
    { t: "12:00", cat: "pause", note: "Déjeuner" },
    { t: "13:00", cat: "serie", note: "🎥 Segment 5 — Sortie KL + vlog lifestyle" },
    { t: "14:00", cat: "serie", note: "🎥 Segment 5 — Vlog suite" },
    { t: "15:00", cat: "libre", note: "" },
    { t: "16:00", cat: "libre", note: "" },
    { t: "17:00", cat: "sport", note: "🏋️ Salle de muscu" },
    { t: "18:00", cat: "libre", note: "" },
    { t: "19:00", cat: "libre", note: "" },
    { t: "20:00", cat: "telegram", note: "📨 Envoi plans VIP (20 min) + Dîner" },
    { t: "20:30", cat: "manychat", note: "📢 Broadcast ManyChat — conversion VIP" },
    { t: "21:30", cat: "live", note: "🔴 LIVE TikTok + YouTube (session US)" },
    { t: "22:30", cat: "live", note: "🔴 LIVE — suite" },
    { t: "23:30", cat: "live", note: "🔴 LIVE — fin" },
    { t: "00:00", cat: "priere", note: "Coucher" },
  ],
  Jeudi: [
    { t: "11:00", cat: "priere", note: "Réveil + routine" },
    { t: "12:00", cat: "pause", note: "Déjeuner" },
    { t: "13:00", cat: "vip", note: "🎬 Tournage vidéo éducative VIP (1h)" },
    { t: "14:00", cat: "telegram", note: "🎙️ Audios canal public + bulles promo live (1h)" },
    { t: "15:00", cat: "serie", note: "🎥 Segment 6 — Trade breakdown de la semaine" },
    { t: "16:00", cat: "libre", note: "" },
    { t: "17:00", cat: "libre", note: "" },
    { t: "18:00", cat: "sport", note: "🏋️ Salle de muscu" },
    { t: "19:00", cat: "libre", note: "" },
    { t: "20:00", cat: "telegram", note: "📨 Envoi plans VIP (20 min) + Dîner" },
    { t: "21:30", cat: "live", note: "🔴 LIVE TikTok + YouTube (session US)" },
    { t: "22:30", cat: "live", note: "🔴 LIVE — suite" },
    { t: "23:30", cat: "live", note: "🔴 LIVE — fin" },
    { t: "00:00", cat: "priere", note: "Coucher" },
  ],
  Vendredi: [
    { t: "11:00", cat: "priere", note: "Réveil + routine" },
    { t: "12:00", cat: "priere", note: "🕌 Jumu'ah" },
    { t: "13:00", cat: "pause", note: "Déjeuner" },
    { t: "14:00", cat: "serie", note: "🎥 Segment 7 — Bilan semaine + CTA final" },
    { t: "15:00", cat: "business", note: "📊 Bilan semaine — chiffres, objectifs" },
    { t: "15:30", cat: "manychat", note: "📢 Broadcast ManyChat — conversion VIP" },
    { t: "16:00", cat: "libre", note: "Repos" },
    { t: "17:00", cat: "libre", note: "Repos" },
    { t: "18:00", cat: "serie", note: "🎥 Sortie KL lifestyle — bilan épisode série" },
    { t: "19:00", cat: "serie", note: "🎥 Sortie KL — suite" },
    { t: "20:00", cat: "pause", note: "Dîner" },
    { t: "21:00", cat: "libre", note: "Soirée libre" },
    { t: "22:00", cat: "libre", note: "Soirée libre" },
    { t: "23:00", cat: "libre", note: "Détente" },
    { t: "00:00", cat: "priere", note: "Coucher" },
  ],
  Samedi: [
    { t: "11:00", cat: "priere", note: "Réveil + routine" },
    { t: "12:00", cat: "pause", note: "Déjeuner" },
    { t: "13:00", cat: "hyppest", note: "⚡ Tournage contenu Hyppest — batch" },
    { t: "14:00", cat: "hyppest", note: "⚡ Tournage Hyppest — suite" },
    { t: "15:00", cat: "hyppest", note: "⚡ Upload tout contenu Hyppest" },
    { t: "16:00", cat: "libre", note: "" },
    { t: "17:00", cat: "business", note: "📞 Point avec maman — projet (2h)" },
    { t: "18:00", cat: "business", note: "📞 Point maman — suite" },
    { t: "19:00", cat: "libre", note: "" },
    { t: "20:00", cat: "pause", note: "Dîner" },
    { t: "21:00", cat: "libre", note: "Soirée libre" },
    { t: "22:00", cat: "libre", note: "Soirée libre" },
    { t: "23:00", cat: "libre", note: "Détente" },
    { t: "00:00", cat: "priere", note: "Coucher" },
  ],
  Dimanche: [
    { t: "11:00", cat: "priere", note: "Réveil + routine" },
    { t: "12:00", cat: "pause", note: "Déjeuner" },
    { t: "13:00", cat: "prep", note: "📝 Préparation ebook semaine prochaine" },
    { t: "14:00", cat: "prep", note: "📝 Préparation calendrier Telegram" },
    { t: "15:00", cat: "business", note: "💼 Admin — factures, clients, compta LLC" },
    { t: "16:00", cat: "libre", note: "" },
    { t: "17:00", cat: "libre", note: "" },
    { t: "18:00", cat: "libre", note: "" },
    { t: "19:00", cat: "pause", note: "Dîner" },
    { t: "20:00", cat: "prep", note: "📝 Prépa live — notes et structure" },
    { t: "21:00", cat: "libre", note: "" },
    { t: "22:00", cat: "libre", note: "" },
    { t: "23:00", cat: "live", note: "🔴 LIVE analyse de la semaine" },
    { t: "00:00", cat: "live", note: "🔴 LIVE — suite" },
    { t: "01:00", cat: "priere", note: "Coucher" },
  ],
};

const DAYS = Object.keys(DEFAULT_WEEK);

function debounce(fn, ms) {
  let t;
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}

export default function Planning() {
  const [week, setWeek] = useState(DEFAULT_WEEK);
  const [checked, setChecked] = useState({});
  const [view, setView] = useState("day");
  const ti = new Date().getDay();
  const [selDay, setSelDay] = useState(DAYS[ti === 0 ? 6 : ti - 1]);
  const [editing, setEditing] = useState(null);
  const [editNote, setEditNote] = useState("");
  const [editCat, setEditCat] = useState("");
  const [showTips, setShowTips] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [synced, setSynced] = useState(true);

  const saveWeekCloud = useCallback(
    debounce(async (w) => {
      setSynced(false);
      await savePlanning("week", w);
      setSynced(true);
    }, 800), []
  );

  const saveChecksCloud = useCallback(
    debounce(async (c) => {
      setSynced(false);
      await savePlanning("checks", c);
      setSynced(true);
    }, 800), []
  );

  useEffect(() => {
    (async () => {
      try {
        const w = await loadPlanning("week");
        if (w) setWeek(w);
      } catch {}
      try {
        const c = await loadPlanning("checks");
        if (c) setChecked(c);
      } catch {}
      setLoaded(true);
    })();
  }, []);

  const updateWeek = (w) => { setWeek(w); saveWeekCloud(w); };
  const updateChecks = (c) => { setChecked(c); saveChecksCloud(c); };

  const toggle = (d, i) => {
    const k = `${d}-${i}`;
    updateChecks({ ...checked, [k]: !checked[k] });
  };

  const startEdit = (d, i) => {
    setEditing({ day: d, idx: i });
    setEditNote(week[d][i].note);
    setEditCat(week[d][i].cat);
  };

  const saveEdit = () => {
    if (!editing) return;
    const w = { ...week };
    w[editing.day] = [...w[editing.day]];
    w[editing.day][editing.idx] = { ...w[editing.day][editing.idx], note: editNote, cat: editCat };
    updateWeek(w);
    setEditing(null);
  };

  const resetAll = () => {
    if (confirm("Reset tout le planning ?")) {
      updateWeek(DEFAULT_WEEK);
      updateChecks({});
    }
  };

  const uncheckDay = (d) => {
    const c = { ...checked };
    week[d].forEach((_, i) => delete c[`${d}-${i}`]);
    updateChecks(c);
  };

  const dDone = (d) => week[d].filter((_, i) => checked[`${d}-${i}`]).length;
  const dLen = (d) => week[d].length;
  const dPct = (d) => Math.round((dDone(d) / dLen(d)) * 100);
  const tDone = DAYS.reduce((a, d) => a + dDone(d), 0);
  const tLen = DAYS.reduce((a, d) => a + dLen(d), 0);
  const wPct = Math.round((tDone / tLen) * 100);
  const pc = (p) => p >= 90 ? "#1db954" : p >= 50 ? "#f5c242" : p > 0 ? "#e8783a" : "#444";

  if (!loaded) return (
    <div style={{ fontFamily: "system-ui", background: "#111", color: "#888", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      Chargement...
    </div>
  );

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", background: "#111", color: "#ddd", minHeight: "100vh", padding: "12px 10px", maxWidth: 700, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>📋 PLANNING</div>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: synced ? "#1db954" : "#f5c242" }} title={synced ? "Synchro OK" : "Synchro en cours..."} />
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {["day", "week"].map(v => (
            <button key={v} onClick={() => setView(v)} style={tb(view === v)}>{v === "day" ? "Jour" : "Semaine"}</button>
          ))}
          <button onClick={resetAll} style={{ ...tb(false), color: "#cc2d4a" }}>Reset</button>
        </div>
      </div>

      {/* Week progress */}
      <div style={{ background: "#1a1a1a", borderRadius: 6, padding: "8px 10px", marginBottom: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
          <span style={{ color: "#888" }}>Semaine {tDone}/{tLen}</span>
          <span style={{ fontWeight: 800, color: pc(wPct) }}>{wPct}%</span>
        </div>
        <div style={{ height: 5, background: "#222", borderRadius: 3, overflow: "hidden", marginTop: 3 }}>
          <div style={{ height: "100%", width: `${wPct}%`, background: pc(wPct), transition: "width 0.3s" }} />
        </div>
      </div>

      {/* Day tabs */}
      <div style={{ display: "flex", gap: 3, marginBottom: 8, overflowX: "auto", paddingBottom: 4 }}>
        {DAYS.map(d => (
          <button key={d} onClick={() => { setSelDay(d); setView("day"); }} style={{
            padding: "6px 8px", borderRadius: 4, flexShrink: 0, fontFamily: "inherit",
            border: view === "day" && d === selDay ? "2px solid #fff" : "1px solid #282828",
            background: view === "day" && d === selDay ? "#222" : "transparent",
            color: view === "day" && d === selDay ? "#fff" : "#666", fontWeight: 700, fontSize: 10, cursor: "pointer",
          }}>
            {d.slice(0, 3)}
            {dPct(d) > 0 && <span style={{ color: pc(dPct(d)), fontSize: 9, marginLeft: 3 }}>{dPct(d)}%</span>}
          </button>
        ))}
      </div>

      {/* DAY VIEW */}
      {view === "day" && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{selDay}</div>
            <button onClick={() => uncheckDay(selDay)} style={{ fontSize: 10, color: "#888", background: "transparent", border: "1px solid #333", borderRadius: 4, padding: "3px 8px", cursor: "pointer", fontFamily: "inherit" }}>Décocher</button>
          </div>
          <div style={{ background: "#1a1a1a", borderRadius: 6, padding: "6px 10px", marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
              <span style={{ color: "#888" }}>{dDone(selDay)}/{dLen(selDay)}</span>
              <span style={{ fontWeight: 800, color: pc(dPct(selDay)) }}>{dPct(selDay)}%</span>
            </div>
            <div style={{ height: 4, background: "#222", borderRadius: 2, overflow: "hidden", marginTop: 3 }}>
              <div style={{ height: "100%", width: `${dPct(selDay)}%`, background: pc(dPct(selDay)), transition: "width 0.3s" }} />
            </div>
          </div>

          {week[selDay].map((slot, i) => {
            const done = checked[`${selDay}-${i}`];
            const col = CAT_COLORS[slot.cat] || "#555";
            const isEd = editing?.day === selDay && editing?.idx === i;
            const dead = slot.note.includes("⚠️");
            const empty = !slot.note;

            return (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: 6, padding: "7px 8px", marginBottom: 2,
                borderRadius: 4, borderLeft: `3px solid ${col}`,
                background: done ? "#141414" : "#181818", opacity: done ? 0.4 : 1,
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#555", width: 40, flexShrink: 0, paddingTop: 1 }}>{slot.t}</div>
                <div onClick={(e) => { e.stopPropagation(); toggle(selDay, i); }} style={{
                  width: 18, height: 18, borderRadius: 3, flexShrink: 0, cursor: "pointer", marginTop: 1,
                  border: done ? "2px solid #1db954" : "2px solid #383838",
                  background: done ? "#1db954" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff", fontWeight: 800,
                }}>{done ? "✓" : ""}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {isEd ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <input value={editNote} onChange={e => setEditNote(e.target.value)} autoFocus placeholder="Tâche..."
                        style={{ background: "#111", border: "1px solid #333", color: "#fff", padding: "5px 8px", borderRadius: 4, fontSize: 12, fontFamily: "inherit", width: "100%" }} />
                      <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                        {Object.entries(CAT_LABELS).map(([k, l]) => (
                          <button key={k} onClick={() => setEditCat(k)} style={{
                            padding: "2px 7px", borderRadius: 3, fontSize: 9, fontFamily: "inherit", cursor: "pointer",
                            background: editCat === k ? CAT_COLORS[k] : "transparent",
                            border: `1px solid ${CAT_COLORS[k]}`, color: editCat === k ? "#fff" : CAT_COLORS[k],
                          }}>{l}</button>
                        ))}
                      </div>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button onClick={saveEdit} style={{ padding: "4px 12px", borderRadius: 3, fontSize: 11, background: "#1db954", border: "none", color: "#fff", cursor: "pointer", fontWeight: 700, fontFamily: "inherit" }}>OK</button>
                        <button onClick={() => setEditing(null)} style={{ padding: "4px 12px", borderRadius: 3, fontSize: 11, background: "transparent", border: "1px solid #444", color: "#888", cursor: "pointer", fontFamily: "inherit" }}>Annuler</button>
                      </div>
                    </div>
                  ) : (
                    <div onClick={() => startEdit(selDay, i)} style={{ cursor: "pointer", minHeight: 20 }}>
                      <div style={{
                        fontSize: 12, lineHeight: 1.4, textDecoration: done ? "line-through" : "none",
                        color: empty ? "#444" : dead ? "#ff4444" : "#ddd",
                        fontWeight: dead ? 800 : 400, fontStyle: empty ? "italic" : "normal",
                      }}>{empty ? "Case libre — clique pour remplir" : slot.note}</div>
                      {!empty && <div style={{ fontSize: 9, color: col, marginTop: 2, fontWeight: 600 }}>{CAT_LABELS[slot.cat]}</div>}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </>
      )}

      {/* WEEK VIEW */}
      {view === "week" && (
        <div style={{ overflowX: "auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "42px repeat(7, 1fr)", gap: 1, minWidth: 650, fontSize: 9 }}>
            <div style={{ background: "#111" }} />
            {DAYS.map(d => (
              <div key={d} onClick={() => { setSelDay(d); setView("day"); }} style={{
                padding: 4, background: "#1a1a1a", fontWeight: 700, textAlign: "center", color: "#fff", cursor: "pointer", fontSize: 10,
              }}>
                {d.slice(0, 3)}
                <div style={{ color: pc(dPct(d)), fontSize: 8, marginTop: 1 }}>{dPct(d)}%</div>
              </div>
            ))}
            {(() => {
              const mx = Math.max(...DAYS.map(d => week[d].length));
              return Array.from({ length: mx }).map((_, r) => (
                <React.Fragment key={r}>
                  <div style={{ padding: "3px 2px", background: "#151515", color: "#555", fontWeight: 700, fontSize: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {week[DAYS[0]][r]?.t || ""}
                  </div>
                  {DAYS.map(d => {
                    const s = week[d][r];
                    if (!s) return <div key={d} style={{ background: "#111" }} />;
                    const dn = checked[`${d}-${r}`];
                    return (
                      <div key={d} onClick={() => toggle(d, r)} style={{
                        padding: "3px 3px", borderLeft: `2px solid ${CAT_COLORS[s.cat] || "#555"}`,
                        background: dn ? "#111" : "#161616", cursor: "pointer", opacity: dn ? 0.3 : 1,
                        textDecoration: dn ? "line-through" : "none", color: s.note ? "#bbb" : "#333",
                        lineHeight: 1.3, minHeight: 24, fontStyle: s.note ? "normal" : "italic",
                      }}>
                        {s.note ? (s.note.length > 28 ? s.note.slice(0, 28) + "…" : s.note) : "—"}
                      </div>
                    );
                  })}
                </React.Fragment>
              ));
            })()}
          </div>
        </div>
      )}

      {/* Reminders */}
      <div style={{ marginTop: 12 }}>
        <button onClick={() => setShowTips(!showTips)} style={{
          width: "100%", padding: 8, background: "#1a1a1a", border: "1px solid #282828",
          borderRadius: 6, color: "#f5c242", fontWeight: 700, fontSize: 11, cursor: "pointer", fontFamily: "inherit", textAlign: "left",
        }}>{showTips ? "▼" : "▶"} 💡 RAPPELS</button>
        {showTips && (
          <div style={{ padding: "8px 12px", background: "#1a1a1a", borderRadius: "0 0 6px 6px", fontSize: 11, color: "#888", lineHeight: 2 }}>
            📨 Plans VIP Telegram → jours ouvrables à 20h<br />
            📱 5 shorts minimum / jour (IG + TikTok + YT Shorts)<br />
            ⚠️ Ebook ManyChat → LUNDI AVANT 17H<br />
            🏋️ Sport → Mardi, Mercredi, Jeudi (samedi rattrapage)<br />
            🔴 Lives 21h30 = ouverture session US<br />
            🎥 Série YT = 7 segments sur la semaine<br />
            📢 Broadcasts ManyChat → Lundi, Mercredi, Vendredi<br />
            🕌 Vendredi après Jumu'ah = OFF
          </div>
        )}
      </div>

      {/* Legend */}
      <div style={{ marginTop: 8, padding: "8px 10px", background: "#1a1a1a", borderRadius: 6, display: "flex", flexWrap: "wrap", gap: 6 }}>
        {Object.entries(CAT_LABELS).map(([k, l]) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 9, color: "#888" }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: CAT_COLORS[k] }} />
            {l}
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: 12, fontSize: 9, color: "#333" }}>
        Synchro cloud {synced ? "✓" : "⏳"}
      </div>
    </div>
  );
}

function tb(a) {
  return {
    padding: "5px 12px", borderRadius: 4, border: a ? "1px solid #fff" : "1px solid #333",
    background: a ? "#fff" : "transparent", color: a ? "#111" : "#888",
    fontWeight: 700, fontSize: 11, cursor: "pointer", fontFamily: "inherit",
  };
}
