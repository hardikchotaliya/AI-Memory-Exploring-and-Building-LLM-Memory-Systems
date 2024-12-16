import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';
import config, { getCurrentModel } from '@/app/config';

// Get API key based on provider
const token = config.apiProvider === 'github' 
  ? process.env.GITHUB_TOKEN 
  : process.env.OPENAI_API_KEY;

// Initialize OpenAI client with appropriate configuration
const openai = new OpenAI(
  config.apiProvider === 'github'
    ? {
        baseURL: config.githubConfig.endpoint,
        apiKey: token
      }
    : {
        apiKey: token
      }
);

export async function POST(req: Request) {
  try {
    const { messages, collabSpace, skipHistory } = await req.json();
    console.log('API Request:', { 
      model: getCurrentModel(),
      provider: config.apiProvider,
      lastMessage: messages[messages.length - 1]?.content,
      skipHistory
    });

    // For summary requests, use a specific system prompt
    const systemMessage = skipHistory ? {
      role: "system",
      content: "You are a helpful AI assistant. Your task is to create a concise, clear summary of the key points. Return only the summary text, no additional commentary or meta-references."
    } : {
      role: "system",
      content: `You are a helpful AI assistant. Use the following context from the collaboration space to inform your responses: ${collabSpace}`,
    };

    const completion = await openai.chat.completions.create({
      model: getCurrentModel(),
      messages: [
        systemMessage,
        ...messages,
      ],
    });

    // Format the response to match what the frontend expects
    const assistantMessage = {
      role: 'assistant',
      content: completion.choices[0].message.content,
      timestamp: new Date().toISOString(),
    };

    console.log('API Response:', { 
      content: assistantMessage.content,
      usage: completion.usage,
      skipHistory
    });

    return NextResponse.json({ 
      response: assistantMessage,
      usage: completion.usage,
    });
  } catch (error) {
    console.error('API Error:', error);
    
    // Handle specific OpenAI errors
    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status || 500 }
      );
    }

    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
} 