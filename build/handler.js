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
exports.consumeMessages = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const redis = new ioredis_1.default({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT) || 6379,
});
console.log("ENV: " + process.env.REDIS_HOST);
const consumeMessages = (event) => __awaiter(void 0, void 0, void 0, function* () {
    for (const record of event.Records) {
        const payload = Buffer.from(record.kinesis.data, 'base64').toString('utf-8');
        console.log('Received record:', payload);
        try {
            // Publish message to Redis channel
            yield redis.publish('test-channel', payload);
            console.log('Message published to Redis:', payload);
        }
        catch (error) {
            console.error('Error publishing to Redis:', error);
        }
    }
});
exports.consumeMessages = consumeMessages;
