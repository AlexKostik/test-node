import { createServer } from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';

// Используем встроенный __dirname для ES-модуля
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Хост и порт 
const hostname = '127.0.0.1';
const PORT = 3000;

// Асинхронная работа 
async function serveFile(res, filepath) {
    try {
        const data = await fs.readFile(filepath);
        const ext = path.extname(filepath).toLowerCase();
        res.writeHead(200, { 'Content-Type': contentTypeFromExt(ext) });
        res.end(data);
    } catch (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Не найдено');
    }
}

function contentTypeFromExt(ext) {
    switch (ext) {
        case '.html': return 'text/html; charset=utf-8';
        case '.css': return 'text/css';
        case '.js': return 'text/javascript';
        case '.json': return 'application/json';
        case '.png': return 'image/png';
        case '.jpg': case '.jpeg': return 'image/jpeg';
        default: return 'application/octet-stream';
    }
}

// Основной HTTP-сервер
const server = createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    if (pathname.startsWith('/static/')) {
        const relPath = pathname.replace('/static/', '');
        const filePath = path.join(__dirname, 'static', relPath);
        return await serveFile(res, filePath);
    }

    if (pathname === '/' || pathname === '/index' || pathname === '/home') {
        return await serveFile(res, path.join(__dirname, 'templates', 'index.html'));
    }

    if (pathname === '/contacts' || pathname === '/contact') {
        return await serveFile(res, path.join(__dirname, 'templates', 'contacts.html'));
    }

    if (pathname === '/about' || pathname === '/info') {
        return await serveFile(res, path.join(__dirname, 'templates', 'about.html'));
    }

    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Страница не найдена');
});

// Запуск сервера
server.listen(PORT, hostname, () => {
    console.log(`Server running at http://${hostname}:${PORT}/`);
});