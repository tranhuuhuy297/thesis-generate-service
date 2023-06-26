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
};
