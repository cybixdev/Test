import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";

// API and links
const API = "https://cybix-v3-3.onrender.com";
const WHATSAPP_CHANNEL = "https://whatsapp.com/channel/0029VbB8svo65yD8WDtzwd0X";
const TELEGRAM_CHANNEL = "https://t.me/cybixtech";
const YOUTUBE_LINK = "https://youtube.com/howtouse-cybixtech";
const BOT_LINK = "https://t.me/cybixwebsite_bot";

function ChannelBar() {
  return (
    <div className="channel-bar">
      <a className="channel-btn" href={WHATSAPP_CHANNEL} target="_blank" rel="noopener noreferrer">
        <span className="icon" role="img" aria-label="whatsapp">
          {/* WhatsApp SVG */}
          <svg width="22" height="22" viewBox="0 0 32 32">
            <circle fill="#25D366" cx="16" cy="16" r="16"/>
            <path fill="#FFF" d="M23.5 19.5c-.4-.2-2.1-1-2.4-1.1-.3-.1-.5-.2-.7.1-.2.2-.8 1.1-1 1.3-.2.2-.4.2-.7.1-.3-.1-1.3-.5-2.5-1.5-.9-.8-1.5-1.7-1.7-2-.2-.3 0-.5.1-.7.1-.1.2-.3.3-.4.1-.1.1-.2.2-.4.1-.2 0-.4-.1-.6-.1-.2-.7-1.7-1-2.3-.2-.5-.5-.4-.7-.4-.2 0-.4 0-.6 0-.2.1-.6.2-.9.6-.3.3-1.1 1.1-1.1 2.7s1.2 3.1 1.4 3.3c.2.2 2.5 3.9 6.2 5 3.6 1.1 3.6.7 4.3.6.7-.1 2.1-1.6 2.4-2.2.3-.6.2-1.1.1-1.2z"/>
          </svg>
        </span>
        WhatsApp
      </a>
      <a className="channel-btn" href={TELEGRAM_CHANNEL} target="_blank" rel="noopener noreferrer">
        <span className="icon" role="img" aria-label="telegram">
          {/* Telegram SVG */}
          <svg width="22" height="22" viewBox="0 0 32 32">
            <circle fill="#29b6f6" cx="16" cy="16" r="16"/>
            <polygon fill="#FFF" points="25,9 7,16 13,18 15,25 18,20 22,21"/>
          </svg>
        </span>
        Telegram
      </a>
      <a className="channel-btn" href={YOUTUBE_LINK} target="_blank" rel="noopener noreferrer">
        <span className="icon" role="img" aria-label="youtube">
          {/* YouTube SVG */}
          <svg width="22" height="22" viewBox="0 0 32 32">
            <circle fill="#FF0000" cx="16" cy="16" r="16"/>
            <polygon fill="#FFF" points="13,11 21,16 13,21"/>
          </svg>
        </span>
        YouTube
      </a>
      <a className="channel-btn" href={BOT_LINK} target="_blank" rel="noopener noreferrer">
        <span className="icon" role="img" aria-label="bot">
          {/* Bot SVG */}
          <svg width="22" height="22" viewBox="0 0 32 32">
            <circle fill="#00f3ff" cx="16" cy="16" r="16"/>
            <path fill="#fff" d="M10 22c0-3.3 2.7-6 6-6s6 2.7 6 6"/>
            <circle fill="#00ffae" cx="12" cy="14" r="2"/>
            <circle fill="#00ffae" cx="20" cy="14" r="2"/>
          </svg>
        </span>
        Bot
      </a>
    </div>
  );
}

function Navbar({ logged, onLogout }) {
  return (
    <div className="navbar">
      <span className="nav-logo">CYBIX TECH</span>
      <div className="nav-right">
        <a className="nav-btn" href="/terms" target="_blank" rel="noopener noreferrer">Terms</a>
        <a className="nav-btn" href="/privacy" target="_blank" rel="noopener noreferrer">Privacy</a>
        <button className="nav-btn" onClick={() => window.location.reload()}>Home</button>
        {logged ? <button className="nav-btn" onClick={onLogout}>Logout</button> : null}
      </div>
    </div>
  );
}

function Auth({ onLogin, onSignup }) {
  const [mode, setMode] = useState("login");
  return (
    <div className="container">
      <div className="section-title">Welcome to CYBIX TECH</div>
      <p style={{textAlign:"center", marginBottom:"1em"}}>Obfuscate your code securely! <br/>Languages: JavaScript, Python, HTML, CSS, React, TypeScript, Java</p>
      <ChannelBar />
      {mode === "login"
        ? <LoginForm onLogin={onLogin}/>
        : <SignupForm onSignup={onSignup}/>
      }
      <div style={{textAlign:"center", marginTop:"1em"}}>
        <button className="btn" style={{width: "auto"}} onClick={() => setMode(mode === "login" ? "signup" : "login")}>
          {mode === "login" ? "Need an account? Sign up" : "Already have an account? Log in"}
        </button>
      </div>
    </div>
  );
}

