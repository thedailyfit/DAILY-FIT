"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const twilio_1 = __importDefault(require("twilio"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const client = (0, twilio_1.default)(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
function sendTestMessage() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('🧪 Testing Twilio Message Sending...');
        console.log(`From: ${process.env.TWILIO_WHATSAPP_NUMBER}`);
        console.log(`To: whatsapp:+918919205848`);
        try {
            const message = yield client.messages.create({
                from: process.env.TWILIO_WHATSAPP_NUMBER,
                to: 'whatsapp:+918919205848',
                body: '🔔 This is a test message from your DailyFit agent! If you see this, the connection is working! 🚀'
            });
            console.log(`✅ Message sent! SID: ${message.sid}`);
        }
        catch (error) {
            console.error('❌ Error sending message:', error.message);
            if (error.code) {
                console.error(`Error Code: ${error.code}`);
                console.error(`More Info: ${error.moreInfo}`);
            }
        }
    });
}
sendTestMessage();
