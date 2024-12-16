'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TooltipArrow,
} from "@/components/ui/tooltip";
import { encode } from 'gpt-tokenizer';

const TOKEN_LIMIT = 100;

const ContextWindowDemo = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [input, setInput] = useState('');
  const [tokenCount, setTokenCount] = useState(0);
  const [limitIndex, setLimitIndex] = useState<number | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const tokens = encode(input);
    setTokenCount(tokens.length);

    // Find the word index where token limit is exceeded
    const words = input.split(' ');
    let currentTokens = 0;
    let limitIdx = null;

    for (let i = words.length - 1; i >= 0; i--) {
      const textFromHere = words.slice(i).join(' ');
      currentTokens = encode(textFromHere).length;
      
      if (currentTokens > TOKEN_LIMIT) {
        limitIdx = i;
        setShowTooltip(true);
        break;
      }
    }
    
    if (limitIdx === null) {
      setShowTooltip(false);
    }
    
    setLimitIndex(limitIdx);
  }, [input]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <div className="container mx-auto flex min-h-0 flex-1 flex-col overflow-hidden p-4">
        <Link 
          href="/" 
          className="mb-2 flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" />
          Home
        </Link>
        
        <h1 className="mb-8 text-2xl font-bold">Context Window Demo</h1>

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-hidden md:grid-cols-2">
          {/* Input Panel */}
          <Card className="flex min-h-0 flex-col overflow-hidden">
            <CardHeader className="shrink-0">
              <CardTitle className="flex items-center justify-between">
                Input
                <span className="text-sm font-normal text-muted-foreground">
                  {tokenCount} tokens
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex min-h-0 flex-1 flex-col overflow-hidden p-4">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-0 flex-1 resize-none rounded-md border-0 bg-transparent p-0 text-sm focus:ring-0"
                placeholder="Start typing..."
              />
            </CardContent>
          </Card>

          {/* Context Window Panel */}
          <Card className="flex min-h-0 flex-col overflow-hidden">
            <CardHeader className="shrink-0">
              <CardTitle className="flex items-center justify-between">
                Context Window
                <span className="text-sm font-normal text-muted-foreground">
                  {TOKEN_LIMIT} token limit
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex min-h-0 flex-1 flex-col overflow-hidden p-4">
              <div className="flex min-h-0 flex-1 flex-col-reverse overflow-y-auto whitespace-pre-wrap">
                <div>
                  {input.split(' ').map((word, index) => {
                    const textFromHereToEnd = input.split(' ').slice(index).join(' ');
                    const tokens = encode(textFromHereToEnd);
                    const isWithinLimit = tokens.length <= TOKEN_LIMIT;
                    
                    return (
                      <span key={index}>
                        {index === limitIndex ? (
                          <TooltipProvider>
                            <Tooltip open={showTooltip}>
                              <TooltipTrigger>
                                <span className="rounded bg-red-500 px-1 text-white">
                                  {word}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <TooltipArrow />
                                <p>This word exceeds the {TOKEN_LIMIT} token limit</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <span
                            className={`${
                              isWithinLimit 
                                ? 'text-foreground' 
                                : 'text-muted-foreground/40'
                            }`}
                          >
                            {word}
                          </span>
                        )}
                        {' '}
                      </span>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-4 shrink-0 rounded-lg bg-yellow-50 p-4">
          <h2 className="mb-2 font-semibold">How this demo works:</h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Type text in the input panel on the left</li>
            <li>Watch the token count increase as you type</li>
            <li>The context window on the right shows text within the {TOKEN_LIMIT} token limit</li>
            <li>Text that exceeds the token limit appears in a lighter color</li>
            <li>The first word outside the limit is highlighted in red</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ContextWindowDemo;
