import { connect } from "mongoose";
import { config } from "./config";
import { mjClient, receiveMessage, deleteMessage } from "./util";

async function generate(data: any) {
  console.log(`generate ${JSON.stringify(data)}`);
  const user_id = data?.user_id;
  const prompt = data?.prompt;
  if (!user_id || !prompt) return;

  // call to discord
  const result = await mjClient.Imagine(prompt);
  if (!result) return false;
  console.log(
    `${JSON.stringify({
      user_id,
      prompt,
      image_src: result?.uri,
    })}`
  );
  fetch(`${config.endpoint.url}/api/upsert_after_generate`, {
    method: "POST",
    body: JSON.stringify({
      user_id,
      prompt,
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
        deleteMessage(config.aws.sqs_queue_generate, message);
        generate(data);
      });
    }
  }
}

main();
