import type { Tool } from '@/lib/tools';
import { ToolCard } from './tool-card';

type ToolGridProps = {
  tools: Tool[];
  onToolSelect: (tool: Tool) => void;
};

export function ToolGrid({ tools, onToolSelect }: ToolGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {tools.map((tool) => (
        <ToolCard key={tool.id} tool={tool} onClick={() => onToolSelect(tool)} />
      ))}
    </div>
  );
}
