import * as dotenv from "dotenv";
dotenv.config();

export const config = {
  mongo: {
    url: process.env.MONGO_URL || "",
  },
  midjourney: {
    serverId: process.env.SERVER_ID || "",
    channelId: process.env.CHANNEL_ID || "",
    salaiToken: process.env.SALAI_TOKEN || "",
  },
  aws: {
    access_key_id: process.env.AWS_ACCESS_KEY_ID || "",
    secret_access_key: process.env.AWS_SECRET_ACCESS_KEY || "",
    sqs_queue_generate: process.env.AWS_SQS_GENERATE || "",
    sqs_queue_pinecone: process.env.AWS_SQS_PINECONE || "",
  },
};
