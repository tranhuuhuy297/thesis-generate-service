import { Image } from "./model/Image";
import { connect } from "mongoose";
import { config } from "./config";
import { mjClient, receiveMessage, deleteMessage } from "./util";

async function generate(data: any) {
  const user_id = data?.user_id;
  const prompt_id = data?.prompt_id;
  const prompt = data?.prompt;

  // call to discord
  const result = await mjClient.Imagine(prompt);
  console.log(`${data} is imaging`);
  // save to mongo
  const now = new Date().getTime();
  const image = new Image({
    user_id,
    prompt_id,
    image_src: result?.uri,
    create_time: now,
    update_time: now,
  });
  await image.save();
  console.log(`${data} is insert to mongo`);
}

async function main() {
  await connect(config.mongo.url);
  console.log("connected mongo");
  await mjClient.Connect();
  console.log("connected midjourney");

  while (true) {
    const { Messages } = await receiveMessage();
    if (Messages) {
      Messages.forEach(async (message: any) => {
        await deleteMessage(message);
        const data = JSON.parse(message?.Body);
        await generate(data);
      });
    }
  }
}

main();
