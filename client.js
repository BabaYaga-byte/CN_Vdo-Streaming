const videoPlayer = document.getElementById('videoPlayer');
const ws = new WebSocket('ws://localhost:8080');

ws.onopen = () => {
  console.log('Connected to server');
};

ws.onmessage = (event) => {
  const blob = new Blob([event.data], { type: 'video/mp4' });
  const url = URL.createObjectURL(blob);
  videoPlayer.src = url;
};

ws.onclose = () => {
  console.log('Disconnected from server');
};