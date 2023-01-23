import * as nut from '@nut-tree/nut-js';
import Jimp from 'jimp';
import { SCREENSHOT_WIDTH, SCREENSHOT_HEIGHT } from '../constants.js';

// calculates region that is inside screen borders
const calcSafeRegion = async (x: number, y: number) => {
    const screenWidth = await nut.screen.width();
    const screenHeight = await nut.screen.height();
    const left =
        x - SCREENSHOT_WIDTH / 2 < 0
            ? 0
            : x + SCREENSHOT_WIDTH / 2 > screenWidth
            ? screenWidth - SCREENSHOT_WIDTH
            : x - SCREENSHOT_WIDTH / 2;
    const top =
        y - SCREENSHOT_HEIGHT / 2 < 0
            ? 0
            : y + SCREENSHOT_HEIGHT / 2 > screenHeight
            ? screenHeight - SCREENSHOT_HEIGHT
            : y - SCREENSHOT_HEIGHT / 2;
    return new nut.Region(left, top, SCREENSHOT_WIDTH, SCREENSHOT_HEIGHT);
};

export const prntscrnCmdHandler = async () => {
    const { x: curX, y: curY }: nut.Point = await nut.mouse.getPosition();
    const region = await calcSafeRegion(curX, curY);
    const screenBGR = await nut.screen.grabRegion(region);
    const screenRGB = await screenBGR.toRGB();
    const image = new Jimp({
        data: screenRGB.data,
        width: screenRGB.width,
        height: screenRGB.height,
    });
    const pngImage = await image.getBufferAsync(Jimp.MIME_PNG);
    return `prnt_scrn ${pngImage.toString('base64')}`;
};
