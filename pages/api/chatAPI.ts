import { OpenAIStream } from '@/utils/chatStream';

export const config = {
  runtime: 'edge',
};

const handler = async (req: Request): Promise<Response> => {
  try {
    const { inputCode } = (await req.json());
    const model = "gpt-3.5-turbo-0125";
    const apiKey = "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";
    const stream = await OpenAIStream(inputCode, model, apiKey);

    return new Response(stream);
  } catch (error) {
    console.error(error);
    return new Response('Error', { status: 500 });
  }
};

export default handler;
