import * as nut from '@nut-tree/nut-js';

const drawRectangle = async (width: number, height: number) => {
    await nut.mouse.move(nut.right(width));
    await nut.mouse.move(nut.down(height));
    await nut.mouse.move(nut.left(width));
    await nut.mouse.move(nut.up(height));
};

export const drawCmdHandler = async (cmd: string[]) => {
    nut.mouse.config.mouseSpeed = 200;
    switch (cmd[0].substring(5)) {
        case 'square':
            await nut.mouse.pressButton(nut.Button.LEFT);
            await drawRectangle(+cmd[1], +cmd[1]);
            await nut.mouse.releaseButton(nut.Button.LEFT);
            break;
        case 'rectangle':
            await nut.mouse.pressButton(nut.Button.LEFT);
            await drawRectangle(+cmd[1], +cmd[2]);
            await nut.mouse.releaseButton(nut.Button.LEFT);
            break;
        case 'circle':
            const radius = +cmd[1];
            let { x: curX, y: curY }: nut.Point = await nut.mouse.getPosition();
            const centerX = curX + radius;
            const centerY = curY;
            await nut.mouse.pressButton(nut.Button.LEFT);
            for (let angle = 0, newX, newY; angle <= 360; angle += 10) {
                newX = Math.round(centerX + radius * Math.cos((Math.PI * (angle + 180)) / 180));
                newY = Math.round(centerY + radius * Math.sin((Math.PI * (angle + 180)) / 180));
                await nut.mouse.move(nut.straightTo({ x: newX, y: newY }));
                (curX = newX), (curY = curY);
            }
            await nut.mouse.releaseButton(nut.Button.LEFT);
            break;
        default:
            throw new Error('Invalid Command');
    }
    nut.mouse.config.mouseSpeed = 1000;
};
