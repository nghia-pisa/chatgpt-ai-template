import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Ensure we're dealing with a POST request
  if (req.method === 'POST') {

    try {
      const { userQuery } = req.body;
      const searchEndpoint = "http://34.173.4.147:8080/v1/graphql";
      const collection = "Cvs";

      const searchBody = {
        query: `
          {
            Get {
              ${collection}(
                hybrid: {
                  query: "${userQuery}"
                  properties: ["text"]
                  alpha: 0.6
                  fusionType: relativeScoreFusion
                }
                limit: 4
              ) {
                text
                filename
                _additional {
                  rerank(
                    property: "text"
                    query: "${userQuery}"
                  ) {
                    score
                  }
                }
              }
            }
          }
        `,
      };

      const searchRequest = await fetch(searchEndpoint, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchBody)
      });

      if (!searchRequest.ok) {
        throw new Error(`Error from external API: ${searchRequest.statusText}`);
      }

      // Parse the JSON response
      const data = await searchRequest.json();

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
