import React, { useState, useEffect, useContext, createContext, useRef } from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";

/* ---------- CONFIG ---------- */
const API = "https://cybix-v3-3.onrender.com"; // Removed trailing space
const ICONS = {
  whatsapp: <i className="ti ti-brand-whatsapp" />,
  telegram: <i className="ti ti-brand-telegram" />,
  youtube: <i className="ti ti-brand-youtube" />,
  bot: <i className="ti ti-robot" />,
  eye: <i className="ti ti-eye" />,
  eyeOff: <i className="ti ti-eye-off" />,
  copy: <i className="ti ti-copy" />,
  check: <i className="ti ti-check" />, // Added check icon
  upload: <i className="ti ti-upload" />, // Added upload icon
  file: <i className="ti ti-file" />, // Added file icon
};
const AuthCtx = createContext(null);

/* ---------- HELPERS ---------- */
const api = (url, data, token) =>
  axios.post(API + url, data, { headers: { Authorization: `Bearer ${token}` } });

// Simple Toast Notification Hook
const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => { // type: 'info', 'success', 'error'
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    // Auto remove after 5 seconds
    setTimeout(() => {
       setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id === id));
  };

  return { toasts, addToast, removeToast };
};

const ToastContainer = ({ toasts, onRemove }) => (
  <div style={{
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  }}>
    {toasts.map(toast => (
      <div key={toast.id} className={`notification ${toast.type}`} style={{ minWidth: '250px' }}>
        <span>{toast.message}</span>
        <button onClick={() => onRemove(toast.id)} style={{
          background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontWeight: 'bold'
        }}>×</button>
      </div>
    ))}
  </div>
);

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
const PasswordInput = ({ value, onChange, placeholder, id }) => { // Added id prop
  const [show, setShow] = useState(false);
  return (
    <div className="form-group" style={{ position: 'relative' }}> {/* Relative for absolute button */}
      <input
        id={id} // Associate label with input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        className="form-input"
      />
      <button
        type="button"
        className="btn btn-sm" // Styled as a small button
        onClick={() => setShow(s => !s)}
        style={{ position: 'absolute', right: '10px', top: '38px', background: 'transparent', border: 'none', color: 'var(--color-text-secondary)' }}
        aria-label={show ? "Hide password" : "Show password"} // Accessibility
      >
        {show ? ICONS.eyeOff : ICONS.eye}
      </button>
    </div>
  );
};

/* ---------- LOGIN FORM ---------- */
const LoginForm = ({ onLogin, toast, onSwitchToSignup }) => { // Added onSwitchToSignup prop
  const [id, setId] = useState("");
  const [pwd, setPwd] = useState("");
  const [robot, setRobot] = useState(false);
  const [load, setLoad] = useState(false);

  const submit = async e => {
    e.preventDefault();
    if (!robot) {
        toast.addToast("Please confirm you are not a robot.", "error");
        return;
    }
    setLoad(true);
    try {
      const { data } = await axios.post(API + "/user/login", { identifier: id, password: pwd });
      toast.addToast("Login successful!", "success");
      onLogin(data.token, data.user);
    } catch (e) {
      const errorMsg = e.response?.data?.error || "Login failed. Please try again.";
      toast.addToast(errorMsg, "error");
    }
    setLoad(false);
  };

  return (
    <div className="card"> {/* Wrap in card */}
        <div className="card-header">
            <h2 className="card-title">Welcome Back</h2>
            <p className="card-subtitle">Log in to your CYBIX TECH account.</p>
        </div>
        <form onSubmit={submit} className="form">
            <div className="form-group">
                <label htmlFor="login-identifier" className="form-label">Username or Email</label>
                <input
                id="login-identifier"
                type="text"
                placeholder="e.g., john_doe or john@example.com"
                value={id}
                onChange={e => setId(e.target.value)}
                required
                className="form-input"
                />
            </div>
            <div className="form-group">
                <label htmlFor="login-password" className="form-label">Password</label>
                <PasswordInput id="login-password" value={pwd} onChange={e => setPwd(e.target.value)} placeholder="Your password" />
            </div>
            <div className="form-group">
                <label className="form-checkbox-group">
                <input type="checkbox" checked={robot} onChange={e => setRobot(e.target.checked)} className="form-checkbox" required />
                <span>I am not a robot</span>
                </label>
            </div>
            <button className="btn btn-primary btn-block" disabled={load}>
                {load ? <div className="loader" /> : "Login"}
            </button>
            <div style={{ textAlign: 'center', marginTop: 'var(--spacing-sm)' }}>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-xs)' }}>Don't have an account?</p>
                <button type="button" className="btn-nav" onClick={onSwitchToSignup}> {/* Navigation Button */}
                    Sign Up for CYBIX TECH
                </button>
            </div>
        </form>
    </div>
  );
};

