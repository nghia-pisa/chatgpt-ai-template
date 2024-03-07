import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Ensure we're dealing with a POST request
  if (req.method === 'POST') {

    try {
      const { updatedQuery } = req.body;
      const chatEndpoint = "https://api.openai.com/v1/chat/completions";
      const apiKey = process.env.OPENAI_API;
      const model = "gpt-3.5-turbo-0125";
      // const model = "gpt-4-0125-preview";

      const chatRequest = await fetch(chatEndpoint, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        method: "POST",
        body: JSON.stringify({
          model: model,
          response_format: { "type": "json_object" },
          messages: [
            {
              "role": "system",
              "content": "As a Retrieval Augmented Generation chatbot, please answer user queries with only the provided context. If the provided context does not have enough information, say so."
            },
            {
              "role": "user",
              "content": updatedQuery
            }
          ],
          temperature: 1
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
