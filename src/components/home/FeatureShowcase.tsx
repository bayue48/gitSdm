import { motion } from 'framer-motion';
import {
  Brain,
  GitBranch,
  FolderTree,
  Package,
  Users,
  Flame,
  Map,
  Shield,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

const features = [
  {
    icon: GitBranch,
    title: 'Interactive Architecture Graph',
    description: 'Explore folder structure, files, and module dependencies in an animated React Flow canvas. Click any node to deep-dive.',
    accent: 'from-violet-600/30 to-violet-400/10',
    iconColor: 'text-violet-400',
  },
  {
    icon: Brain,
    title: 'AI Repository Intelligence',
    description: 'Get senior-engineer-quality explanations: what the repo does, how modules interact, and where to start reading.',
    accent: 'from-cyan-600/30 to-cyan-400/10',
    iconColor: 'text-cyan-400',
  },
  {
    icon: Map,
    title: 'Architecture Layer Mapping',
    description: 'Automatically identify and label architectural layers — API, services, UI, data, cache — with real file references.',
    accent: 'from-fuchsia-600/30 to-fuchsia-400/10',
    iconColor: 'text-fuchsia-400',
  },
  {
    icon: FolderTree,
    title: 'Smart Onboarding Guide',
    description: 'AI generates a step-by-step onboarding walkthrough: entry points, request lifecycle, and key modules in sequence.',
    accent: 'from-emerald-600/30 to-emerald-400/10',
    iconColor: 'text-emerald-400',
  },
  {
    icon: Shield,
    title: 'Codebase Health Scores',
    description: 'Quantify maintainability, modularity, readability, and complexity. Identify refactor opportunities before they hurt.',
    accent: 'from-amber-600/30 to-amber-400/10',
    iconColor: 'text-amber-400',
  },
  {
    icon: Package,
    title: 'Multi-Ecosystem Dependencies',
    description: 'Parse npm, pip, Cargo, Go modules, Maven, and more. Visualize your dependency graph across all ecosystems.',
    accent: 'from-blue-600/30 to-blue-400/10',
    iconColor: 'text-blue-400',
  },
  {
    icon: Flame,
    title: 'Repo Roast Mode 🔥',
    description: 'Get a witty, specific roast of your codebase from an AI senior engineer. Funny and surprisingly insightful.',
    accent: 'from-rose-600/30 to-rose-400/10',
    iconColor: 'text-rose-400',
  },
  {
    icon: Users,
    title: 'Contributor & Activity Timeline',
    description: 'Visualize top contributors and 90-day commit activity alongside your architecture graph for full project context.',
    accent: 'from-indigo-600/30 to-indigo-400/10',
    iconColor: 'text-indigo-400',
  },
];

export function FeatureShowcase() {
  return (
    <section id="docs" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-14"
      >
        <span className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-3 block">Platform Capabilities</span>
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Built for instant understanding
        </h2>
        <p className="mt-4 text-zinc-400 max-w-xl mx-auto">
          From graph visualization to AI architecture analysis — everything a developer needs to understand any codebase in minutes.
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.06, duration: 0.45 }}
          >
            <GlassCard hover className="h-full p-4">
              <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${f.accent}`}>
                <f.icon className={`h-4.5 w-4.5 ${f.iconColor}`} />
              </div>
              <h3 className="font-semibold text-white text-sm leading-snug mb-1.5">{f.title}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">{f.description}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
