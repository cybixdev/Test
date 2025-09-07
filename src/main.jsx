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
  eyeOff:   <i className="ti ti-eye-off"/>
};
const AuthCtx = createContext(null);

/* ---------- HELPERS ---------- */
const api = (url,data,token)=>axios.post(API+url,data,{headers:{Authorization:`Bearer ${token}`}});
const useLocal = (k,def)=>{const[v,setV]=useState(()=>JSON.parse(localStorage.getItem(k))??def);useEffect(()=>localStorage.setItem(k,JSON.stringify(v)),[k,v]);return[v,setV];};

/* ---------- ICON BAR ---------- */
const IconBar = () => (
  <div className="icon-bar">
    <a className="icon-btn" href="https://whatsapp.com/channel/0029VbB8svo65yD8WDtzwd0X" target="_blank" rel="noreferrer" title="WhatsApp">{ICONS.whatsapp}</a>
    <a className="icon-btn" href="https://t.me/cybixtech" target="_blank" rel="noreferrer" title="Telegram">{ICONS.telegram}</a>
    <a className="icon-btn" href="https://youtube.com/howtouse-cybixtech" target="_blank" rel="noreferrer" title="YouTube">{ICONS.youtube}</a>
    <a className="icon-btn" href="https://t.me/cybixwebsite_bot" target="_blank" rel="noreferrer" title="Bot">{ICONS.bot}</a>
  </div>
);

/* ---------- PASSWORD INPUT WITH TOGGLE ---------- */
const PasswordInput = ({value,onChange,placeholder})=>{
  const[show,setShow]=useState(false);
  return(
    <div className="form-group" style={{position:"relative"}}>
      <input type={show?"text":"password"} placeholder={placeholder} value={value} onChange={onChange} required/>
      <button type="button" className="pwd-toggle" onClick={()=>setShow(s=>!s)}>{show?ICONS.eyeOff:ICONS.eye}</button>
    </div>
  );
};

/* ---------- NAVBAR ---------- */
const Navbar = ({onLogout}) => (
  <div className="navbar">
    <span className="nav-logo">CYBIX TECH</span>
    <button className="btn" onClick={onLogout}>Logout</button>
  </div>
);

/* ---------- LOGIN ---------- */
const LoginForm = ({onLogin}) => {
  const[id,setId]=useState("");const[pwd,setPwd]=useState("");const[robot,setRobot]=useState(false);const[err,setErr]=useState("");const[load,setLoad]=useState(false);
  const submit = async e => {
    e.preventDefault();setErr("");if(!robot)return setErr("Confirm you're not a robot.");
    setLoad(true);
    try{const{data}=await axios.post(API+"/user/login",{identifier:id,password:pwd});onLogin(data.token,data.user);}
    catch(e){setErr(e.response?.data?.error||"Login failed");}setLoad(false);
  };
  return(
    <form onSubmit={submit} className="container">
      <div className="section-title">Login</div>
      <div className="form-group"><input placeholder="Username / Email" value={id} onChange={e=>setId(e.target.value)} required/></div>
      <PasswordInput value={pwd} onChange={e=>setPwd(e.target.value)} placeholder="Password"/>
      <label className="checkbox-label"><input type="checkbox" checked={robot} onChange={e=>setRobot(e.target.checked)}/>I am not a robot</label>
      <button className="btn" disabled={load}>{load?"Signing In…":"Login"}</button>
      {err&&<div className="message">{err}</div>}
    </form>
  );
};

/* ---------- SIGNUP ---------- */
const SignupForm = ({onSignup}) => {
  const[name,setName]=useState("");const[user,setUser]=useState("");const[email,setEmail]=useState("");const[pwd,setPwd]=useState("");const[cp,setCp]=useState("");const[code,setCode]=useState("");const[robot,setRobot]=useState(false);const[err,setErr]=useState("");const[succ,setSucc]=useState("");const[load,setLoad]=useState(false);
  const submit = async e => {
    e.preventDefault();setErr("");setSucc("");if(!robot)return setErr("Confirm you're not a robot.");if(pwd!==cp)return setErr("Passwords don't match.");
    setLoad(true);
    try{const{data}=await axios.post(API+"/user/signup",{name,username:user,email,password:pwd,code});setSucc("Account created! Redirecting…");setTimeout(()=>onSignup(data.token,data.user),1200);}
    catch(e){setErr(e.response?.data?.error||"Signup failed");}setLoad(false);
  };
  return(
    <form onSubmit={submit} className="container">
      <div className="section-title">Create Account</div>
      <div className="form-group"><input placeholder="Full Name" value={name} onChange={e=>setName(e.target.value)} required/></div>
      <div className="form-group"><input placeholder="Username" value={user} onChange={e=>setUser(e.target.value)} required/></div>
      <div className="form-group"><input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required/></div>
      <PasswordInput value={pwd} onChange={e=>setPwd(e.target.value)} placeholder="Password"/>
      <PasswordInput value={cp} onChange={e=>setCp(e.target.value)} placeholder="Confirm Password"/>
      <label className="checkbox-label"><input type="checkbox" checked={robot} onChange={e=>setRobot(e.target.checked)}/>I am not a robot</label>
      <div className="form-group"><a className="btn" href="https://t.me/cybixwebsite_bot" target="_blank" rel="noreferrer">Get Telegram Code</a></div>
      <div className="form-group"><input placeholder="Telegram Code" value={code} onChange={e=>setCode(e.target.value)} required/></div>
      <button className="btn" disabled={load}>{load?"Signing Up…":"Sign Up"}</button>
      {err&&<div className="message">{err}</div>}
      {succ&&<div className="success">{succ}</div>}
    </form>
  );
};

