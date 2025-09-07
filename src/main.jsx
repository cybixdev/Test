import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";

const API = "https://cybix-v3-3.onrender.com";
const WHATSAPP_CHANNEL = "https://whatsapp.com/channel/0029VbB8svo65yD8WDtzwd0X";
const TELEGRAM_CHANNEL = "https://t.me/cybixtech";
const YOUTUBE_LINK = "https://youtube.com/howtouse-cybixtech";
const BOT_USERNAME = "@cybixwebsite_bot";
const BOT_LINK = "https://t.me/cybixwebsite_bot";

function Navbar({ logged, admin, onLogout }) {
  return (
    <div className="nav">
      <a href="/">CYBIX TECH</a>
      <div>
        <a href="/terms" target="_blank">Terms</a>
        <a href="/privacy" target="_blank">Privacy</a>
        <a href={BOT_LINK} target="_blank">{BOT_USERNAME}</a>
        {logged ? <button onClick={onLogout}>Logout</button> : null}
        {admin ? <a href="#admin">Admin Dashboard</a> : null}
      </div>
    </div>
  );
}

function Auth({ onLogin, onSignup }) {
  const [view, setView] = useState("login");
  return (
    <div className="container">
      <div style={{ textAlign: "center", marginBottom: "1em" }}>
        <h1>CYBIX TECH</h1>
        <p>Obfuscate/Deobfuscate: JS, Python, HTML, CSS, React, TypeScript, Java</p>
        <div className="channels">
          <a href={WHATSAPP_CHANNEL} target="_blank">WhatsApp Channel</a>
          <a href={TELEGRAM_CHANNEL} target="_blank">Telegram Channel</a>
          <a href={YOUTUBE_LINK} target="_blank">YouTube Guide</a>
          <a href={BOT_LINK} target="_blank">{BOT_USERNAME}</a>
        </div>
      </div>
      <div>
        {view === "login" ? <LoginForm onLogin={onLogin} /> : <SignupForm onSignup={onSignup} />}
        <div style={{ textAlign: "center", marginTop: "1em" }}>
          <button className="btn" onClick={() => setView(view === "login" ? "signup" : "login")}>
            {view === "login" ? "Need an account? Sign up" : "Already have an account? Log in"}
          </button>
        </div>
      </div>
    </div>
  );
}

function LoginForm({ onLogin }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [robot, setRobot] = useState(false);
  const [remember, setRemember] = useState(false);
  const [err, setErr] = useState("");
  return (
    <form onSubmit={async e => {
      e.preventDefault();
      setErr("");
      if (!robot) return setErr("Please confirm you're not a robot.");
      try {
        const res = await axios.post(API + "/user/login", { identifier, password });
        onLogin(res.data.token, res.data.user);
      } catch (e) {
        setErr(e.response?.data?.error || "Login error");
      }
    }}>
      <h2>Sign In</h2>
      <input placeholder="Username / Name / Email" value={identifier} onChange={e => setIdentifier(e.target.value)} required />
      <input type={show ? "text" : "password"} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
      <label><input type="checkbox" checked={show} onChange={e => setShow(e.target.checked)} /> Show password</label>
      <label><input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} /> Remember me</label>
      <label><input type="checkbox" checked={robot} onChange={e => setRobot(e.target.checked)} /> I am not a robot</label>
      <input type="submit" className="btn" value="Sign In"/>
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
  return (
    <form onSubmit={async e => {
      e.preventDefault();
      setErr("");
      if (!robot) return setErr("Please confirm you're not a robot.");
      if (password !== cpass) return setErr("Passwords do not match.");
      try {
        const res = await axios.post(API + "/user/signup", { name, username, email, password, code });
        onSignup(res.data.token, res.data.user);
      } catch (e) {
        setErr(e.response?.data?.error || "Signup error");
      }
    }}>
      <h2>Sign Up</h2>
      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
      <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
      <input type="password" placeholder="Confirm Password" value={cpass} onChange={e => setCpass(e.target.value)} required />
      <label><input type="checkbox" checked={robot} onChange={e => setRobot(e.target.checked)} /> I am not a robot</label>
      <div>
        <strong>Get your code from our Telegram bot:</strong>
        <a className="btn" href={BOT_LINK} target="_blank">Get Code ({BOT_USERNAME})</a>
      </div>
      <input placeholder="Enter Telegram code" value={code} onChange={e => setCode(e.target.value)} required />
      <input type="submit" className="btn" value="Sign Up"/>
      {err && <div className="error">{err}</div>}
    </form>
  );
}

