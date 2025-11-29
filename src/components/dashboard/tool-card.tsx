import { motion } from 'framer-motion';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Tool } from '@/lib/tools';

type ToolCardProps = {
  tool: Tool;
  onClick: () => void;
};

export function ToolCard({ tool, onClick }: ToolCardProps) {
  const Icon = tool.icon;
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Card
        className="h-full cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/50"
        onClick={onClick}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
        role="button"
        tabIndex={0}
        aria-label={`Open ${tool.title}`}
      >
        <CardHeader className="p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-6 w-6" />
          </div>
          <CardTitle className="text-lg font-semibold">{tool.title}</CardTitle>
          <CardDescription className="text-sm">
            {tool.description}
          </CardDescription>
        </CardHeader>
      </Card>
    </motion.div>
  );
}
