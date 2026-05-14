/**
 * One-time setup script to authorize Google Drive access via OAuth2.
 * 
 * Run this ONCE:   node setup-auth.js
 * 
 * It will open a browser, ask you to sign in to Google, and save a
 * refresh token to `token.json` which the server uses for uploads.
 */

const { google } = require('googleapis');
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

// ──────────────────────────────────────────
// Fill in these values from Google Cloud Console
// ──────────────────────────────────────────
const CLIENT_ID     = '677178622822-bl2rd76ghao1hsvfsembjtgtr2s1f5pk.apps.googleusercontent.com';
const CLIENT_SECRET = process.argv[2] || '';       // Pass as argument: node setup-auth.js YOUR_CLIENT_SECRET
const REDIRECT_URI  = 'http://localhost:9876';
const SCOPES        = ['https://www.googleapis.com/auth/drive'];

if (!CLIENT_SECRET) {
    console.error('\n❌  Please provide your Client Secret as an argument:');
    console.error('    node setup-auth.js YOUR_CLIENT_SECRET\n');
    console.error('You can find it in Google Cloud Console → APIs & Services → Credentials → OAuth Client.\n');
    process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: SCOPES,
});

// Start a tiny local server to catch the callback
const server = http.createServer(async (req, res) => {
    const qs = new url.URL(req.url, `http://localhost:9876`);
    const code = qs.searchParams.get('code');

    if (!code) {
        res.end('No code received.');
        return;
    }

    try {
        const { tokens } = await oauth2Client.getToken(code);
        
        // Save tokens
        const tokenPath = path.join(__dirname, 'token.json');
        fs.writeFileSync(tokenPath, JSON.stringify({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            refresh_token: tokens.refresh_token,
            token_type: tokens.token_type,
        }, null, 2));

        console.log('\n✅  Authorization successful!');
        console.log(`   Token saved to: ${tokenPath}`);
        console.log('   You can now start the server with: npm start\n');

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <html><body style="font-family:sans-serif;text-align:center;padding:80px;background:#0a0a0a;color:#f7ede2;">
                <h1 style="color:#f28482;">✅ Authorization Successful!</h1>
                <p>You can close this window and start the server.</p>
            </body></html>
        `);

        setTimeout(() => {
            server.close();
            process.exit(0);
        }, 1000);
    } catch (err) {
        console.error('Error getting token:', err.message);
        res.end('Error getting token: ' + err.message);
        server.close();
        process.exit(1);
    }
});

server.listen(9876, async () => {
    console.log('\n🔑  Opening browser for Google authorization...');
    console.log('   If the browser doesn\'t open, visit this URL manually:\n');
    console.log(`   ${authUrl}\n`);
    
    // Dynamic import for the ESM 'open' package
    const open = (await import('open')).default;
    open(authUrl);
});