/* ---------- SIGNUP FORM ---------- */
const SignupForm = ({ onLogin, toast, onSwitchToLogin }) => { // Added onSwitchToLogin prop
  const [name, setName] = useState("");
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [cp, setCp] = useState("");
  const [code, setCode] = useState("");
  const [robot, setRobot] = useState(false);
  const [load, setLoad] = useState(false);

  const submit = async e => {
    e.preventDefault();
    if (!robot) {
        toast.addToast("Please confirm you are not a robot.", "error");
        return;
    }
    if (pwd !== cp) {
        toast.addToast("Passwords do not match.", "error");
        return;
    }
    setLoad(true);
    try {
      const { data } = await axios.post(API + "/user/signup", { name, username: user, email, password: pwd, code });
      toast.addToast("Account created successfully! Redirecting...", "success");
      setTimeout(() => onLogin(data.token, data.user), 1500); // Slightly longer for success message
    } catch (e) {
      const errorMsg = e.response?.data?.error || "Signup failed. Please try again.";
      toast.addToast(errorMsg, "error");
    }
    setLoad(false);
  };

  return (
    <div className="card"> {/* Wrap in card */}
      <div className="card-header">
        <h2 className="card-title">Create Account</h2>
        <p className="card-subtitle">Join CYBIX TECH to start obfuscating your code.</p>
      </div>
      <form onSubmit={submit} className="form">
        <div className="form-group">
          <label htmlFor="signup-name" className="form-label">Full Name</label>
          <input
            id="signup-name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="signup-username" className="form-label">Username</label>
          <input
            id="signup-username"
            type="text"
            placeholder="john_doe"
            value={user}
            onChange={e => setUser(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="signup-email" className="form-label">Email Address</label>
          <input
            id="signup-email"
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="signup-password" className="form-label">Password</label>
          <PasswordInput id="signup-password" value={pwd} onChange={e => setPwd(e.target.value)} placeholder="Create a strong password" />
        </div>
        <div className="form-group">
          <label htmlFor="signup-confirm-password" className="form-label">Confirm Password</label>
          <PasswordInput id="signup-confirm-password" value={cp} onChange={e => setCp(e.target.value)} placeholder="Confirm your password" />
        </div>
        <div className="form-group">
          <label className="form-checkbox-group">
            <input type="checkbox" checked={robot} onChange={e => setRobot(e.target.checked)} className="form-checkbox" required />
            <span>I am not a robot</span>
          </label>
        </div>
        <div className="form-group">
          <label htmlFor="signup-code" className="form-label">Telegram Verification Code</label>
          <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
            <input
              id="signup-code"
              type="text"
              placeholder="Get code from our Telegram bot"
              value={code}
              onChange={e => setCode(e.target.value)}
              required
              className="form-input"
              style={{ flexGrow: 1 }}
            />
            <a className="btn btn-outline btn-sm" href="https://t.me/cybixwebsite_bot" target="_blank" rel="noreferrer" style={{ flexShrink: 0 }}> {/* Prevent button from shrinking */}
              {ICONS.bot} Get Code
            </a>
          </div>
        </div>
        <button className="btn btn-primary btn-block" disabled={load}>
          {load ? <div className="loader" /> : "Sign Up"}
        </button>
        <div style={{ textAlign: 'center', marginTop: 'var(--spacing-sm)' }}>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-xs)' }}>Already have an account?</p>
            <button type="button" className="btn-nav" onClick={onSwitchToLogin}> {/* Navigation Button */}
                Log in to your account
            </button>
        </div>
      </form>
    </div>
  );
};

/* ---------- OBFUSCATE PANEL ---------- */
const ObfuscatePanel = ({ token, toast }) => {
  const [code, setCode] = useState("");
  const [lang, setLang] = useState("");
  const [type, setType] = useState("default");
  const [reps, setReps] = useState(1);
  const [result, setResult] = useState("");
  const [load, setLoad] = useState(false);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef(null); // Ref for textarea focus

  useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.focus();
    }
  }, []); // Focus on load

  const run = async e => {
    e.preventDefault();
    setResult(""); setLoad(true);
    if (!code.trim()) {
        toast.addToast("Please enter code to obfuscate.", "error");
        setLoad(false);
        return;
    }
    if (!lang) {
         toast.addToast("Please select a language.", "error");
        setLoad(false);
        return;
    }
    try {
      const { data } = await api("/code/obfuscate", { code, lang, type, repeats: reps }, token);
      setResult(data.result);
      toast.addToast("Code obfuscated successfully!", "success");
    } catch (e) {
      const errorMsg = e.response?.data?.error || "Error occurred during obfuscation.";
      toast.addToast(errorMsg, "error");
    }
    setLoad(false);
  };

  const copy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result)
      .then(() => {
        setCopied(true);
        toast.addToast("Copied to clipboard!", "success");
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
         toast.addToast("Failed to copy.", "error");
      });
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Obfuscate Code</h2>
        <p className="card-subtitle">Paste your code, select options, and get it obfuscated.</p>
      </div>
      <form onSubmit={run} className="form">
        <div className="form-group">
          <label htmlFor="code-input" className="form-label">Your Code</label>
          <textarea
            ref={textareaRef} // Attach ref
            id="code-input"
            rows={8}
            placeholder={`// Paste your ${lang || 'code'} here...\nfunction example() {\n  console.log("Hello, world!");\n}`}
            value={code}
            onChange={e => setCode(e.target.value)}
            required
            className="form-textarea"
          />
        </div>
        <div className="form-group">
          <label htmlFor="language-select" className="form-label">Language</label>
          <select id="language-select" value={lang} onChange={e => setLang(e.target.value)} required className="form-select">
            <option value="">Select a language</option>
            {["javascript", "python", "html", "css", "react", "typescript", "java"].map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-sm)' }}>
            <div className="form-group">
              <label htmlFor="obfuscation-type" className="form-label">Type (Optional)</label>
              <input id="obfuscation-type" type="text" placeholder="default" value={type} onChange={e => setType(e.target.value)} className="form-input" />
            </div>
            <div className="form-group">
              <label htmlFor="repeats" className="form-label">Repeats (1-10)</label>
              <input id="repeats" type="number" min={1} max={10} value={reps} onChange={e => setReps(Number(e.target.value))} className="form-input" />
            </div>
        </div>
        <button className="btn btn-primary btn-block" disabled={load}>
          {load ? <div className="loader" /> : <>Obfuscate {ICONS.bot}</>}
        </button>
        {result && (
          <div className="form-group">
            <label className="form-label">Obfuscated Code</label>
            <div className="code-display-container">
                <pre className="code-display">{result}</pre>
                <button type="button" className="copy-btn" onClick={copy} aria-label="Copy result">
                    {copied ? ICONS.check : ICONS.copy}
                </button>
             </div>
          </div>
        )}
      </form>
    </div>
  );
};

