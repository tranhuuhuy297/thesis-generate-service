import {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from "@aws-sdk/client-sqs";
import { config } from "../config";

export const sqsClient = new SQSClient({
  region: "ap-southeast-1",
  credentials: {
    accessKeyId: config.aws.access_key_id,
    secretAccessKey: config.aws.secret_access_key,
  },
});

export const SQS_QUEUE_GENERATE = process.env.AWS_SQS_GENERATE || "";

export const receiveMessage = (queue_URL: any) => {
  console.log("receive message");
  return sqsClient.send(
    new ReceiveMessageCommand({
      MaxNumberOfMessages: 10,
      MessageAttributeNames: ["All"],
      QueueUrl: queue_URL,
      WaitTimeSeconds: 10,
    })
  );
};

export const deleteMessage = (queue_URL: any, message: any) => {
  console.log("delete message");
  return sqsClient.send(
    new DeleteMessageCommand({
      QueueUrl: queue_URL,
      ReceiptHandle: message.ReceiptHandle,
    })
  );
};
