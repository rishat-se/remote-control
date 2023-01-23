import * as nut from '@nut-tree/nut-js';

export const mouseCmdHandler = async (cmd: string[]) => {
    switch (cmd[0].substring(6)) {
        case 'up':
            await nut.mouse.move(nut.up(+cmd[1]));
            return;
        case 'down':
            await nut.mouse.move(nut.down(+cmd[1]));
            return;
        case 'left':
            await nut.mouse.move(nut.left(+cmd[1]));
            return;
        case 'right':
            await nut.mouse.move(nut.right(+cmd[1]));
            return;
        case 'position':
            const mousePos = await nut.mouse.getPosition();
            return `mouse_position ${mousePos.x.toString()},${mousePos.y.toString()}`;
        default:
            throw new Error('Invalid Command');
    }
};
