var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as nut from '@nut-tree/nut-js';
const drawRectangle = (width, height) => __awaiter(void 0, void 0, void 0, function* () {
    yield nut.mouse.move(nut.right(width));
    yield nut.mouse.move(nut.down(height));
    yield nut.mouse.move(nut.left(width));
    yield nut.mouse.move(nut.up(height));
});
export const drawCmdHandler = (cmd) => __awaiter(void 0, void 0, void 0, function* () {
    nut.mouse.config.mouseSpeed = 200;
    switch (cmd[0].substring(5)) {
        case 'square':
            yield nut.mouse.pressButton(nut.Button.LEFT);
            yield drawRectangle(+cmd[1], +cmd[1]);
            yield nut.mouse.releaseButton(nut.Button.LEFT);
            break;
        case 'rectangle':
            yield nut.mouse.pressButton(nut.Button.LEFT);
            yield drawRectangle(+cmd[1], +cmd[2]);
            yield nut.mouse.releaseButton(nut.Button.LEFT);
            break;
        case 'circle':
            const radius = +cmd[1];
            let { x: curX, y: curY } = yield nut.mouse.getPosition();
            const centerX = curX + radius;
            const centerY = curY;
            yield nut.mouse.pressButton(nut.Button.LEFT);
            for (let angle = 0, newX, newY; angle <= 360; angle++) {
                newX = Math.round(centerX + radius * Math.cos((Math.PI * (angle + 180)) / 180));
                newY = Math.round(centerY + radius * Math.sin((Math.PI * (angle + 180)) / 180));
                if (Math.abs(newX - curX) || Math.abs(newY - curY)) {
                    yield nut.mouse.move(nut.straightTo({ x: newX, y: newY }));
                }
                (curX = newX), (curY = curY);
            }
            yield nut.mouse.releaseButton(nut.Button.LEFT);
            break;
        default:
            throw new Error('Invalid Command');
    }
    nut.mouse.config.mouseSpeed = 1000;
});