/* ---------- OBFUSCATE ---------- */
const ObfuscatePanel = () => {
  const{token}=useContext(AuthCtx);const[code,setCode]=useState("");const[lang,setLang]=useState("");const[type,setType]=useState("default");const[reps,setReps]=useState(1);const[res,setRes]=useState("");const[err,setErr]=useState("");const[load,setLoad]=useState(false);
  const run = async e => {
    e.preventDefault();setErr("");setRes("");setLoad(true);
    try{const{data}=await api("/code/obfuscate",{code,lang,type,repeats:reps},token);setRes(data.result);}
    catch(e){setErr(e.response?.data?.error||"Error");}setLoad(false);
  };
  return(
    <form onSubmit={run} className="container">
      <h3 style={{marginBottom:".7em",color:"var(--primary)"}}>Obfuscate Code</h3>
      <div className="form-group"><textarea rows={7} placeholder="Paste code…" value={code} onChange={e=>setCode(e.target.value)} required/></div>
      <div className="form-group">
        <select value={lang} onChange={e=>setLang(e.target.value)} required>
          <option value="">Select language</option>
          {["javascript","python","html","css","react","typescript","java"].map(l=><option key={l} value={l}>{l}</option>)}
        </select>
      </div>
      <div className="form-group"><input placeholder="Obfuscation type" value={type} onChange={e=>setType(e.target.value)}/></div>
      <div className="form-group"><input type="number" min={1} max={10} value={reps} onChange={e=>setReps(Number(e.target.value))}/></div>
      <button className="btn" disabled={load}>{load?"Obfuscating…":"Obfuscate"}</button>
      {err&&<div className="message">{err}</div>}
      {res&&(
        <div style={{marginTop:"1em",position:"relative"}}>
          <textarea rows={5} value={res} readOnly/>
          <button type="button" className="pwd-toggle" onClick={()=>navigator.clipboard.writeText(res)}>📋</button>
        </div>
      )}
    </form>
  );
};

/* ---------- ZIP ---------- */
const ZipObfuscatePanel = () => {
  const{token}=useContext(AuthCtx);const[file,setFile]=useState(null);const[err,setErr]=useState("");const[load,setLoad]=useState(false);
  const upload = async e => {
    e.preventDefault();if(!file)return;setErr("");setLoad(true);
    const fd=new FormData();fd.append("zip",file);
    try{
      const{data}=await axios.post(API+"/upload",fd,{headers:{Authorization:`Bearer ${token}`},responseType:"blob"});
      const url=window.URL.createObjectURL(new Blob([data]));const a=document.createElement("a");a.href=url;a.download="obfuscated.zip";a.click();a.remove();
    }catch(e){setErr(e.response?.data?.error||"Upload failed");}setLoad(false);
  };
  return(
    <form onSubmit={upload} className="container">
      <h3 style={{marginBottom:".7em",color:"var(--primary)"}}>Obfuscate ZIP</h3>
      <input type="file" accept=".zip" onChange={e=>setFile(e.target.files[0])} required/>
      <button className="btn" disabled={load}>{load?"Uploading…":"Upload & Obfuscate"}</button>
      {err&&<div className="message">{err}</div>}
    </form>
  );
};

/* ---------- HOME ---------- */
const Home = ({onLogout}) => {
  const{user}=useContext(AuthCtx);const[tab,setTab]=useState("obfuscate");
  return(
    <>
      <Navbar onLogout={onLogout}/>
      <div className="container" style={{marginTop:"1.5rem"}}>
        <div className="section-title">Hi, {user.name} {user.premium&&<span style={{color:"var(--primary)"}}>(Premium)</span>}</div>
        <div style={{display:"flex",gap:".6rem",justifyContent:"center",marginBottom:"1.2rem"}}>
          <button className={tab==="obfuscate"?"btn":"btn"} style={{width:"auto",background:tab==="obfuscate"?"var(--primary)":"transparent",border:"1px solid var(--primary)"}} onClick={()=>setTab("obfuscate")}>Obfuscate Code</button>
          {user.premium&&<button className={tab==="zip"?"btn":"btn"} style={{width:"auto",background:tab==="zip"?"var(--primary)":"transparent",border:"1px solid var(--primary)"}} onClick={()=>setTab("zip")}>Obfuscate ZIP</button>}
        </div>
        {tab==="obfuscate"&&<ObfuscatePanel/>}
        {tab==="zip"&&user.premium&&<ZipObfuscatePanel/>}
      </div>
      <IconBar/>
    </>
  );
};

/* ---------- APP ---------- */
const App = () => {
  const[token,setToken]=useLocal("token","");const[user,setUser]=useLocal("user",null);
  const login = (tok,usr)=>{setToken(tok);setUser(usr);};
  const logout = ()=>{setToken("");setUser(null);window.location.reload();};
  if(!token)return(
    <div className="app-shell">
      <div className="container">
        <div className="section-title">CYBIX TECH</div>
        <p style={{textAlign:"center",marginBottom:"1.2rem",color:"var(--mute)"}}>Obfuscate your code securely!<br/>Languages: JS, Python, HTML, CSS, React, TS, Java</p>
        <LoginForm onLogin={login}/>
        <p style={{textAlign:"center",marginTop:"1rem"}}>
          <button className="btn" style={{width:"auto"}} onClick={()=>window.location.href="#signup"}>Need an account? Sign up</button>
        </p>
        <SignupForm onSignup={login}/>
      </div>
      <IconBar/>
      <div className="footer">© CYBIX TECH {new Date().getFullYear()}</div>
    </div>
  );
  return(
    <AuthCtx.Provider value={{token,user}}>
      <Home onLogout={logout}/>
      <div className="footer">© CYBIX TECH {new Date().getFullYear()}</div>
    </AuthCtx.Provider>
  );
};

/* ---------- MOUNT ---------- */
ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
