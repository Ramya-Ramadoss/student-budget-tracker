// ─────────────────────────────────────────────────────────────────────────────
//  STUDENT BUDGET TRACKER
//  Architecture: React frontend + in-memory "backend" layer
//  To wire up a real Express backend, swap `api.*` calls with fetch() to your
//  /api/* routes. The server/ folder structure mirrors these exact endpoints.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useReducer, useMemo } from "react";

// ── MOCK BACKEND (swap this module for real fetch calls) ─────────────────────
const createId = () => Math.random().toString(36).slice(2, 9);

const SEED = [
  { id: createId(), label: "Rent",        amount: 450, category: "Housing",  type: "expense", date: "2026-03-01" },
  { id: createId(), label: "Groceries",   amount: 60,  category: "Food",     type: "expense", date: "2026-03-03" },
  { id: createId(), label: "Part-time job",amount: 300, category: "Income",  type: "income",  date: "2026-03-05" },
  { id: createId(), label: "Bus pass",    amount: 35,  category: "Transport",type: "expense", date: "2026-03-06" },
];

let store = { entries: [...SEED] };

const api = {
  getEntries:    ()      => Promise.resolve([...store.entries]),
  addEntry:      (entry) => { const e = { ...entry, id: createId() }; store.entries.unshift(e); return Promise.resolve(e); },
  deleteEntry:   (id)    => { store.entries = store.entries.filter(e => e.id !== id); return Promise.resolve(); },
};
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORIES = ["Food","Housing","Transport","Entertainment","Education","Health","Income","Other"];

const COLORS = {
  Food:"#f97316", Housing:"#6366f1", Transport:"#06b6d4",
  Entertainment:"#ec4899", Education:"#8b5cf6", Health:"#10b981",
  Income:"#22c55e", Other:"#94a3b8",
};

// ── REDUCER ──────────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case "SET":    return { ...state, entries: action.payload };
    case "ADD":    return { ...state, entries: [action.payload, ...state.entries] };
    case "DELETE": return { ...state, entries: state.entries.filter(e => e.id !== action.id) };
    default:       return state;
  }
}

// ── TINY COMPONENTS ──────────────────────────────────────────────────────────
function Badge({ cat }) {
  return (
    <span style={{
      background: (COLORS[cat] || "#94a3b8") + "22",
      color: COLORS[cat] || "#94a3b8",
      border: `1px solid ${(COLORS[cat] || "#94a3b8")}44`,
      borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 600,
      letterSpacing: ".5px", textTransform: "uppercase",
    }}>{cat}</span>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div style={{
      background: "#111318", border: "1px solid #1e2028",
      borderRadius: 12, padding: "18px 22px", flex: 1, minWidth: 130,
    }}>
      <div style={{ fontSize: 11, color: "#5a5f70", fontWeight: 600, letterSpacing: 1, textTransform:"uppercase", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: accent || "#e2e6f0", letterSpacing: "-0.5px" }}>{value}</div>
    </div>
  );
}

// ── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [state, dispatch] = useReducer(reducer, { entries: SEED });
  const [form, setForm] = useState({ label: "", amount: "", category: "Food", type: "expense", date: new Date().toISOString().slice(0,10) });
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const fmt = (n) => "£" + Number(n).toFixed(2);

  // ── Stats ──
  const { income, expenses, balance } = useMemo(() => {
    const income   = state.entries.filter(e => e.type === "income").reduce((s, e) => s + +e.amount, 0);
    const expenses = state.entries.filter(e => e.type === "expense").reduce((s, e) => s + +e.amount, 0);
    return { income, expenses, balance: income - expenses };
  }, [state.entries]);

  const visible = filter === "all" ? state.entries : state.entries.filter(e => e.type === filter);

  // ── Handlers ──
  const handleAdd = async () => {
    if (!form.label.trim()) return setErr("Add a label.");
    if (!form.amount || isNaN(form.amount) || +form.amount <= 0) return setErr("Enter a valid amount.");
    setErr(""); setLoading(true);
    const entry = await api.addEntry({ ...form, amount: parseFloat(form.amount) });
    dispatch({ type: "ADD", payload: entry });
    setForm(f => ({ ...f, label: "", amount: "" }));
    setLoading(false);
  };

  const handleDelete = async (id) => {
    await api.deleteEntry(id);
    dispatch({ type: "DELETE", id });
  };

  // ── Styles ──
  const input = {
    background: "#0d0f14", border: "1px solid #1e2028", borderRadius: 8,
    color: "#e2e6f0", padding: "9px 13px", fontSize: 14, outline: "none",
    fontFamily: "inherit", transition: "border .15s",
  };
  const btn = (bg, fg="#fff") => ({
    background: bg, color: fg, border: "none", borderRadius: 8,
    padding: "9px 18px", fontWeight: 700, fontSize: 13, cursor: "pointer",
    fontFamily: "inherit", letterSpacing: ".3px", transition: "opacity .15s",
  });

  return (
    <div style={{
      minHeight: "100vh", background: "#080a0f",
      fontFamily: "'DM Mono', 'Fira Code', 'Courier New', monospace",
      color: "#e2e6f0", padding: "0",
    }}>
      {/* Google font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        select option { background: #111318; }
        input:focus, select:focus { border-color: #6366f1 !important; }
        .row:hover { background: #111318 !important; }
        .delbtn:hover { opacity: 1 !important; }
        .addbtn:hover { opacity: .85; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1e2028; border-radius: 3px; }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: "1px solid #1a1d26", padding: "22px 32px", display:"flex", alignItems:"center", gap: 12 }}>
        <div style={{ fontSize: 22, fontFamily:"'Syne', sans-serif", fontWeight:800, letterSpacing:"-1px", color:"#fff" }}>
          budget<span style={{ color:"#6366f1" }}>.</span>track
        </div>
        <div style={{ marginLeft:"auto", fontSize:12, color:"#3a3f50" }}>student edition</div>
      </div>

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "28px 20px" }}>

        {/* Stats row */}
        <div style={{ display:"flex", gap:12, marginBottom: 28, flexWrap:"wrap" }}>
          <Stat label="Balance" value={fmt(balance)} accent={balance >= 0 ? "#22c55e" : "#ef4444"} />
          <Stat label="Income"  value={fmt(income)}  accent="#22c55e" />
          <Stat label="Spent"   value={fmt(expenses)} accent="#f97316" />
          <Stat label="Entries" value={state.entries.length} />
        </div>

        {/* Add form */}
        <div style={{
          background:"#111318", border:"1px solid #1e2028", borderRadius:14,
          padding:"20px", marginBottom:28,
        }}>
          <div style={{ fontSize:11, color:"#5a5f70", fontWeight:600, letterSpacing:1, textTransform:"uppercase", marginBottom:14 }}>
            + New Entry
          </div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            <input
              style={{ ...input, flex:2, minWidth:130 }}
              placeholder="Label (e.g. Coffee)"
              value={form.label}
              onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
              onKeyDown={e => e.key === "Enter" && handleAdd()}
            />
            <input
              style={{ ...input, width:110 }}
              placeholder="Amount"
              type="number" min="0" step="0.01"
              value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
              onKeyDown={e => e.key === "Enter" && handleAdd()}
            />
            <select
              style={{ ...input, width:130 }}
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            >
              {CATEGORIES.filter(c => c !== "Income").map(c => <option key={c}>{c}</option>)}
            </select>
            <select
              style={{ ...input, width:110 }}
              value={form.type}
              onChange={e => setForm(f => ({
                ...f, type: e.target.value,
                category: e.target.value === "income" ? "Income" : (f.category === "Income" ? "Food" : f.category)
              }))}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <input
              style={{ ...input, width:130 }}
              type="date"
              value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
            />
            <button
              className="addbtn"
              style={{ ...btn("#6366f1"), paddingLeft:22, paddingRight:22 }}
              onClick={handleAdd}
              disabled={loading}
            >
              {loading ? "..." : "Add"}
            </button>
          </div>
          {err && <div style={{ color:"#ef4444", fontSize:12, marginTop:10 }}>{err}</div>}
        </div>

        {/* Filter tabs */}
        <div style={{ display:"flex", gap:6, marginBottom:16 }}>
          {["all","expense","income"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f ? "#1e2028" : "transparent",
                border: `1px solid ${filter === f ? "#2e3245" : "#1a1d26"}`,
                borderRadius:8, padding:"6px 16px", fontSize:12, fontWeight:600,
                color: filter === f ? "#e2e6f0" : "#5a5f70",
                cursor:"pointer", fontFamily:"inherit", textTransform:"capitalize",
                letterSpacing:".5px",
              }}
            >{f}</button>
          ))}
          <span style={{ marginLeft:"auto", fontSize:12, color:"#3a3f50", alignSelf:"center" }}>
            {visible.length} entries
          </span>
        </div>

        {/* Entries list */}
        <div style={{ background:"#111318", border:"1px solid #1e2028", borderRadius:14, overflow:"hidden" }}>
          {visible.length === 0 && (
            <div style={{ padding:40, textAlign:"center", color:"#3a3f50", fontSize:13 }}>
              No entries yet. Add one above.
            </div>
          )}
          {visible.map((entry, i) => (
            <div
              key={entry.id}
              className="row"
              style={{
                display:"flex", alignItems:"center", gap:12,
                padding:"13px 18px",
                borderBottom: i < visible.length - 1 ? "1px solid #1a1d26" : "none",
                transition:"background .1s",
              }}
            >
              {/* Dot */}
              <div style={{
                width:8, height:8, borderRadius:"50%", flexShrink:0,
                background: entry.type === "income" ? "#22c55e" : "#ef4444",
              }} />

              {/* Label */}
              <div style={{ flex:1, fontSize:14, color:"#d4d8e8", fontWeight:500 }}>{entry.label}</div>

              {/* Category */}
              <Badge cat={entry.category} />

              {/* Date */}
              <div style={{ fontSize:11, color:"#3a3f50", minWidth:72, textAlign:"right" }}>
                {new Date(entry.date + "T00:00:00").toLocaleDateString("en-GB", { day:"numeric", month:"short" })}
              </div>

              {/* Amount */}
              <div style={{
                fontSize:15, fontWeight:700, minWidth:80, textAlign:"right",
                color: entry.type === "income" ? "#22c55e" : "#f1f5f9",
              }}>
                {entry.type === "income" ? "+" : "−"}{fmt(entry.amount)}
              </div>

              {/* Delete */}
              <button
                className="delbtn"
                onClick={() => handleDelete(entry.id)}
                style={{
                  background:"transparent", border:"none", cursor:"pointer",
                  color:"#3a3f50", fontSize:16, padding:"0 4px", opacity:.5,
                  transition:"opacity .15s, color .15s", lineHeight:1,
                }}
                title="Delete"
                onMouseEnter={e => { e.target.style.color="#ef4444"; e.target.style.opacity=1; }}
                onMouseLeave={e => { e.target.style.color="#3a3f50"; e.target.style.opacity=.5; }}
              >×</button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ textAlign:"center", marginTop:32, fontSize:11, color:"#2a2d38", letterSpacing:1 }}>
          SWAP api.* FOR fetch() TO CONNECT YOUR EXPRESS BACKEND
        </div>
      </div>
    </div>
  );
}