/* ---------- ZIP PANEL ---------- */
const ZipObfuscatePanel = ({ token, toast }) => {
  const [file, setFile] = useState(null);
  const [drag, setDrag] = useState(false);
  const [load, setLoad] = useState(false);
  const fileInputRef = useRef(null); // Ref for hidden file input

  const onDragOver = (e) => {
    e.preventDefault();
    setDrag(true);
  };

  const onDragLeave = () => {
    setDrag(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/zip' || droppedFile.name.endsWith('.zip')) {
        setFile(droppedFile);
      } else {
        toast.addToast("Please drop a .zip file.", "error");
      }
    }
  };

  // Handle file selection via button click
  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file selection via input change
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
       if (selectedFile.type === 'application/zip' || selectedFile.name.endsWith('.zip')) {
        setFile(selectedFile);
      } else {
        toast.addToast("Please select a .zip file.", "error");
      }
    }
  };

  const upload = async e => {
    e.preventDefault();
    if (!file) {
        toast.addToast("Please select a ZIP file first.", "error");
        return;
    }
    setLoad(true);
    const fd = new FormData();
    fd.append("zip", file);
    try {
      const response = await axios.post(API + "/upload", fd, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob" // Important for downloading files
      });

      // Create a Blob URL and trigger download
      const blob = new Blob([response.data], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace('.zip', '_obfuscated.zip') || "obfuscated.zip"; // Suggest a name
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url); // Clean up

      toast.addToast("ZIP obfuscated and download started!", "success");
      setFile(null); // Clear file after successful upload
    } catch (e) {
      console.error("Upload Error:", e); // Log for debugging
      const errorMsg = e.response?.data?.text || e.response?.data || "Upload failed. Please ensure the file is valid and try again."; // Handle potential text error message
      toast.addToast(errorMsg, "error");
    }
    setLoad(false);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Obfuscate ZIP Archive</h2>
        <p className="card-subtitle">Upload a ZIP file containing your project for bulk obfuscation.</p>
      </div>
      <form onSubmit={upload} className="form">
        <div className="form-group">
          <label className="form-label">Select ZIP File</label>
          <div
            className={`drop-area ${drag ? 'active' : ''}`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={handleBrowseClick} // Clicking the area triggers file input
            style={{ cursor: 'pointer' }}
            role="button" // Accessibility
            tabIndex="0" // Accessibility
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleBrowseClick(); }} // Accessibility
          >
            <input
              type="file"
              accept=".zip"
              hidden
              onChange={handleFileChange}
              ref={fileInputRef} // Attach ref
            />
            {file ? (
              <p className="file-info"><i className="ti ti-file"></i> {file.name}</p>
            ) : (
              <>
                <p>{ICONS.upload} Drag & drop your ZIP file here</p>
                <p>or <span className="browse-link">browse files</span></p>
              </>
            )}
          </div>
        </div>
        <button className="btn btn-primary btn-block" disabled={load || !file}>
          {load ? <div className="loader" /> : <>Upload & Obfuscate {ICONS.upload}</>}
        </button>
      </form>
    </div>
  );
};

