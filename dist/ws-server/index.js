import { WebSocketServer, createWebSocketStream } from 'ws';
import { WS_PORT } from './constants.js';
import { cmdRouter } from './routes/cmd-router.js';
export const wss = new WebSocketServer({ port: WS_PORT });
console.log(`Start WebSocket server on localhost port: ${WS_PORT}!`);
wss.on('connection', (ws) => {
    const wsStream = createWebSocketStream(ws, { decodeStrings: false });
    wsStream.on('data', (chunk) => {
        console.log('received command: %s', chunk.toString());
        cmdRouter(chunk.toString(), (response) => {
            wsStream.write(response);
        });
    });
    wsStream.on('end', () => { });
    wsStream.on('error', (err) => {
        console.log(err.message);
    });
});
