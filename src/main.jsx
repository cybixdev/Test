import React, { useState, useEffect, useContext, createContext, lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";

/* ================== CONFIG ================== */
const API = "https://cybix-v3-3.onrender.com";
const ICONS = {
  whatsapp: <i className="ti ti-brand-whatsapp"/>,
  telegram: <i className="ti ti-brand-telegram"/>,
  youtube:  <i className="ti ti-brand-youtube"/>,
  bot:      <i className="ti ti-robot"/>,
  eye:      <i className="ti ti-eye"/>,
  eyeOff:   <i className="ti ti-eye-off"/>,
  copy:     <i className="ti ti-copy"/>
};

/* ================== AUTH CONTEXT ================== */
const AuthCtx = createContext(null);
const useAuth = () => useContext(AuthCtx);

/* ================== HELPERS ================== */
const api = (url, data, token) =>
  axios.post(API + url, data, { headers: { Authorization: `Bearer ${token}` } });

/* ================== ICON BAR ================== */
const IconBar = () => (
  <div className="ibar">
    <a className="ibtn" href="https://whatsapp.com/channel/0029VbB8svo65yD8WDtzwd0X" target="_blank" rel="noreferrer" title="WhatsApp">{ICONS.whatsapp}</a>
    <a className="ibtn" href="https://t.me/cybixtech" target="_blank" rel="noreferrer" title="Telegram">{ICONS.telegram}</a>
    <a className="ibtn" href="https://youtube.com/howtouse-cybixtech" target="_blank" rel="noreferrer" title="YouTube">{ICONS.youtube}</a>
    <a className="ibtn" href="https://t.me/cybixwebsite_bot" target="_blank" rel="noreferrer" title="Bot">{ICONS.bot}</a>
  </div>
);

/* ================== PASSWORD INPUT ================== */
const PasswordInput = ({ value, onChange, placeholder }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="form-group">
      <input type={show ? "text" : "password"} placeholder={placeholder} value={value} onChange={onChange} required/>
      <button type="button" className="reveal" onClick={() => setShow(s => !s)}>{show ? ICONS.eyeOff : ICONS.eye}</button>
    </div>
  );
};

/* ================== LOGIN FORM ================== */
const LoginTab = ({ onLogin }) => {
  const [id, setId] = useState("");
  const [pwd, setPwd] = useState("");
  const [robot, setRobot] = useState(false);
  const [err, setErr] = useState("");
  const [load, setLoad] = useState(false);

  const submit = async e => {
    e.preventDefault();
    if (!robot) return setErr("Please confirm you're not a robot.");
    setLoad(true);
    try {
      const { data } = await axios.post(API + "/user/login", { identifier: id, password: pwd });
      onLogin(data.token, data.user);
    } catch (e) {
      setErr(e.response?.data?.error || "Login failed");
    }
    setLoad(false);
  };

  return (
    <form onSubmit={submit}>
      <div className="form-group"><input placeholder="Username / Email" value={id} onChange={e => setId(e.target.value)} required/></div>
      <PasswordInput value={pwd} onChange={e => setPwd(e.target.value)} placeholder="Password"/>
      <label className="check-group"><input type="checkbox" checked={robot} onChange={e => setRobot(e.target.checked)}/>I am not a robot</label>
      <button className="btn" disabled={load}>{load ? <div className="loader"/> : "Login"}</button>
      {err && <div className="error">{err}</div>}
    </form>
  );
};

/* ================== SIGNUP FORM ================== */
const SignupTab = ({ onLogin }) => {
  const [name, setName] = useState("");
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [cp, setCp] = useState("");
  const [code, setCode] = useState("");
  const [robot, setRobot] = useState(false);
  const [err, setErr] = useState("");
  const [succ, setSucc] = useState("");
  const [load, setLoad] = useState(false);

  const submit = async e => {
    e.preventDefault();
    if (!robot) return setErr("Confirm you're not a robot.");
    if (pwd !== cp) return setErr("Passwords don't match.");
    setLoad(true);
    try {
      const { data } = await axios.post(API + "/user/signup", { name, username: user, email, password: pwd, code });
      setSucc("Account created! Redirecting…");
      setTimeout(() => onLogin(data.token, data.user), 1200);
    } catch (e) {
      setErr(e.response?.data?.error || "Signup failed");
    }
    setLoad(false);
  };

  return (
    <form onSubmit={submit}>
      <div className="form-group"><input placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required/></div>
      <div className="form-group"><input placeholder="Username" value={user} onChange={e => setUser(e.target.value)} required/></div>
      <div className="form-group"><input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required/></div>
      <PasswordInput value={pwd} onChange={e => setPwd(e.target.value)} placeholder="Password"/>
      <PasswordInput value={cp} onChange={e => setCp(e.target.value)} placeholder="Confirm Password"/>
      <label className="check-group"><input type="checkbox" checked={robot} onChange={e => setRobot(e.target.checked)}/>I am not a robot</label>
      <div className="form-group"><a className="btn btn-outline" href="https://t.me/cybixwebsite_bot" target="_blank" rel="noreferrer">Get Telegram Code</a></div>
      <div className="form-group"><input placeholder="Telegram Code" value={code} onChange={e => setCode(e.target.value)} required/></div>
      <button className="btn" disabled={load}>{load ? <div className="loader"/> : "Create Account"}</button>
      {err && <div className="error">{err}</div>}
      {succ && <div className="success">{succ}</div>}
    </form>
  );
};

