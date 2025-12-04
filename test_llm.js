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
Object.defineProperty(exports, "__esModule", { value: true });
const LLMService_1 = require("./src/core/LLMService");
function testLLM() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('🧪 Testing LLM Service with Direct REST API...\n');
        const llm = new LLMService_1.LLMService();
        // Test 1: Name Extraction
        console.log('Test 1: Name Extraction');
        console.log('Input: "Hi, my name is Ravi"');
        const name = yield llm.extractName("Hi, my name is Ravi");
        console.log(`✅ Extracted Name: "${name}"\n`);
        // Test 2: Onboarding Response (Why question)
        console.log('Test 2: Onboarding Response - Why do you need my age?');
        const onboardingResponse = yield llm.generateOnboardingResponse('age', 'Why do you need my age?', { name: 'Ravi' });
        console.log(`✅ Response: "${onboardingResponse}"\n`);
        // Test 3: General Conversational Response
        console.log('Test 3: General Conversation');
        const generalResponse = yield llm.generateResponse('What exercises should I do for fat loss?', { name: 'Ravi', goal: 'fat_loss', age: 25 });
        console.log(`✅ Response: "${generalResponse}"\n`);
        console.log('🎉 All tests completed!');
    });
}
testLLM().catch(console.error);
