// True JavaScript obfuscation using javascript-obfuscator (browser CDN)
export function obfuscateJS(code) {
  return window.JavascriptObfuscator.obfuscate(code, {
    compact: true,
    controlFlowFlattening: true,
    deadCodeInjection: true,
    stringArray: true,
    stringArrayEncoding: ['base64'],
    splitStrings: true,
    renameGlobals: true
  }).getObfuscatedCode();
}

// No true deobfuscation exists! We just show the obfuscated code.
export function deobfuscateJS(code) {
  // Optionally pretty-print, but cannot deobfuscate for real.
  return code;
}