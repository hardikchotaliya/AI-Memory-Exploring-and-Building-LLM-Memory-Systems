import OpenAI from 'openai';
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

export async function POST(request: Request) {
  try {
    // Get request body
    const body = await request.json();
    const { messages, model = getCurrentModel() } = body;

    // Validate required fields
    if (!messages) {
      return NextResponse.json(
        { error: 'Messages are required' },
        { status: 400 }
      );
    }

    // Make request to OpenAI
    const completion = await openai.chat.completions.create({
      model,
      messages: messages.map(
        ({ role, content }: { role: string; content: string }) => ({
          role,
          content,
        })
      ),
      temperature: 0.7,
      max_tokens: 1000,
    });

    // Return the response
    return NextResponse.json(completion);
  } catch (error) {
    console.error('OpenAI API error:', error);

    // Handle specific OpenAI errors
    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status || 500 }
      );
    }

    // Handle generic errors
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
