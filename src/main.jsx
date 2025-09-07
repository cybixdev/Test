import React, { useState, useEffect, useContext, createContext } from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";

/* ---------- CONFIG ---------- */
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
const AuthCtx = createContext(null);

/* ---------- HELPERS ---------- */
const api = (url, data, token) =>
  axios.post(API + url, data, { headers: { Authorization: `Bearer ${token}` } });

/* ---------- ICON BAR ---------- */
const IconBar = () => (
  <div className="ibar">
    <a className="ibtn" href="https://whatsapp.com/channel/0029VbB8svo65yD8WDtzwd0X" target="_blank" rel="noreferrer" title="WhatsApp">{ICONS.whatsapp}</a>
    <a className="ibtn" href="https://t.me/cybixtech" target="_blank" rel="noreferrer" title="Telegram">{ICONS.telegram}</a>
    <a className="ibtn" href="https://youtube.com/howtouse-cybixtech" target="_blank" rel="noreferrer" title="YouTube">{ICONS.youtube}</a>
    <a className="ibtn" href="https://t.me/cybixwebsite_bot" target="_blank" rel="noreferrer" title="Bot">{ICONS.bot}</a>
  </div>
);

/* ---------- PASSWORD INPUT WITH TOGGLE ---------- */
const PasswordInput = ({ value, onChange, placeholder }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="form-group">
      <input type={show ? "text" : "password"} placeholder={placeholder} value={value} onChange={onChange} required/>
      <button type="button" className="reveal" onClick={() => setShow(s => !s)}>{show ? ICONS.eyeOff : ICONS.eye}</button>
    </div>
  );
};

/* ---------- LOGIN FORM ---------- */
const LoginForm = ({ onLogin }) => {
  const [id, setId] = useState("");
  const [pwd, setPwd] = useState("");
  const [robot, setRobot] = useState(false);
  const [err, setErr] = useState("");
  const [load, setLoad] = useState(false);

  const submit = async e => {
    e.preventDefault();
    if (!robot) return setErr("Confirm you're not a robot.");
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

/* ---------- SIGNUP FORM ---------- */
const SignupForm = ({ onLogin }) => {
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
      <button className="btn" disabled={load}>{load ? <div className="loader"/> : "Sign Up"}</button>
      {err && <div className="error">{err}</div>}
      {succ && <div className="success">{succ}</div>}
    </form>
  );
};

/* ---------- OBFUSCATE PANEL ---------- */
const ObfuscatePanel = ({ token }) => {
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
      <h3 style={{ marginBottom: ".7rem", color: "var(--primary)" }}>Obfuscate Code</h3>
      <div className="form-group"><textarea rows={7} placeholder="Paste your code here…" value={code} onChange={e => setCode(e.target.value)} required/></div>
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
          <textarea rows={5} value={result} readOnly/>
          <button type="button" className="copy-btn" onClick={copy}>{copied ? "✓" : ICONS.copy}</button>
        </div>
      )}
    </form>
  );
};

/* ---------- ZIP PANEL ---------- */
const ZipObfuscatePanel = ({ token }) => {
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
      <h3 style={{ marginBottom: ".7rem", color: "var(--primary)" }}>Obfuscate ZIP</h3>
      <div
        className="form-group"
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={drop}
        style={{ border: `2px dashed ${drag ? "var(--secondary)" : "var(--primary)"}`, borderRadius: "var(--radius)", padding: "2rem 1rem", textAlign: "center" }}
      >
        {file ? <span>{file.name}</span> : <span>Drag & drop ZIP or <label style={{ cursor: "pointer", color: "var(--secondary)" }}><input type="file" accept=".zip" hidden onChange={e => setFile(e.target.files[0])}/>browse</label></span>}
      </div>
      <button className="btn" disabled={load}>{load ? <div className="loader"/> : "Upload & Obfuscate"}</button>
      {err && <div className="error">{err}</div>}
    </form>
  );
};

/* ---------- HOME ---------- */
const Home = ({ user, token, onLogout }) => {
  const [tab, setTab] = useState("obfuscate");
  return (
    <>
      <header className="navbar">
        <span className="nav-logo">CYBIX TECH</span>
        <button className="btn" onClick={onLogout}>Logout</button>
      </header>
      <div className="container" style={{ marginTop: "2rem" }}>
        <div className="section-title">Hi, {user.name} {user.premium && <span style={{ color: "var(--primary)" }}>(Premium)</span>}</div>
        <div style={{ display: "flex", gap: ".5rem", marginBottom: "1.2rem" }}>
          <button className={`btn ${tab === "obfuscate" ? "" : "btn-outline"}`} style={{ width: "auto" }} onClick={() => setTab("obfuscate")}>Obfuscate Code</button>
          {user.premium && <button className={`btn ${tab === "zip" ? "" : "btn-outline"}`} style={{ width: "auto" }} onClick={() => setTab("zip")}>Obfuscate ZIP</button>}
        </div>
        {tab === "obfuscate" && <ObfuscatePanel token={token}/>}
        {tab === "zip" && user.premium && <ZipObfuscatePanel token={token}/>}
      </div>
      <IconBar/>
    </>
  );
};

/* ---------- APP ---------- */
const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(token ? JSON.parse(localStorage.getItem("user") || "null") : null);

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
    <div className="app-shell">
      {!token ? (
        <>
          <div className="container">
            <div className="section-title">CYBIX TECH</div>
            <p style={{ textAlign: "center", marginBottom: "1.2rem", color: "var(--muted)" }}>Obfuscate your code securely!<br/>Languages: JS, Python, HTML, CSS, React, TS, Java</p>
            <LoginForm onLogin={login}/>
            <p style={{ textAlign: "center", marginTop: "1rem" }}>
              <button className="btn btn-outline" style={{ width: "auto" }} onClick={() => window.location.href = "#signup"}>Need an account? Sign up</button>
            </p>
            <SignupForm onLogin={login}/>
            <IconBar/>
          </div>
          <div className="footer">© CYBIX TECH {new Date().getFullYear()}</div>
        </>
      ) : (
        <>
          <Home user={user} token={token} onLogout={logout}/>
          <div className="footer">© CYBIX TECH {new Date().getFullYear()}</div>
        </>
      )}
    </div>
  );
};

/* ---------- MOUNT ---------- */
ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
