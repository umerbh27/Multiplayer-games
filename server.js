const express = require('express');
const path = require('path');
const compression = require('compression'); // Gzip compression for speed
const helmet = require('helmet'); // Security headers

const app = express();
const PORT = process.env.PORT || 3000;

// Optimization: Compress all responses
app.use(compression());

// Security: Set headers
app.use(helmet({
    contentSecurityPolicy: false, // Disabled for inline scripts in this demo
}));

// Serve Static Files
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: '1d' // Cache static assets for 1 day to reduce lag
}));

// SEO: Sitemap
app.get('/sitemap.xml', (req, res) => {
    res.header('Content-Type', 'application/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url><loc>http://localhost:3000/</loc><priority>1.0</priority></url>
        <url><loc>http://localhost:3000/#tictactoe</loc><priority>0.8</priority></url>
        <url><loc>http://localhost:3000/#snake</loc><priority>0.8</priority></url>
        <!-- Add other game URLs here -->
    </urlset>`);
});

// SEO: Robots.txt
app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send("User-agent: *\nAllow: /\nSitemap: http://localhost:3000/sitemap.xml");
});

// SPA Fallback (Send index.html for any unknown route)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running smoothly at http://localhost:${PORT}`);
});
