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
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function listModels() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error('❌ GEMINI_API_KEY is missing in .env');
            return;
        }
        console.log(`🔑 Using API Key: ${apiKey.substring(0, 10)}...`);
        console.log('🔍 Listing available models...');
        try {
            const response = yield axios_1.default.get(`https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`);
            const models = response.data.models;
            if (models && models.length > 0) {
                console.log('\n✅ Available Models:');
                models.forEach((model) => {
                    if (model.supportedGenerationMethods.includes('generateContent')) {
                        console.log(`- ${model.name} (${model.displayName})`);
                    }
                });
            }
            else {
                console.log('❌ No models found.');
            }
        }
        catch (error) {
            console.error('❌ Error listing models:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        }
    });
}
listModels();
