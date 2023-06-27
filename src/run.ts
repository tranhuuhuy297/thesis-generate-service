import { Image } from "./model/Image";
import { connect } from "mongoose";
import { config } from "./config";
import { mjClient, sendMessage, receiveMessage, deleteMessage } from "./util";

async function generate(data: any) {
  const user_id = data?.user_id;
  const prompt_id = data?.prompt_id;
  const prompt = data?.prompt;

  // call to discord
  console.log(`${data} is imaging`);
  const result = await mjClient.Imagine(prompt);
  // done
  const imageData = {
    action: "generate_done",
    user_id,
    prompt_id,
    image_src: result?.uri,
    prompt,
  };
  sendMessage(JSON.stringify(imageData));
  // const image = new Image(imageData);
  // await image.save();
  // console.log(`${data} is insert to mongo`);
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
        const data = JSON.parse(message?.Body);
        if (data?.action !== "generate") return;
        await deleteMessage(message);
        await generate(data);
      });
    }
  }
}

main();
