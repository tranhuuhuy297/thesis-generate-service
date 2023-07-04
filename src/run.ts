import { config } from "./config";
import { mjClient, receiveMessage, deleteMessage } from "./util";

interface Body {
  user_id: string;
  prompt: string;
  image_src: string;
}

function createImage(body: Body): Promise<void> {
  console.log(`${JSON.stringify(body)}`);

  const headers: Headers = new Headers();
  headers.set("Content-Type", "application/json");
  headers.set("Accept", "application/json");

  const request: RequestInfo = new Request(
    `${config.endpoint.url}/api/upsert_after_generate`,
    {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    }
  );

  return fetch(request).then((res) => {
    console.log("got response:", res);
  });
}

async function generate(data: any) {
  console.log(`generate ${JSON.stringify(data)}`);
  const user_id = data?.user_id;
  const prompt = data?.prompt;
  if (!user_id || !prompt) return;

  // call to discord
  const Image = await mjClient.Imagine(prompt);
  if (!Image) return false;

  // Upscale
  const Upscale = await mjClient.Upscale({
    index: 1,
    msgId: <string>Image.id,
    hash: <string>Image.hash,
    flags: Image.flags,
  });

  if (!Upscale) {
    await createImage({
      user_id,
      prompt,
      image_src: Image?.uri,
    });
    return false;
  }

  await createImage({
    user_id,
    prompt,
    image_src: Upscale?.uri,
  });
}

async function main() {
  await mjClient.Connect();
  console.log("connected midjourney");

  while (true) {
    const { Messages } = await receiveMessage(config.aws.sqs_queue_generate);

    if (Messages) {
      Messages.forEach(async (message: any) => {
        const data = JSON.parse(message?.Body);
        deleteMessage(config.aws.sqs_queue_generate, message);
        await generate(data);
      });
    }
  }
}

main();
