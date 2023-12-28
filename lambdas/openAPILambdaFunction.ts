const { Configuration, OpenAIApi } = require("openai");
import { APIGatewayProxyEvent } from "aws-lambda";

const configuration = new Configuration({
  organization: "org-OW30YswYxUA00mvlCoAqD6ef",
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function helloTestHandler(event: any, context: any) {
  // Add your logic here to handle the 'GET' method
  // You can access the event object and perform necessary operations

  // Example response
  const response = {
    statusCode: 200,
    body: JSON.stringify({ message: "helloTest method handled successfully" }),
  };

  return response;
}

export async function getModelsHandler(event: any, context: any) {
  const openaiResponse = await openai.listModels();
  const response = {
    statusCode: 200,
    body: JSON.stringify(openaiResponse["data"]),
  };

  return response;
}

export async function getQuestionHandler(event: any, context: any) {
  const messages = [
    {
      role: "system",
      content:
        "You are an expert in the medical field providing questions that help medical students study.",
    },
    {
      role: "user",
      content:
        "Give me an example of a multiple choice question that would appear on the STEP exam for medical students. Do not provide the answer unless it is asked for. The only things that should be in your response are a question and answer choices.",
    },
  ];
  const openAIResponse = await generalChatCompletion(messages);
  console.log(openAIResponse["data"]["choices"][0]);
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Origin": "https://smartstepai.com",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    },
    body: JSON.stringify(openAIResponse["data"]["choices"][0]),
  };

  return response;
}

export async function getChatCompletionHandler(event: any, context: any) {
  const { body } = event;
  console.log(body);
  const messages = JSON.parse(body);

  const openAIResponse = await generalChatCompletion(messages);
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Origin": "https://smartstepai.com",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    },
    body: JSON.stringify(openAIResponse["data"]["choices"][0]),
  };
  return response;
}

async function generalChatCompletion(messages: {}[]) {
  console.log("Sending generalChatCompletion request to openAI API.");
  const response = await openai
    .createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 1.0,
      max_tokens: 256,
    })
    .catch((e: any) => {
      console.log(e);
    });

  return response;
}

async function generalCompletions(event: any, context: any) {
  const response = await openai.createCompletion({
    model: "gpt-3.5-turbo",
    prompt:
      "Give me an example of a multiple choice question that would appear on the STEP exam for medical students. Don't give the correct answer until I have attempted to answer. You should respond with just the question followed by the answer choices; nothing else.",
    max_tokens: 50,
    temperature: 1.2,
  });
}