/* ---------- HOME ---------- */
const Home = ({ user, token, onLogout, toast }) => {
  const [tab, setTab] = useState("obfuscate");
  return (
    <>
      <header className="navbar">
        <div>
            <span className="nav-logo">CYBIX TECH</span>
            {user.premium && <span className="premium-badge" title="Premium User">★</span>}
        </div>
        <div className="nav-user-info">
            <span className="nav-username">Hi, {user.name}</span>
            <button className="btn btn-outline btn-sm" onClick={onLogout}>Logout</button>
        </div>
      </header>
      <div className="main-content">
        <div className="container">
            <div className="tabs">
                <button className={`tab-btn ${tab === "obfuscate" ? "active" : ""}`} onClick={() => setTab("obfuscate")}>Obfuscate Code</button>
                {user.premium && (
                <button className={`tab-btn ${tab === "zip" ? "active" : ""}`} onClick={() => setTab("zip")}>Obfuscate ZIP</button>
                )}
            </div>
            {tab === "obfuscate" && <ObfuscatePanel token={token} toast={toast} />}
            {tab === "zip" && user.premium && <ZipObfuscatePanel token={token} toast={toast} />}
        </div>
        <IconBar />
      </div>
    </>
  );
};

/* ---------- APP ---------- */
const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(token ? JSON.parse(localStorage.getItem("user") || "null") : null);
  const [currentView, setCurrentView] = useState('login'); // State to manage view
  const toast = useToast(); // Initialize toast hook

  const login = (tok, usr) => {
    localStorage.setItem("token", tok);
    localStorage.setItem("user", JSON.stringify(usr));
    setToken(tok); setUser(usr);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(""); setUser(null);
    setCurrentView('login'); // Reset view to login on logout
    toast.addToast("You have been logged out.", "info");
  };

  // Handler to switch to Signup view
  const handleSwitchToSignup = () => {
    setCurrentView('signup');
  };

  // Handler to switch to Login view
  const handleSwitchToLogin = () => {
    setCurrentView('login');
  };


  return (
    <AuthCtx.Provider value={{ token, user }}>
      <div className="app-shell">
        <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
        {!token ? (
          <>
            <div className="main-content">
                <div className="container">
                    {/* Conditionally render Login or Signup form */}
                    {currentView === 'login' && <LoginForm onLogin={login} toast={toast} onSwitchToSignup={handleSwitchToSignup} />}
                    {currentView === 'signup' && <SignupForm onLogin={login} toast={toast} onSwitchToLogin={handleSwitchToLogin} />}
                </div>
                <IconBar />
            </div>
            <div className="footer">© CYBIX TECH {new Date().getFullYear()}</div>
          </>
        ) : (
          <>
            <Home user={user} token={token} onLogout={logout} toast={toast} />
            <div className="footer">© CYBIX TECH {new Date().getFullYear()}</div>
          </>
        )}
      </div>
    </AuthCtx.Provider>
  );
};

/* ---------- MOUNT ---------- */
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
