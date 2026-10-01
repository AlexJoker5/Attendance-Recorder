import type { LucideIcon } from 'lucide-react';
import { Panel } from './Panel';
export function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
}) {
  return (
    <Panel>
      <div className="actions justify-between">
        <span className="muted">{label}</span>
        <Icon size={18} className="text-brand" />
      </div>
      <strong className="stat">{value}</strong>
    </Panel>
  );
}
