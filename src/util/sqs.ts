import {
  SQSClient,
  GetQueueUrlCommand,
  SendMessageCommand,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from "@aws-sdk/client-sqs";

export const sqsClient = new SQSClient({ region: "ap-southeast-1" });

const SQS_QUEUE_NAME = process.env.AWS_SQS_NAME || "";
export const SQS_QUEUE_GENERATE = process.env.AWS_SQS_GENERATE || "";
export const SQS_QUEUE_PINECONE = process.env.AWS_SQS_PINECONE || "";

export const getQueueURL = async (queueName = SQS_QUEUE_NAME) => {
  const command = new GetQueueUrlCommand({ QueueName: queueName });
  const response = await sqsClient.send(command);
  return response;
};

export const sendMessage = async (queueURL: any, message: any) => {
  const command = new SendMessageCommand({
    QueueUrl: queueURL,
    MessageBody: message,
  });

  const response = await sqsClient.send(command);
  console.log(response);
  return response;
};

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
