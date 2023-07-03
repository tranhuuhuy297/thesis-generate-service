import { connect } from "mongoose";
import { config } from "./config";
import { mjClient, receiveMessage, deleteMessage } from "./util";

async function generate(data: any) {
  const user_id = data?.user_id;
  const prompt_id = data?.prompt_id;
  const prompt = data?.prompt;
  if (!user_id || !prompt_id || !prompt) return;

  // call to discord
  console.log(`${prompt} is imaging`);
  const result = await mjClient.Imagine(prompt);
  if (!result) return false;
  fetch(`${config.endpoint.url}/api/upsert_after_generate`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id,
      prompt_id,
      image_src: result?.uri,
    }),
  })
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
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
        await deleteMessage(config.aws.sqs_queue_generate, message);
        await generate(data);
      });
    }
  }
}

main();
