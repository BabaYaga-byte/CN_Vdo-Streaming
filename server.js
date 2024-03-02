const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const server = http.createServer((req, res) => {
  // Serve the HTML file for the root URL
  if (req.url === '/') {
    const filePath = path.join(__dirname, 'index.html');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  }
  // Serve the video file for the /video.mp4 path
  else if (req.url === '/video.mp4') {
    const videoPath = path.join(__dirname, 'video.mp4');
    fs.stat(videoPath, (err, stat) => {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      res.writeHead(200, {
        'Content-Type': 'video/mp4',
        'Content-Length': stat.size
      });
      const readStream = fs.createReadStream(videoPath);
      readStream.pipe(res);
    });
  }
  else if (req.url === '/video1.mp4') {
    const videoPath = path.join(__dirname, 'video1.mp4');
    fs.stat(videoPath, (err, stat) => {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      res.writeHead(200, {
        'Content-Type': 'video1/mp4',
        'Content-Length': stat.size
      });
      const readStream = fs.createReadStream(videoPath);
      readStream.pipe(res);
    });
  }
  // Handle other paths
  else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

// Create a WebSocket server and attach it to the HTTP server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    // Broadcast the message to all connected clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Start the server on port  8080 and listen on all network interfaces
server.listen(8080, '0.0.0.0', () => {
  console.log('Server started on port  8080');
});