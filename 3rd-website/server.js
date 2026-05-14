const express = require('express');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const app = express();

app.use(express.json()); // Handle JSON payloads for deletion


// --- High-Level Security Protections ---
app.use(helmet({
    contentSecurityPolicy: false, // Disabled for local dev (streaming videos/CDNs)
}));
app.use(cors({
    origin: (origin, callback) => {
        // Allow Netlify, local dev, and the Render backend itself
        const allowedOrigins = [
            /\.netlify\.app$/, 
            /localhost/, 
            /\.onrender\.com$/
        ];
        if (!origin || allowedOrigins.some(pattern => pattern.test(origin))) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.disable('x-powered-by'); // Hide server technology details

// Rate limiter: Prevents brute-force or spamming our auth routes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: "Too many requests from this IP, please try again after 15 minutes",
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/auth', limiter);

// --- Auth Configuration ---
const ALLOWED_EMAILS = ['professorrel152@gmail.com', 'priyuu1502@gmail.com'];

// --- Metadata / Captions Logic ---
const CAPTIONS_FILE = path.join(__dirname, 'captions.json');
function getCaptions() {
    try {
        if (fs.existsSync(CAPTIONS_FILE)) {
            return JSON.parse(fs.readFileSync(CAPTIONS_FILE, 'utf-8'));
        }
    } catch (e) { console.error('Error reading captions:', e); }
    return {};
}
function saveCaption(id, caption) {
    try {
        const captions = getCaptions();
        captions[id] = caption;
        fs.writeFileSync(CAPTIONS_FILE, JSON.stringify(captions, null, 2));
    } catch (e) { console.error('Error saving caption:', e); }
}

// Read OAuth credentials from token.json
const tokenDataPath = path.join(__dirname, 'token.json');
let oauthConfig = {};
if (fs.existsSync(tokenDataPath)) {
    oauthConfig = JSON.parse(fs.readFileSync(tokenDataPath, 'utf-8'));
}

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || oauthConfig.client_id,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || oauthConfig.client_secret,
    callbackURL: "/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    const email = profile.emails[0].value;
    if (ALLOWED_EMAILS.includes(email.toLowerCase())) {
        return done(null, profile);
    } else {
        return done(null, false, { message: 'Access denied' });
    }
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// --- Middleware Setup ---
app.set('trust proxy', 1); // Trust Render's proxy for secure cookies
app.use(session({
    secret: process.env.SESSION_SECRET || 'priya-bday-secret-2026-secure-key-abc',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true, // Prevents JS from accessing the session cookie
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Use 'none' for cross-domain proxying
        secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));
app.use(passport.initialize());
app.use(passport.session());

// --- Authentication Middleware ---
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    // Allow access to login-related routes
    if (req.path === '/login' || req.path.startsWith('/auth/google')) {
        return next();
    }
    res.redirect('/login');
}

// --- Auth Routes ---
app.get('/login', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Priya's 20th - Login</title>
            <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600&display=swap" rel="stylesheet">
            <style>
                body { background: #0a0a0a; color: #f7ede2; font-family: 'Montserrat', sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
                .login-box { text-align: center; padding: 3.5rem; background: rgba(255,255,255,0.03); border-radius: 24px; border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(20px); box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
                h1 { margin-bottom: 0.5rem; color: #f28482; font-size: 2.5rem; letter-spacing: -1px; }
                p { color: #aaa; margin-bottom: 2.5rem; }
                .btn { display: inline-flex; align-items: center; gap: 10px; padding: 1rem 2.5rem; background: #f28482; color: #0a0a0a; text-decoration: none; border-radius: 12px; font-weight: 600; transition: all 0.3s ease; }
                .btn:hover { background: #fff; transform: translateY(-3px); box-shadow: 0 10px 20px rgba(242, 132, 130, 0.3); }
                .error { color: #ff6b6b; margin-top: 1.5rem; font-size: 0.9rem; }
            </style>
        </head>
        <body>
            <div class="login-box">
                <h1>Priya's 20th</h1>
                <p>Private Access Only</p>
                <a href="/auth/google" class="btn">Sign in with Google</a>
                ${req.query.error ? `<div class="error">Unauthorized email address.</div>` : ''}
            </div>
        </body>
        </html>
    `);
});

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login?error=true' }),
    (req, res) => res.redirect('/')
);

app.get('/logout', (req, res) => {
    req.logout(() => res.redirect('/login'));
});

// Protect all other routes
app.use(ensureAuthenticated);

// Serve static elements out of the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));
app.use('/kavin_priya', express.static(path.join(__dirname, '..', 'kavin_priya')));

// Specific routes for the upload experience
app.get(['/netflix.html/upload', '/netflix-upload'], (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'upload.html'));
});


// Route for background video
app.get('/stream-video', (req, res) => {
    const videoPath = path.join(__dirname, '..', 'cinematic-landing', 'assets', 'love.mp4');
    if (fs.existsSync(videoPath)) {
        res.sendFile(videoPath);
    } else {
        res.status(404).send('Video not found.');
    }
});

// Route for Netflix intro animation
app.get('/stream-intro', (req, res) => {
    const videoPath = path.join(__dirname, '..', 'cinematic-landing', 'assets', 'Netflix New Logo Animation 2019.mp4');
    if (fs.existsSync(videoPath)) {
        res.sendFile(videoPath);
    } else {
        res.status(404).send('Video not found.');
    }
});

const multer = require('multer');
const { google } = require('googleapis');

// --- Google Drive OAuth2 Setup ---
const DRIVE_FOLDER_ID = '166YEZgzAFEepvroNz9FF1zF0M2DQ13-C';
let drive = null;

const tokenPath = path.join(__dirname, 'token.json');
let tokens = {};
if (fs.existsSync(tokenPath)) {
    tokens = JSON.parse(fs.readFileSync(tokenPath, 'utf-8'));
}

const G_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || tokens.client_id;
const G_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || tokens.client_secret;
const G_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN || tokens.refresh_token;

if (G_CLIENT_ID && G_CLIENT_SECRET && G_REFRESH_TOKEN) {
    const oauth2Client = new google.auth.OAuth2(
        G_CLIENT_ID,
        G_CLIENT_SECRET,
        'http://localhost:9876'
    );
    oauth2Client.setCredentials({ refresh_token: G_REFRESH_TOKEN });
    drive = google.drive({ version: 'v3', auth: oauth2Client });
    console.log('✅ Google Drive authenticated via Environment Variables/Token');
} else {
    console.warn('⚠️  Google Drive credentials not found. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REFRESH_TOKEN env vars.');
}

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Accept images and videos (up to 100MB)
const uploadMiddleware = multer({
    dest: 'uploads/',
    limits: { fileSize: 100 * 1024 * 1024 }
});

app.post('/api/upload', (req, res, next) => {
    uploadMiddleware.single('photo')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: 'Multer error: ' + err.message });
        } else if (err) {
            return res.status(500).json({ error: 'Unknown upload error: ' + err.message });
        }
        next();
    });
}, async (req, res) => {
    try {
        if (!drive) {
            return res.status(503).json({ error: 'Google Drive not configured. Run: node setup-auth.js YOUR_CLIENT_SECRET' });
        }
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        const fileMetadata = {
            name: req.file.originalname,
            parents: [DRIVE_FOLDER_ID]   // Upload into "Priya Bday" folder
        };
        const media = {
            mimeType: req.file.mimetype,
            body: fs.createReadStream(req.file.path),
        };

        // Upload to the shared folder
        const uploadedFile = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id, webContentLink, webViewLink'
        });

        const fileId = uploadedFile.data.id;

        // Make the file publicly accessible
        await drive.permissions.create({
            fileId: fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone'
            }
        });

        // Get the updated links
        const updatedFile = await drive.files.get({
            fileId: fileId,
            fields: 'webContentLink, webViewLink, thumbnailLink'
        });

        // Clean up temp file
        fs.unlinkSync(req.file.path);

        console.log(`Uploaded "${req.file.originalname}" to Drive folder "Priya Bday"`);
        res.json({ success: true, link: updatedFile.data.webContentLink });
    } catch (error) {
        console.error('Error uploading to Drive:', error.message);
        res.status(500).json({ error: 'Failed to upload photo: ' + error.message });
    }
});

app.get('/api/photos', async (req, res) => {
    try {
        if (!drive) {
            return res.status(503).json({ error: 'Google Drive not configured.' });
        }
        const response = await drive.files.list({
            q: `'${DRIVE_FOLDER_ID}' in parents and trashed=false and (mimeType contains 'image/' or mimeType contains 'video/')`,
            fields: 'files(id, name, mimeType, webContentLink, thumbnailLink)',
            orderBy: 'createdTime desc'
        });
        const captions = getCaptions();
        const photos = (response.data.files || []).map(file => ({
            ...file,
            caption: captions[file.id] || ''
        }));
        res.json(photos);
    } catch (error) {
        console.error('Error fetching photos:', error.message);
        res.status(500).json({ error: 'Failed to fetch photos.' });
    }
});

// Endpoint to list local kavin_priya media by category
app.get('/api/kavin_priya', (req, res) => {
    const baseDir = path.join(__dirname, '..', 'kavin_priya');
    const categories = ['love', 'fun', 'intimacy'];
    const result = {};
    const captions = getCaptions();

    categories.forEach(category => {
        const dirPath = path.join(baseDir, category);
        if (fs.existsSync(dirPath)) {
            const files = fs.readdirSync(dirPath).filter(file => {
                const ext = path.extname(file).toLowerCase();
                return ['.jpg', '.jpeg', '.png', '.webp', '.mp4', '.mov'].includes(ext);
            });
            result[category] = files.map(file => {
                const filePath = `/kavin_priya/${category}/${file}`;
                return {
                    path: filePath,
                    caption: captions[filePath] || ''
                };
            });
        } else {
            result[category] = [];
        }
    });

    res.json(result);
});

// Endpoint to upload specifically to local PriyaFlix categories
app.post('/api/upload-priyaflix', (req, res, next) => {
    uploadMiddleware.single('file')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: 'Multer error: ' + err.message });
        } else if (err) {
            return res.status(500).json({ error: 'Unknown upload error: ' + err.message });
        }
        next();
    });
}, (req, res) => {
    try {
        const { category } = req.body;
        if (!category || !['love', 'fun', 'intimacy'].includes(category)) {
            return res.status(400).json({ error: 'Invalid category.' });
        }
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }

        const targetDir = path.join(__dirname, '..', 'kavin_priya', category);
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }
        
        const targetPath = path.join(targetDir, req.file.originalname);
        
        // Move from temporary uploads/ to target category folder
        fs.renameSync(req.file.path, targetPath);

        console.log(`PriyaFlix: Uploaded "${req.file.originalname}" to ${category}`);
        res.json({ success: true, path: `/kavin_priya/${category}/${req.file.originalname}` });
    } catch (error) {
        console.error('Error uploading to PriyaFlix:', error.message);
        res.status(500).json({ error: 'Failed to upload: ' + error.message });
    }
});

// Endpoint to delete specifically from local PriyaFlix categories
app.post('/api/delete-priyaflix', (req, res) => {
    try {
        const { filePath } = req.body;
        if (!filePath || !filePath.startsWith('/kavin_priya/')) {
            return res.status(400).json({ error: 'Invalid file path.' });
        }

        const actualPath = path.join(__dirname, '..', filePath);
        if (fs.existsSync(actualPath)) {
            fs.unlinkSync(actualPath);
            console.log(`PriyaFlix: Deleted ${filePath}`);
            res.json({ success: true });
        } else {
            res.status(404).json({ error: 'File not found.' });
        }
    } catch (error) {
        console.error('Error deleting from PriyaFlix:', error.message);
        res.status(500).json({ error: 'Failed to delete: ' + error.message });
    }
});

// Endpoint to update (rename / move / replace) local PriyaFlix media
app.post('/api/update-media-priyaflix', uploadMiddleware.single('file'), (req, res) => {
    try {
        const { oldPath, newName, newCategory, caption } = req.body;
        if (!oldPath || !oldPath.startsWith('/kavin_priya/')) {
            return res.status(400).json({ error: 'Invalid old file path.' });
        }

        const actualOldPath = path.join(__dirname, '..', oldPath);
        if (!fs.existsSync(actualOldPath)) {
            return res.status(404).json({ error: 'Original file not found.' });
        }

        // Determine the current category and filename from the old path
        const parts = oldPath.split('/'); // ['', 'kavin_priya', 'category', 'filename']
        const currentCategory = parts[2];
        const currentFilename = parts[3];

        // Determine target category and filename
        const targetCategory = (newCategory && ['love', 'fun', 'intimacy'].includes(newCategory)) ? newCategory : currentCategory;
        let targetFilename = newName ? newName : currentFilename;

        // If a new file is uploaded, use the uploaded file's extension
        if (req.file) {
            const ext = path.extname(req.file.originalname).toLowerCase();
            // Ensure the target filename has the correct extension
            const baseName = path.basename(targetFilename, path.extname(targetFilename));
            targetFilename = baseName + ext;
        }

        const targetDir = path.join(__dirname, '..', 'kavin_priya', targetCategory);
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }
        const targetPath = path.join(targetDir, targetFilename);

        if (req.file) {
            // Replace: delete old file, move new uploaded file to target
            fs.unlinkSync(actualOldPath);
            fs.renameSync(req.file.path, targetPath);
            console.log(`PriyaFlix: Replaced "${currentFilename}" with "${targetFilename}" in ${targetCategory}`);
        } else {
            // Rename / Move only
            fs.renameSync(actualOldPath, targetPath);
            console.log(`PriyaFlix: Moved/Renamed "${currentFilename}" -> "${targetFilename}" in ${targetCategory}`);
        }

        const targetPathRelative = `/kavin_priya/${targetCategory}/${targetFilename}`;
        
        if (caption !== undefined) {
            saveCaption(targetPathRelative, caption);
            // If the path changed, we might want to delete the old caption key
            if (targetPathRelative !== oldPath) {
                const captions = getCaptions();
                delete captions[oldPath];
                fs.writeFileSync(CAPTIONS_FILE, JSON.stringify(captions, null, 2));
            }
        }

        res.json({ success: true, newPath: targetPathRelative });
    } catch (error) {
        console.error('Error updating PriyaFlix media:', error.message);
        // Clean up temp file if upload failed mid-way
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: 'Failed to update: ' + error.message });
    }
});

// Proxy endpoint — serves Drive images directly through our server (avoids CORS/referrer issues)
app.get('/api/image/:id', async (req, res) => {
    try {
        if (!drive) {
            return res.status(503).send('Drive not configured');
        }
        const fileId = req.params.id;
        
        // Get file metadata for content type
        const meta = await drive.files.get({ fileId, fields: 'mimeType' });
        
        // Stream the file content
        const response = await drive.files.get(
            { fileId, alt: 'media' },
            { responseType: 'stream' }
        );
        
        res.setHeader('Content-Type', meta.data.mimeType);
        res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24h
        response.data.pipe(res);
    } catch (error) {
        console.error('Error proxying image:', error.message);
        res.status(500).send('Failed to load image');
    }
});

// Endpoint to delete specifically from Google Drive
app.post('/api/delete-photo', async (req, res) => {
    try {
        if (!drive) {
            return res.status(503).json({ error: 'Google Drive not configured.' });
        }
        const { fileId } = req.body;
        if (!fileId) {
            return res.status(400).json({ error: 'Missing fileId.' });
        }

        await drive.files.delete({ fileId: fileId });
        console.log(`Drive: Deleted file ${fileId}`);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting from Drive:', error.message);
        res.status(500).json({ error: 'Failed to delete from Drive: ' + error.message });
    }
});

// Endpoint to update (rename / replace) a Google Drive file
app.post('/api/update-drive', uploadMiddleware.single('file'), async (req, res) => {
    try {
        if (!drive) {
            return res.status(503).json({ error: 'Google Drive not configured.' });
        }

        const { fileId, newName, caption } = req.body;
        if (!fileId) {
            return res.status(400).json({ error: 'Missing fileId.' });
        }

        if (caption !== undefined) {
            saveCaption(fileId, caption);
        }

        // If a replacement file is uploaded, update the media content
        if (req.file) {
            const media = {
                mimeType: req.file.mimetype,
                body: fs.createReadStream(req.file.path),
            };

            const resource = {};
            if (newName) {
                // Use newName but keep original extension if not provided
                const ext = path.extname(req.file.originalname).toLowerCase();
                const baseName = path.basename(newName, path.extname(newName));
                resource.name = baseName + ext;
            }

            await drive.files.update({
                fileId: fileId,
                resource: Object.keys(resource).length > 0 ? resource : undefined,
                media: media,
                fields: 'id, name'
            });

            // Clean up temp file
            fs.unlinkSync(req.file.path);
            console.log(`Drive: Replaced content of file ${fileId}`);
        } else if (newName) {
            // Rename only (no file replacement)
            await drive.files.update({
                fileId: fileId,
                resource: { name: newName },
                fields: 'id, name'
            });
            console.log(`Drive: Renamed file ${fileId} to "${newName}"`);
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Error updating Drive file:', error.message);
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: 'Failed to update Drive file: ' + error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Advanced Node.js server running on port ${PORT}`);
    console.log(`Checking assets...`);
    const lovePath = path.join(__dirname, '..', 'cinematic-landing', 'assets', 'love.mp4');
    const introPath = path.join(__dirname, '..', 'cinematic-landing', 'assets', 'Netflix New Logo Animation 2019.mp4');
    console.log(`- love.mp4: ${fs.existsSync(lovePath) ? 'EXISTS' : 'MISSING'} (${lovePath})`);
    console.log(`- intro.mp4: ${fs.existsSync(introPath) ? 'EXISTS' : 'MISSING'} (${introPath})`);
});
