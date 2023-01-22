var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { drawCmdHandler } from '../services/draw-service.js';
import { mouseCmdHandler } from '../services/mouse-service.js';
import { prntscrnCmdHandler } from '../services/prnt-scrn-service.js';
export const cmdRouter = (rawCmd, sendResponse) => __awaiter(void 0, void 0, void 0, function* () {
    let response = rawCmd;
    try {
        const cmd = rawCmd.split(/\s+/);
        switch (true) {
            case cmd[0].startsWith('mouse'):
                response = (yield mouseCmdHandler(cmd)) || response;
                break;
            case cmd[0].startsWith('prnt_scrn'):
                response = (yield prntscrnCmdHandler()) || response;
                break;
            case cmd[0].startsWith('draw'):
                yield drawCmdHandler(cmd);
                break;
            default:
                throw new Error('Invalid Command');
        }
        sendResponse(response);
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(err.message);
        }
        else {
            console.log(String(err));
        }
    }
});
