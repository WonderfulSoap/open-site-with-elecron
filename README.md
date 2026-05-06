# open-site-with-electron

A minimal Electron wrapper that opens a URL passed as a command-line argument.

## Usage

```
OpenSiteWithElectron <url> [--singleton]
```

- `<url>` — HTTP/HTTPS URL to open. Falls back to `https://example.com` if omitted or invalid.
- `--singleton` — Enforce a single instance. If a second instance is launched, the URL is forwarded to the existing window instead of opening a new one.

**Examples**

```bash
# Open a URL
OpenSiteWithElectron https://github.com

# Open a URL, single-instance mode
OpenSiteWithElectron https://github.com --singleton
```

## Build

Prerequisites: Node.js (see `.nvmrc` for the required version) and npm.

```bash
npm install
```

| Command | Output |
|---------|--------|
| `npm run build:linux` | Linux AppImage (x64) in `dist/` |
| `npm run build:win`   | Windows NSIS installer (x64) in `dist/` |

To build for all platforms and architectures, push a tag in the form `release/x.y.z`.  
GitHub Actions will produce single-file executables for every target and attach them to a GitHub Release:

| Platform | Format | Architectures |
|----------|--------|---------------|
| Linux | AppImage | x64, arm64, armv7l |
| Windows | Portable .exe | x64, ia32, arm64 |