/* ================== AUTH GATE ================== */
const AuthGate = ({ onLogin }) => {
  const [tab, setTab] = useState("login");
  return (
    <div className="viewport">
      <div className="card">
        <h1 className="title">CYBIX TECH</h1>
        <p className="subtitle">Next-Gen Code Obfuscation</p>
        <div className="tabs">
          <button className={`tab ${tab === "login" ? "active" : ""}`} onClick={() => setTab("login")}>Login</button>
          <button className={`tab ${tab === "signup" ? "active" : ""}`} onClick={() => setTab("signup")}>Sign Up</button>
        </div>
        {tab === "login" ? <LoginTab onLogin={onLogin}/> : <SignupTab onLogin={onLogin}/>}
      </div>
      <IconBar/>
    </div>
  );
};

/* ================== DASHBOARD ================== */
const Dashboard = ({ onLogout }) => {
  const { user, token } = useAuth();
  const [tab, setTab] = useState("obfuscate");

  return (
    <>
      <header className="navbar">
        <span className="nav-logo">CYBIX TECH</span>
        <button className="btn btn-outline" onClick={onLogout}>Logout</button>
      </header>
      <div className="viewport">
        <div className="card">
          <h2 className="title">Hi, {user.name} {user.premium && <span style={{ color: "var(--secondary)" }}>(Pro)</span>}</h2>
          <div className="tabs">
            <button className={`tab ${tab === "obfuscate" ? "active" : ""}`} onClick={() => setTab("obfuscate")}>Obfuscate Code</button>
            {user.premium && <button className={`tab ${tab === "zip" ? "active" : ""}`} onClick={() => setTab("zip")}>Obfuscate ZIP</button>}
          </div>
          {tab === "obfuscate" && <ObfuscatePanel/>}
          {tab === "zip" && user.premium && <ZipPanel/>}
        </div>
        <IconBar/>
      </div>
    </>
  );
};

/* ================== OBFUSCATE PANEL ================== */
const ObfuscatePanel = () => {
  const { token } = useAuth();
  const [code, setCode] = useState("");
  const [lang, setLang] = useState("");
  const [type, setType] = useState("default");
  const [reps, setReps] = useState(1);
  const [result, setResult] = useState("");
  const [err, setErr] = useState("");
  const [load, setLoad] = useState(false);
  const [copied, setCopied] = useState(false);

  const run = async e => {
    e.preventDefault();
    setErr(""); setResult(""); setLoad(true);
    try {
      const { data } = await api("/code/obfuscate", { code, lang, type, repeats: reps }, token);
      setResult(data.result);
    } catch (e) {
      setErr(e.response?.data?.error || "Error");
    }
    setLoad(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <form onSubmit={run}>
      <div className="form-group">
        <textarea rows={8} placeholder="Paste your code here…" value={code} onChange={e => setCode(e.target.value)} required/>
      </div>
      <div className="form-group">
        <select value={lang} onChange={e => setLang(e.target.value)} required>
          <option value="">Select language</option>
          {["javascript", "python", "html", "css", "react", "typescript", "java"].map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>
      <div className="form-group"><input placeholder="Obfuscation type" value={type} onChange={e => setType(e.target.value)}/></div>
      <div className="form-group"><input type="number" min={1} max={10} value={reps} onChange={e => setReps(Number(e.target.value))}/></div>
      <button className="btn" disabled={load}>{load ? <div className="loader"/> : "Obfuscate"}</button>
      {err && <div className="error">{err}</div>}
      {result && (
        <div className="form-group" style={{ position: "relative", marginTop: "1rem" }}>
          <textarea rows={6} value={result} readOnly/>
          <button type="button" className="reveal" onClick={copy}>{copied ? "✓" : ICONS.copy}</button>
        </div>
      )}
    </form>
  );
};

/* ================== ZIP PANEL ================== */
const ZipPanel = () => {
  const { token } = useAuth();
  const [file, setFile] = useState(null);
  const [drag, setDrag] = useState(false);
  const [err, setErr] = useState("");
  const [load, setLoad] = useState(false);

  const drop = e => {
    e.preventDefault();
    setDrag(false);
    if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
  };

  const upload = async e => {
    e.preventDefault();
    if (!file) return;
    setErr(""); setLoad(true);
    const fd = new FormData(); fd.append("zip", file);
    try {
      const { data } = await axios.post(API + "/upload", fd, { headers: { Authorization: `Bearer ${token}` }, responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([data]));
      const a = document.createElement("a"); a.href = url; a.download = "obfuscated.zip"; a.click(); a.remove();
    } catch (e) {
      setErr(e.response?.data?.error || "Upload failed");
    }
    setLoad(false);
  };

  return (
    <form onSubmit={upload}>
      <div
        className="form-group"
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={drop}
        style={{ border: `2px dashed ${drag ? "var(--secondary)" : "var(--primary)"}`, borderRadius: "var(--radius)", padding: "2rem 1rem", textAlign: "center" }}
      >
        {file ? <span>{file.name}</span> : <span>Drag & drop ZIP or <label style={{ cursor: "pointer", color: "var(--secondary)" }}><input type="file" accept=".zip" hidden onChange={e => setFile(e.target.files[0])}/>browse</label></span>}
      </div>
      <button className="btn" disabled={load}>{load ? <div className="loader"/> : "Obfuscate ZIP"}</button>
      {err && <div className="error">{err}</div>}
    </form>
  );
};

/* ================== APP SHELL ================== */
const App = () => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));

  const login = (tok, usr) => {
    localStorage.setItem("token", tok);
    localStorage.setItem("user", JSON.stringify(usr));
    setToken(tok); setUser(usr);
  };

  const logout = () => {
    localStorage.clear();
    setToken(""); setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ token, user }}>
      {!token ? <AuthGate onLogin={login}/> : <Dashboard onLogout={logout}/>}
    </AuthCtx.Provider>
  );
};

/* ================== MOUNT ================== */
ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