function Home({ user, token, onLogout }) {
  const [tab, setTab] = useState("obfuscate");
  const [code, setCode] = useState("");
  const [lang, setLang] = useState("");
  const [type, setType] = useState("default");
  const [repeats, setRepeats] = useState(1);
  const [result, setResult] = useState("");
  const [err, setErr] = useState("");
  const [file, setFile] = useState(null);

  function handleObfuscate(e) {
    e.preventDefault();
    setErr(""); setResult("");
    axios.post(API + "/code/obfuscate", { code, lang, type, repeats }, { headers: { Authorization: "Bearer " + token } })
      .then(res => setResult(res.data.result))
      .catch(e => setErr(e.response?.data?.error || "Error"));
  }
  function handleDeobfuscate(e) {
    e.preventDefault();
    setErr(""); setResult("");
    axios.post(API + "/code/deobfuscate", { code, lang, type, repeats }, { headers: { Authorization: "Bearer " + token } })
      .then(res => setResult(res.data.result))
      .catch(e => setErr(e.response?.data?.error || "Error"));
  }
  function handleUpload(e) {
    e.preventDefault();
    setErr("");
    const form = new FormData();
    form.append("zip", file);
    axios.post(API + "/upload", form, { headers: { Authorization: "Bearer " + token }, responseType: "blob" })
      .then(res => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const a = document.createElement('a');
        a.href = url;
        a.download = "obfuscated.zip";
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch(e => setErr(e.response?.data?.error || "Error"));
  }

  return (
    <div className="container">
      <h2>Welcome, {user.name} {user.premium && <span style={{ color: "#0f0" }}>(Premium)</span>}</h2>
      <div className="channels">
        <a href={WHATSAPP_CHANNEL} target="_blank">WhatsApp Channel</a>
        <a href={TELEGRAM_CHANNEL} target="_blank">Telegram Channel</a>
        <a href={YOUTUBE_LINK} target="_blank">YouTube Guide</a>
        <a href={BOT_LINK} target="_blank">{BOT_USERNAME}</a>
      </div>
      <div style={{marginTop:"1em"}}>
        <button className="btn" onClick={() => setTab("obfuscate")}>Obfuscate</button>
        <button className="btn" onClick={() => setTab("deobfuscate")}>Deobfuscate</button>
        {user.premium && <button className="btn" onClick={() => setTab("upload")}>Upload ZIP</button>}
      </div>
      {tab === "obfuscate" || tab === "deobfuscate" ? (
        <form className="filebox" onSubmit={tab === "obfuscate" ? handleObfuscate : handleDeobfuscate}>
          <h3>{tab === "obfuscate" ? "Obfuscate" : "Deobfuscate"} Code</h3>
          <textarea rows="8" style={{width: "100%"}} value={code} onChange={e => setCode(e.target.value)} placeholder="Paste your code here..." required />
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
          <input placeholder="Obfuscation Type" value={type} onChange={e => setType(e.target.value)} />
          <input type="number" placeholder="Repeats" value={repeats} onChange={e => setRepeats(Number(e.target.value))} min="1" max="10" />
          <input type="submit" className="btn" value={tab === "obfuscate" ? "Obfuscate" : "Deobfuscate"} />
          {err && <div className="error">{err}</div>}
          {result && <textarea rows="6" style={{width:"100%"}} value={result} readOnly />}
        </form>
      ) : null}
      {tab === "upload" && user.premium ? (
        <form className="filebox" onSubmit={handleUpload}>
          <h3>Upload ZIP of code files</h3>
          <input type="file" accept=".zip" onChange={e => setFile(e.target.files[0])} required />
          <input type="submit" className="btn" value="Upload & Obfuscate" />
          {err && <div className="error">{err}</div>}
        </form>
      ) : null}
      <button className="btn" style={{marginTop:"2em"}} onClick={onLogout}>Logout</button>
    </div>
  );
}

function AdminDashboard({ token }) {
  const [data, setData] = useState(null);
  React.useEffect(() => {
    axios.get(API + "/admin/dashboard", { headers: { Authorization: "Bearer " + token } })
      .then(res => setData(res.data));
  }, [token]);
  if (!data) return <div className="container">Loading admin dashboard...</div>;
  return (
    <div className="container admin">
      <h2>Admin Dashboard</h2>
      <div>Registrations: {data.stats.registrations}</div>
      <div>Premium users: {data.premium}</div>
      <div>Year: {data.year}</div>
      <table style={{width:"100%",marginTop:"1em",color:"#0ff",background:"#111"}}>
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
      <div className="footer">© CYBIX TECH {new Date().getFullYear()}</div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);