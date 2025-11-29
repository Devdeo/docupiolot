import type { Tool } from '@/lib/tools';
import { ToolCard } from './tool-card';
import Link from 'next/link';
import { toolRoutes } from '@/lib/tools';

type ToolGridProps = {
  tools: Tool[];
};

export function ToolGrid({ tools }: ToolGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {tools.map((tool) => (
        <Link key={tool.id} href={toolRoutes[tool.id] || '/'}>
          <ToolCard tool={tool} />
        </Link>
      ))}
    </div>
  );
}
