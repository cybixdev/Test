import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import { obfuscateJS, deobfuscateJS } from "./obfuscate";
import { obfuscatePy, deobfuscatePy } from "./obfuscate";

const API = "https://cybix-v3-3.onrender.com";

function Navbar({ logged, admin, onLogout }) {
  return (
    <div className="nav">
      <div className="logo">CYBIX TECH</div>
      <div className="right">
        <a className="nav-btn" href="/terms" target="_blank">Terms</a>
        <a className="nav-btn" href="/privacy" target="_blank">Privacy</a>
        {logged && <button className="nav-btn" onClick={onLogout}>Logout</button>}
        {admin && <a className="nav-btn" href="#admin">Admin Dashboard</a>}
      </div>
    </div>
  );
}

// Simple code obfuscator for demo; use a real JS obfuscator in production
function obfuscateCode(code, lang) {
  if (lang === "javascript" || lang === "react" || lang === "typescript") {
    // Use a real JS obfuscator like javascript-obfuscator in production!
    return obfuscateJS(code);
  }
  if (lang === "python") {
    return obfuscatePy(code);
  }
  // For other languages do base64 for now
  return btoa(code);
}
function deobfuscateCode(code, lang) {
  if (lang === "javascript" || lang === "react" || lang === "typescript") {
    return deobfuscateJS(code);
  }
  if (lang === "python") {
    return deobfuscatePy(code);
  }
  // For other languages do base64 for now
  try { return atob(code); } catch { return code; }
}

function Auth({ onLogin, onSignup }) {
  const [view, setView] = useState("login");
  return (
    <div className="container">
      <div className="section-title">Welcome to CYBIX TECH</div>
      <p style={{textAlign:"center",marginBottom:"2em"}}>Obfuscate/Deobfuscate: JS, Python, HTML, CSS, React, TypeScript, Java</p>
      {view === "login" ? <LoginForm onLogin={onLogin} /> : <SignupForm onSignup={onSignup} />}
      <div style={{ textAlign: "center", marginTop: "1.2em" }}>
        <button className="btn" onClick={() => setView(view === "login" ? "signup" : "login")}>
          {view === "login" ? "Need an account? Sign up" : "Already have an account? Log in"}
        </button>
      </div>
    </div>
  );
}

