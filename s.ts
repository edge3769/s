import { encode } from "gpt-3-encoder";
import {
  Configuration,
  CreateCompletionRequest,
  CreateCompletionResponse,
  OpenAIApi,
} from "openai";
import { writeFileSync } from "fs";

let request: CreateCompletionRequest = {
  model: "text-davinci-003",
};

let apiKey = "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";
let PINECODE = "81160c0d-8aef-4c52-b180-2c3123136b1f";

let prompt = `This text is to be used as the prompt in a request to OpenAI's API Completions endpoint.
The request will use the following text as the OpenAI API key: ${apiKey}.
besides prompt - which has been already stated to be this entire text - the following are the parameters in the body of the request:

{
max_tokens: <MAX_TOKENS>
}.
The objective of the request is to generate a shell script which will be run on a debian instance with a user "edge" having password "love". 
the shellscript will: ${process.argv[2]}.
Any part of the generated shell script which will use the Pinecone vector database will use the namespace "s" and the following text as the pinecode API key: ${PINECODE}.
The generated shell script:`;

let max_tokens = 4096 - encode(prompt).length - 7;

request.prompt = prompt.replace("<MAX_TOKENS>", String(max_tokens));

let openai = new OpenAIApi(
  new Configuration({
    apiKey,
  })
);

fetch("https://api.openai.com/v1/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  },
  body: JSON.stringify(request),
}).then(async (response) => {
  let text = await response.text();
  let res: CreateCompletionResponse;
  try {
    res = JSON.parse(text);
  } catch {
    console.error("JSON.parse error", text);
    process.exit();
  }
  if (res.choices) {
    let r = res.choices[0].text;
    if (r) {
      writeFileSync(".sh", r);
    } else {
      console.log("no choices");
    }
  } else {
    console.log(res)
    process.exit()
  }
});

// openai.createCompletion(request).then((response) => {
//   if (response.data.choices[0].text)
//     writeFileSync(".sh", response.data.choices[0].text);
// }).catch(e => console.error(e));
