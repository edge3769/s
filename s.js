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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var gpt_3_encoder_1 = require("gpt-3-encoder");
var openai_1 = require("openai");
var fs_1 = require("fs");
var request = {
    model: "text-davinci-003"
};
var apiKey = "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";
var PINECODE = "81160c0d-8aef-4c52-b180-2c3123136b1f";
var prompt = "This text is to be used as the prompt in a request to OpenAI's API Completions endpoint.\nThe request will use the following text as the OpenAI API key: ".concat(apiKey, ".\nbesides prompt - which has been already stated to be this entire text - the following are the parameters in the body of the request:\n\n{\nmax_tokens: <MAX_TOKENS>\n}.\nThe objective of the request is to generate a shell script which will be run on a debian instance with a user \"edge\" having password \"love\". \nthe shellscript will: ").concat(process.argv[2], ".\nAny part of the generated shell script which will use the Pinecone vector database will use the namespace \"s\" and the following text as the pinecode API key: ").concat(PINECODE, ".\nThe generated shell script:");
var max_tokens = 4096 - (0, gpt_3_encoder_1.encode)(prompt).length - 7;
request.prompt = prompt.replace("<MAX_TOKENS>", String(max_tokens));
var openai = new openai_1.OpenAIApi(new openai_1.Configuration({
    apiKey: apiKey
}));
fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer ".concat(apiKey)
    },
    body: JSON.stringify(request)
}).then(function (response) { return __awaiter(void 0, void 0, void 0, function () {
    var text, res, r;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, response.text()];
            case 1:
                text = _a.sent();
                try {
                    res = JSON.parse(text);
                }
                catch (_b) {
                    console.error("JSON.parse error", text);
                    process.exit();
                }
                if (res.choices) {
                    r = res.choices[0].text;
                    if (r) {
                        (0, fs_1.writeFileSync)(".sh", r);
                    }
                    else {
                        console.log("no choices");
                    }
                }
                else {
                    console.log(res);
                    process.exit();
                }
                return [2 /*return*/];
        }
    });
}); });
// openai.createCompletion(request).then((response) => {
//   if (response.data.choices[0].text)
//     writeFileSync(".sh", response.data.choices[0].text);
// }).catch(e => console.error(e));
