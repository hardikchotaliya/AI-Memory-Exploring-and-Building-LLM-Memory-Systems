import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

const demos = [
  {
    title: 'Observable Memory',
    description:
      'Watch how chat memory works in real-time. See the complete message object sent to the API and observe how memory is stored.',
    path: '/demos/observable-memory',
  },
  {
    title: 'Editable Memory',
    description:
      'Modify chat memory directly and see how it affects the conversation.',
    path: '/demos/editable-memory',
  },
  {
    title: 'Context Window',
    description:
      'Visualize how the context window fills up and manages token limits.',
    path: '/demos/context-window',
  },
  {
    title: 'Summary Memory',
    description:
      'See how chat history can be summarized to maintain context while managing token usage.',
    path: '/demos/summary-memory',
  },
];

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold">AI Chat Memory Demos</h1>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {demos.map((demo) => (
            <Link key={demo.path} href={demo.path}>
              <Card className="h-full transition-colors hover:bg-slate-50">
                <CardHeader>
                  <CardTitle>{demo.title}</CardTitle>
                  <CardDescription>{demo.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-8 rounded-lg bg-blue-50 p-4">
          <h2 className="mb-2 text-xl font-semibold">About These Demos</h2>
          <p className="text-gray-700">
            These interactive demonstrations help visualize and understand how
            memory works in AI chat applications. Each demo focuses on a
            different aspect of memory management and provides real-time
            visualization of the processes involved.
          </p>
        </div>
      </div>
    </div>
  );
}
