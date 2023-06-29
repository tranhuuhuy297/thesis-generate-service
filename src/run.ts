import { connect } from "mongoose";
import { config } from "./config";
import { mjClient, sendMessage, receiveMessage, deleteMessage } from "./util";

async function generate(data: any) {
  const user_id = data?.user_id;
  const prompt_id = data?.prompt_id;
  const prompt = data?.prompt;
  if (!user_id || !prompt_id || !prompt) return;

  // call to discord
  console.log(`${data} is imaging`);
  const result = await mjClient.Imagine(prompt);
  if (!result) return;
  // done
  const imageData = {
    action: "generate_done",
    user_id,
    prompt_id,
    image_src: result?.uri,
    prompt,
  };
  sendMessage(config.aws.sqs_queue_pinecone, JSON.stringify(imageData));
}

async function main() {
  await connect(config.mongo.url);
  console.log("connected mongo");
  await mjClient.Connect();
  console.log("connected midjourney");

  while (true) {
    const { Messages } = await receiveMessage(config.aws.sqs_queue_generate);
    if (Messages) {
      Messages.forEach(async (message: any) => {
        const data = JSON.parse(message?.Body);
        if (data?.action !== "generate") return;
        await deleteMessage(config.aws.sqs_queue_generate, message);
        await generate(data);
      });
    }
  }
}

main();
