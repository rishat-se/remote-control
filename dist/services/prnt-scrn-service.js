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
import Jimp from 'jimp';
import { SCREENSHOT_WIDTH, SCREENSHOT_HEIGHT } from '../constants.js';
// calculates region that is inside screen borders
const calcSafeRegion = (x, y) => __awaiter(void 0, void 0, void 0, function* () {
    const screenWidth = yield nut.screen.width();
    const screenHeight = yield nut.screen.height();
    const left = x - SCREENSHOT_WIDTH / 2 < 0
        ? 0
        : x + SCREENSHOT_WIDTH / 2 > screenWidth
            ? screenWidth - SCREENSHOT_WIDTH
            : x - SCREENSHOT_WIDTH / 2;
    const top = y - SCREENSHOT_HEIGHT / 2 < 0
        ? 0
        : y + SCREENSHOT_HEIGHT / 2 > screenHeight
            ? screenHeight - SCREENSHOT_HEIGHT
            : y - SCREENSHOT_HEIGHT / 2;
    return new nut.Region(left, top, SCREENSHOT_WIDTH, SCREENSHOT_HEIGHT);
});
export const prntscrnCmdHandler = () => __awaiter(void 0, void 0, void 0, function* () {
    const { x: curX, y: curY } = yield nut.mouse.getPosition();
    const region = yield calcSafeRegion(curX, curY);
    const screenBGR = yield nut.screen.grabRegion(region);
    const screenRGB = yield screenBGR.toRGB();
    const image = new Jimp({
        data: screenRGB.data,
        width: screenRGB.width,
        height: screenRGB.height,
    }, (err, image) => { });
    const pngImage = yield image.getBufferAsync(Jimp.MIME_PNG);
    return `prnt_scrn ${pngImage.toString('base64')}`;
});