function LoginForm({ onLogin }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [robot, setRobot] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  return (
    <form onSubmit={async e => {
      e.preventDefault();
      setErr("");
      if (!robot) return setErr("Please confirm you're not a robot.");
      setLoading(true);
      try {
        const res = await axios.post(API + "/user/login", { identifier, password });
        setLoading(false);
        onLogin(res.data.token, res.data.user);
      } catch (e) {
        setLoading(false);
        setErr(e.response?.data?.error || "Login error");
      }
    }}>
      <div className="form-group">
        <label>Username / Name / Email</label>
        <input value={identifier} onChange={e => setIdentifier(e.target.value)} required autoFocus />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input type={show ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required />
        <label style={{marginTop:"0.7em"}}><input type="checkbox" checked={show} onChange={e => setShow(e.target.checked)} /> Show password</label>
      </div>
      <label style={{marginBottom:"1em"}}><input type="checkbox" checked={robot} onChange={e => setRobot(e.target.checked)} /> I am not a robot</label>
      <input type="submit" className="btn" value={loading ? "Signing In..." : "Sign In"} disabled={loading} />
      {loading && <div className="loading"></div>}
      {err && <div className="error">{err}</div>}
    </form>
  );
}

function SignupForm({ onSignup }) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpass, setCpass] = useState("");
  const [robot, setRobot] = useState(false);
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <form onSubmit={async e => {
      e.preventDefault();
      setErr(""); setSuccess("");
      if (!robot) return setErr("Please confirm you're not a robot.");
      if (password !== cpass) return setErr("Passwords do not match.");
      setLoading(true);
      try {
        const res = await axios.post(API + "/user/signup", { name, username, email, password, code });
        setLoading(false);
        setSuccess("Account created! Redirecting...");
        setTimeout(() => { onSignup(res.data.token, res.data.user); }, 1300);
      } catch (e) {
        setLoading(false);
        setErr(e.response?.data?.error || "Signup error");
      }
    }}>
      <div className="form-group">
        <label>Name</label>
        <input value={name} onChange={e => setName(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Username</label>
        <input value={username} onChange={e => setUsername(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Confirm Password</label>
        <input type="password" value={cpass} onChange={e => setCpass(e.target.value)} required />
      </div>
      <label style={{marginBottom:"1em"}}><input type="checkbox" checked={robot} onChange={e => setRobot(e.target.checked)} /> I am not a robot</label>
      <div style={{marginBottom:"1em"}}>
        <strong>Get your code from our Telegram bot:</strong><br/>
        <a className="btn" href="https://t.me/cybixwebsite_bot" target="_blank">Get Code (@cybixwebsite_bot)</a>
      </div>
      <div className="form-group">
        <label>Telegram Code</label>
        <input value={code} onChange={e => setCode(e.target.value)} required />
      </div>
      <input type="submit" className="btn" value={loading ? "Signing Up..." : "Sign Up"} disabled={loading} />
      {loading && <div className="loading"></div>}
      {err && <div className="error">{err}</div>}
      {success && <div className="success">{success}</div>}
    </form>
  );
}

function Home({ user, token, onLogout }) {
  const [tab, setTab] = useState("obfuscate");
  const [code, setCode] = useState("");
  const [lang, setLang] = useState("");
  const [filename, setFilename] = useState("output.js");
  const [result, setResult] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  function handleObfuscate(e) {
    e.preventDefault();
    setErr(""); setResult(""); setLoading(true);
    // Real obfuscation in browser for JS/Py
    try {
      const obf = obfuscateCode(code, lang);
      setResult(obf);
      setLoading(false);
    } catch (e) {
      setErr("Obfuscation failed.");
      setLoading(false);
    }
  }
  function handleDeobfuscate(e) {
    e.preventDefault();
    setErr(""); setResult(""); setLoading(true);
    try {
      const deobf = deobfuscateCode(code, lang);
      setResult(deobf);
      setLoading(false);
    } catch (e) {
      setErr("Deobfuscation failed.");
      setLoading(false);
    }
  }
  function downloadResult() {
    const blob = new Blob([result], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || "output.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
  function handleUpload(e) {
    e.preventDefault();
    setErr(""); setLoading(true);
    const form = new FormData();
    form.append("zip", file);
    axios.post(API + "/upload", form, { headers: { Authorization: "Bearer " + token }, responseType: "blob" })
      .then(res => {
        setLoading(false);
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const a = document.createElement('a');
        a.href = url;
        a.download = "obfuscated.zip";
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch(e => { setLoading(false); setErr(e.response?.data?.error || "Error"); });
  }

  return (
    <div className="container">
      <div className="section-title">
        Welcome, {user.name} {user.premium && <span className="premium-badge">(Premium)</span>}
      </div>
      <div style={{marginTop:"1.3em",display:"flex",gap:"1em",justifyContent:"center"}}>
        <button className={tab==="obfuscate"?"btn":"nav-btn"} onClick={() => setTab("obfuscate")}>Obfuscate</button>
        <button className={tab==="deobfuscate"?"btn":"nav-btn"} onClick={() => setTab("deobfuscate")}>Deobfuscate</button>
        {user.premium && <button className={tab==="upload"?"btn":"nav-btn"} onClick={() => setTab("upload")}>Upload ZIP</button>}
      </div>
      {tab === "obfuscate" || tab === "deobfuscate" ? (
        <form className="filebox" onSubmit={tab === "obfuscate" ? handleObfuscate : handleDeobfuscate}>
          <h3>{tab === "obfuscate" ? "Obfuscate" : "Deobfuscate"} Code</h3>
          <div className="form-group">
            <label>Paste your code below</label>
            <textarea rows="8" value={code} onChange={e => setCode(e.target.value)} placeholder="Paste your code here..." required />
          </div>
          <div className="form-group">
            <label>Language</label>
            <select value={lang} onChange={e => setLang(e.target.value)} required>
              <option value="">Select language</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="react">React</option>
              <option value="typescript">TypeScript</option>
              <option value="java">Java</option>
            </select>
          </div>
          <div className="form-group">
            <label>File name for download</label>
            <input value={filename} onChange={e => setFilename(e.target.value)} placeholder="output.js" required />
          </div>
          <input type="submit" className="btn" value={tab === "obfuscate" ? "Obfuscate" : "Deobfuscate"} />
          {loading && <div className="loading"></div>}
          {err && <div className="error">{err}</div>}
          {result && <>
            <textarea rows="6" style={{width:"100%",marginTop:"1em"}} value={result} readOnly />
            <button className="download-btn" onClick={downloadResult}>Download as {filename || "output.txt"}</button>
          </>}
        </form>
      ) : null}
      {tab === "upload" && user.premium ? (
        <form className="filebox" onSubmit={handleUpload}>
          <h3>Upload ZIP of code files</h3>
          <input type="file" accept=".zip" onChange={e => setFile(e.target.files[0])} required />
          <input type="submit" className="btn" value={loading ? "Uploading..." : "Upload & Obfuscate"} disabled={loading} />
          {loading && <div className="loading"></div>}
          {err && <div className="error">{err}</div>}
        </form>
      ) : null}
      <button className="btn" style={{marginTop:"2em"}} onClick={onLogout}>Logout</button>
    </div>
  );
}

function AdminDashboard({ token }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  React.useEffect(() => {
    axios.get(API + "/admin/dashboard", { headers: { Authorization: "Bearer " + token } })
      .then(res => { setData(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);
  if (loading) return <div className="container"><div className="loading"></div></div>;
  if (!data) return <div className="container">Failed to load admin dashboard.</div>;
  return (
    <div className="dashboard-section">
      <h2>Admin Dashboard</h2>
      <div>Registrations: <b>{data.stats.registrations}</b></div>
      <div>Premium users: <b>{data.premium}</b></div>
      <div>Year: <b>{data.year}</b></div>
      <table>
        <thead>
          <tr><th>Name</th><th>Username</th><th>Email</th><th>Premium</th><th>Joined</th></tr>
        </thead>
        <tbody>
          {data.users.map(u => (
            <tr key={u.email}><td>{u.name}</td><td>{u.username}</td><td>{u.email}</td><td>{u.premium ? "Yes" : ""}</td><td>{u.created}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(token ? JSON.parse(localStorage.getItem("user")) : null);

  function handleLogin(tok, usr) {
    setToken(tok);
    setUser(usr);
    localStorage.setItem("token", tok);
    localStorage.setItem("user", JSON.stringify(usr));
  }
  function handleLogout() {
    setToken(""); setUser(null); localStorage.clear();
    window.location.reload();
  }

  return (
    <>
      <Navbar logged={!!token} admin={user?.admin} onLogout={handleLogout} />
      {!token ? (
        <Auth onLogin={handleLogin} onSignup={handleLogin} />
      ) : user?.admin ? (
        <>
          <Home user={user} token={token} onLogout={handleLogout} />
          <AdminDashboard token={token} />
        </>
      ) : (
        <Home user={user} token={token} onLogout={handleLogout} />
      )}
      <div className="footer">© CYBIX TECH {new Date().getFullYear()} | Developed by Jaden Afrix</div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);