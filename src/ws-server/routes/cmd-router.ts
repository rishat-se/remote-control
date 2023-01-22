import { drawCmdHandler } from '../services/draw-service.js';
import { mouseCmdHandler } from '../services/mouse-service.js';
import { prntscrnCmdHandler } from '../services/prnt-scrn-service.js';

export const cmdRouter = async (rawCmd: string, sendResponse: (response: string) => void) => {
    let response = rawCmd;
    try {
        const cmd = rawCmd.split(/\s+/);
        switch (true) {
            case cmd[0].startsWith('mouse'):
                response = (await mouseCmdHandler(cmd)) || response;
                break;
            case cmd[0].startsWith('prnt_scrn'):
                response = (await prntscrnCmdHandler()) || response;
                break;
            case cmd[0].startsWith('draw'):
                await drawCmdHandler(cmd);
                break;
            default:
                throw new Error('Invalid Command');
        }
        sendResponse(response);
    } catch (err) {
        if (err instanceof Error) {
            console.log(err.message);
        } else {
            console.log(String(err));
        }
    }
};
