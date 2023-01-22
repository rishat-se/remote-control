import { WebSocketServer, createWebSocketStream } from 'ws';
import { PORT } from './constants.js';
import { cmdRouter } from './routes/cmd-router.js';
const wss = new WebSocketServer({ port: PORT });
wss.on('connection', (ws) => {
    const wsStream = createWebSocketStream(ws, { decodeStrings: false });
    wsStream.on('data', (chunk) => {
        console.log('received: %s', chunk.toString());
        cmdRouter(chunk.toString(), (response) => {
            wsStream.write(response);
        });
    });
    wsStream.on('end', () => { });
    wsStream.on('error', (err) => {
        console.log(err.message);
    });
});
process.on('SIGINT', () => {
    console.log('GoodBye!');
    wss.close();
});