function LoginForm({ onLogin }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [robot, setRobot] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <form className="auth-form" onSubmit={async e => {
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
      <h2 style={{marginBottom:"0.6em"}}>Login</h2>
      <div className="form-group">
        <input
          autoFocus
          placeholder="Username / Name / Email"
          value={identifier}
          onChange={e => setIdentifier(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </div>
      <label className="checkbox-label">
        <input type="checkbox" checked={robot} onChange={e => setRobot(e.target.checked)} />
        I am not a robot
      </label>
      <input type="submit" className="btn" value={loading ? "Signing In..." : "Login"} disabled={loading}/>
      {loading && <div className="loading"></div>}
      {err && <div className="message">{err}</div>}
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
    <form className="auth-form" onSubmit={async e => {
      e.preventDefault();
      setErr(""); setSuccess("");
      if (!robot) return setErr("Please confirm you're not a robot.");
      if (password !== cpass) return setErr("Passwords do not match.");
      setLoading(true);
      try {
        const res = await axios.post(API + "/user/signup", { name, username, email, password, code });
        setLoading(false);
        setSuccess("Account created! Redirecting...");
        setTimeout(() => { onSignup(res.data.token, res.data.user); }, 1200);
      } catch (e) {
        setLoading(false);
        setErr(e.response?.data?.error || "Signup error");
      }
    }}>
      <h2 style={{marginBottom:"0.6em"}}>Sign Up</h2>
      <div className="form-group">
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required/>
      </div>
      <div className="form-group">
        <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required/>
      </div>
      <div className="form-group">
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required/>
      </div>
      <div className="form-group">
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required/>
      </div>
      <div className="form-group">
        <input type="password" placeholder="Confirm Password" value={cpass} onChange={e => setCpass(e.target.value)} required/>
      </div>
      <label className="checkbox-label">
        <input type="checkbox" checked={robot} onChange={e => setRobot(e.target.checked)} />
        I am not a robot
      </label>
      <div className="form-group" style={{marginBottom:"0.6em"}}>
        <a className="btn" href={BOT_LINK} target="_blank" rel="noopener noreferrer" style={{width:"100%"}}>
          Get Telegram Code
        </a>
      </div>
      <div className="form-group">
        <input placeholder="Enter Telegram code" value={code} onChange={e => setCode(e.target.value)} required/>
      </div>
      <input type="submit" className="btn" value={loading ? "Signing Up..." : "Sign Up"} disabled={loading}/>
      {loading && <div className="loading"></div>}
      {err && <div className="message">{err}</div>}
      {success && <div className="success">{success}</div>}
    </form>
  );
}

function ObfuscatePanel({ token }) {
  const [code, setCode] = useState("");
  const [lang, setLang] = useState("");
  const [type, setType] = useState("default");
  const [repeats, setRepeats] = useState(1);
  const [result, setResult] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  function handleObfuscate(e) {
    e.preventDefault();
    setErr(""); setResult(""); setLoading(true);
    axios.post(API + "/code/obfuscate", { code, lang, type, repeats }, { headers: { Authorization: "Bearer " + token } })
      .then(res => { setResult(res.data.result); setLoading(false); })
      .catch(e => { setErr(e.response?.data?.error || "Error"); setLoading(false); });
  }

  return (
    <form className="filebox" onSubmit={handleObfuscate}>
      <h3 style={{marginBottom:"0.7em"}}>Obfuscate Code</h3>
      <div className="form-group">
        <textarea rows="7" placeholder="Paste your code here..." value={code} onChange={e => setCode(e.target.value)} required />
      </div>
      <div className="form-group">
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
        <input placeholder="Obfuscation Type" value={type} onChange={e => setType(e.target.value)}/>
      </div>
      <div className="form-group">
        <input type="number" min="1" max="10" placeholder="Repeats" value={repeats} onChange={e => setRepeats(Number(e.target.value))}/>
      </div>
      <input type="submit" className="btn" value={loading ? "Obfuscating..." : "Obfuscate"} disabled={loading}/>
      {loading && <div className="loading"></div>}
      {err && <div className="message">{err}</div>}
      {result && <textarea rows="5" style={{width:"100%",marginTop:"1.1em"}} value={result} readOnly />}
    </form>
  );
}

function ZipObfuscatePanel({ token }) {
  const [file, setFile] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

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
      .catch(e => { setLoading(false); setErr(e.response?.data?.error || "Error uploading ZIP"); });
  }

  return (
    <form className="filebox" onSubmit={handleUpload}>
      <h3 style={{marginBottom:"0.7em"}}>Obfuscate ZIP of Code Files</h3>
      <input type="file" accept=".zip" onChange={e => setFile(e.target.files[0])} required />
      <input type="submit" className="btn" value={loading ? "Uploading..." : "Upload & Obfuscate"} disabled={loading}/>
      {loading && <div className="loading"></div>}
      {err && <div className="message">{err}</div>}
    </form>
  );
}

function Home({ user, token, onLogout }) {
  const [tab, setTab] = useState("obfuscate");
  return (
    <div className="container">
      <div className="section-title">
        Hi, {user.name} {user.premium && <span style={{color:"#00ffae"}}>(Premium)</span>}
      </div>
      <ChannelBar />
      <div style={{display:"flex",gap:"1em",justifyContent:"center",marginBottom:"1.2em"}}>
        <button className={tab==="obfuscate"?"btn":"nav-btn"} style={{width:"auto"}} onClick={()=>setTab("obfuscate")}>Obfuscate Code</button>
        {user.premium && <button className={tab==="zip"?"btn":"nav-btn"} style={{width:"auto"}} onClick={()=>setTab("zip")}>Obfuscate ZIP</button>}
      </div>
      {tab==="obfuscate" && <ObfuscatePanel token={token}/>}
      {tab==="zip" && user.premium && <ZipObfuscatePanel token={token}/>}
      <button className="btn" style={{marginTop:"2em"}} onClick={onLogout}>Logout</button>
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
    <div className="app-shell">
      <Navbar logged={!!token} onLogout={handleLogout}/>
      {!token
        ? <Auth onLogin={handleLogin} onSignup={handleLogin}/>
        : <Home user={user} token={token} onLogout={handleLogout}/>
      }
      <div className="footer">© CYBIX TECH {new Date().getFullYear()}</div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);