const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

// Create an HTTP server to serve the video file
const server = http.createServer((req, res) => {
  const filePath = path.join(__dirname, 'video.mp4');
  const stat = fs.statSync(filePath);

  res.writeHead(200, {
    'Content-Type': 'video/mp4',
    'Content-Length': stat.size
  });

  const readStream = fs.createReadStream(filePath);
  readStream.pipe(res);
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
