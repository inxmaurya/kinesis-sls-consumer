import { KinesisStreamHandler } from 'aws-lambda';
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT) || 6379,
});

console.log("ENV: " + process.env.REDIS_HOST);

export const consumeMessages: KinesisStreamHandler = async (event) => {
  for (const record of event.Records) {
    const payload = Buffer.from(record.kinesis.data, 'base64').toString('utf-8');
    console.log('Received record:', payload);

    try {
      // Publish message to Redis channel
      await redis.publish('test-channel', payload);
      console.log('Message published to Redis:', payload);
    } catch (error) {
      console.error('Error publishing to Redis:', error);
    }
  }
};
