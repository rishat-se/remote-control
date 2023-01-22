import { WebSocketServer, createWebSocketStream } from 'ws';
import * as nut from '@nut-tree/nut-js';
import Jimp from 'jimp';
import * as stream from 'node:stream';

const wss = new WebSocketServer({ port: 8080 });

const cmdController = async (ws: stream.Duplex, data: string) => {
    let res = data;
    const cmd = res.split(/\s+/);
    switch (true) {
        case cmd[0].startsWith('mouse'):
            switch (cmd[0].substring(6)) {
                case 'up':
                    await nut.mouse.move(nut.up(+cmd[1]));
                    break;
                case 'down':
                    await nut.mouse.move(nut.down(+cmd[1]));
                    break;
                case 'left':
                    await nut.mouse.move(nut.left(+cmd[1]));
                    break;
                case 'right':
                    await nut.mouse.move(nut.right(+cmd[1]));
                    break;
                case 'position':
                    const mousePos = await nut.mouse.getPosition();
                    res = `mouse_position ${mousePos.x.toString()},${mousePos.y.toString()}`;
                    break;
            }
            break;
        case cmd[0] === 'prnt_scrn':
            const { x: curX, y: curY }: nut.Point =
                await nut.mouse.getPosition();
            const screenWidth = await nut.screen.width();
            const screenHeight = await nut.screen.height();
            const SCREENSHOT_WIDTH = 200;
            const SCREENSHOT_HEIGHT = 200;
            const left =
                curX - SCREENSHOT_WIDTH / 2 < 0
                    ? 0
                    : curX + SCREENSHOT_WIDTH / 2 > screenWidth
                    ? screenWidth - SCREENSHOT_WIDTH
                    : curX - SCREENSHOT_WIDTH / 2;
            const top =
                curY - SCREENSHOT_HEIGHT / 2 < 0
                    ? 0
                    : curY + SCREENSHOT_HEIGHT / 2 > screenHeight
                    ? screenHeight - SCREENSHOT_HEIGHT
                    : curY - SCREENSHOT_HEIGHT / 2;
            const region = new nut.Region(
                left,
                top,
                SCREENSHOT_WIDTH,
                SCREENSHOT_HEIGHT
            );
            const screenBGR = await nut.screen.grabRegion(region);
            const screenRGB = await screenBGR.toRGB();
            const image = new Jimp(
                {
                    data: screenRGB.data,
                    width: screenRGB.width,
                    height: screenRGB.height,
                },
                (err, image) => {}
            );
            const pngImage = await image.getBufferAsync(Jimp.MIME_PNG);
            res = `prnt_scrn ${pngImage.toString('base64')}`;
            break;
        case cmd[0].startsWith('draw'):
            nut.mouse.config.mouseSpeed = 200;
            switch (cmd[0].substring(5)) {
                case 'square':
                    await nut.mouse.pressButton(nut.Button.LEFT);
                    await nut.mouse.move(nut.right(+cmd[1]));
                    await nut.mouse.move(nut.down(+cmd[1]));
                    await nut.mouse.move(nut.left(+cmd[1]));
                    await nut.mouse.move(nut.up(+cmd[1]));
                    await nut.mouse.releaseButton(nut.Button.LEFT);
                    break;
                case 'rectangle':
                    await nut.mouse.pressButton(nut.Button.LEFT);
                    await nut.mouse.move(nut.right(+cmd[1]));
                    await nut.mouse.move(nut.down(+cmd[2]));
                    await nut.mouse.move(nut.left(+cmd[1]));
                    await nut.mouse.move(nut.up(+cmd[2]));
                    await nut.mouse.releaseButton(nut.Button.LEFT);
                    break;
                case 'circle':
                    const radius = +cmd[1];
                    await nut.mouse.pressButton(nut.Button.LEFT);
                    let { x: curX, y: curY }: nut.Point =
                        await nut.mouse.getPosition();
                    const centerX = curX + radius;
                    const centerY = curY;
                    for (let angle = 0, newX, newY; angle <= 360; angle++) {
                        newX = Math.round(
                            centerX +
                                radius *
                                    Math.cos((Math.PI * (angle + 180)) / 180)
                        );
                        newY = Math.round(
                            centerY +
                                radius *
                                    Math.sin((Math.PI * (angle + 180)) / 180)
                        );
                        if (Math.abs(newX - curX) || Math.abs(newY - curY)) {
                            await nut.mouse.move(
                                nut.straightTo({ x: newX, y: newY })
                            );
                        }
                        (curX = newX), (curY = curY);
                    }
                    await nut.mouse.releaseButton(nut.Button.LEFT);
                    break;
            }
            nut.mouse.config.mouseSpeed = 200;
            break;
    }
    ws.write(res);
};

wss.on('connection', function connection(ws) {
    const wsStream = createWebSocketStream(ws, {
        //        encoding: 'utf-8',
        decodeStrings: false,
    });
    wsStream.on('data', function message(data) {
        console.log('received: %s', data.toString());
        cmdController(wsStream, data.toString());
    });
    wsStream.on('end', function message() {});
    wsStream.on('error', function message(err) {
        console.log(err.message);
    });
});
