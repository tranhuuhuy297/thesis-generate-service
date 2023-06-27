import { Midjourney } from "midjourney";
import { config } from "../config";

const mjClient = new Midjourney({
  ServerId: config.midjourney.serverId,
  ChannelId: config.midjourney.channelId,
  SalaiToken: config.midjourney.salaiToken,
  Debug: true,
});

export { mjClient };
