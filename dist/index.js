import { httpServer } from './http_server/index.js';
import { wss } from './ws-server/index.js';
process.on('SIGINT', () => {
    console.log('Stop HTTP server');
    httpServer.close();
    console.log('Stop WebSocket server');
    wss.close();
});
