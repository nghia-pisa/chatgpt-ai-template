import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Ensure we're dealing with a POST request
  if (req.method === 'POST') {

    try {
      const { updatedQuery } = req.body;
      // const chatEndpoint = "https://api.openai.com/v1/chat/completions";
      // const apiKey = process.env.OPENAI_API;
      // const model = "gpt-3.5-turbo";
      // const model = "gpt-4-turbo-preview";

      // const chatRequest = await fetch(chatEndpoint, {
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${apiKey}`,
      //   },
      //   method: "POST",
      //   body: JSON.stringify({
      //     model: model,
      //     response_format: { "type": "json_object" },
      //     messages: [
      //       {
      //         "role": "system",
      //         "content": "As a Retrieval Augmented Generation chatbot, please answer user queries with only the provided context. If the provided context does not have enough information, say so."
      //       },
      //       {
      //         "role": "user",
      //         "content": updatedQuery
      //       }
      //     ],
      //     temperature: 0
      //   }),
      // });

      const chatRequest = await fetch("https://api.anthropic.com/v1/messages", {
        headers: {
          "content-type": "application/json",
          "x-api-key": `${process.env.CLAUDE}`,
          "anthropic-version": "2023-06-01"
        },
        method: "POST",
        body: JSON.stringify({
          "model": "claude-3-haiku-20240307",
          "max_tokens": 1024,
          system: "As a Retrieval Augmented Generation chatbot, please answer user queries with only the provided context. If the provided context does not have enough information, say so.",
          messages: [
            {
              "role": "user",
              "content": updatedQuery
            }
          ],
          temperature: 0.5
        }),
      });

      if (!chatRequest.ok) {
        throw new Error(`Error from external API: ${chatRequest.statusText}`);
      }

      // Parse the JSON response
      const data = await chatRequest.json();

      // Send the data back to the client
      res.status(200).json(data);
    } catch (error) {
      // Handle errors, such as network issues or JSON parsing issues
      // Check if the error is an instance of the Error class
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        // For unknown error types, you might choose to send a generic error message
        res.status(500).json({ error: 'An unexpected error occurred' });
      }
    }
  } else {
    // If the request is not POST, return a 405 Method Not Allowed
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
