import {
  SQSClient,
  GetQueueUrlCommand,
  SendMessageCommand,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from "@aws-sdk/client-sqs";

export const sqsClient = new SQSClient({ region: "ap-southeast-1" });

const SQS_QUEUE_NAME = process.env.AWS_SQS_NAME || "";
const SQS_QUEUE_URL = process.env.AWS_SQS_URL || "";

export const getQueueURL = async (queueName = SQS_QUEUE_NAME) => {
  const command = new GetQueueUrlCommand({ QueueName: queueName });
  const response = await sqsClient.send(command);
  return response;
};

export const sendMessage = async (message: any) => {
  const command = new SendMessageCommand({
    QueueUrl: SQS_QUEUE_URL,
    MessageBody: message,
  });

  const response = await sqsClient.send(command);
  console.log(response);
  return response;
};

export const receiveMessage = () => {
  console.log("receive message");
  return sqsClient.send(
    new ReceiveMessageCommand({
      MaxNumberOfMessages: 10,
      MessageAttributeNames: ["All"],
      QueueUrl: SQS_QUEUE_URL,
      WaitTimeSeconds: 10,
    })
  );
};

export const deleteMessage = (message: any) => {
  console.log("delete message");
  return sqsClient.send(
    new DeleteMessageCommand({
      QueueUrl: SQS_QUEUE_URL,
      ReceiptHandle: message.ReceiptHandle,
    })
  );
};
