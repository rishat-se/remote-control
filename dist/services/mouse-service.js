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
export const mouseCmdHandler = (cmd) => __awaiter(void 0, void 0, void 0, function* () {
    switch (cmd[0].substring(6)) {
        case 'up':
            yield nut.mouse.move(nut.up(+cmd[1]));
            return;
        case 'down':
            yield nut.mouse.move(nut.down(+cmd[1]));
            return;
        case 'left':
            yield nut.mouse.move(nut.left(+cmd[1]));
            return;
        case 'right':
            yield nut.mouse.move(nut.right(+cmd[1]));
            return;
        case 'position':
            const mousePos = yield nut.mouse.getPosition();
            return `mouse_position ${mousePos.x.toString()},${mousePos.y.toString()}`;
        default:
            throw new Error('Invalid Command');
    }
});
