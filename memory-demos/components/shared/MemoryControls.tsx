import { MemoryControls as MemoryControlsType } from '@/types';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import cn from 'classnames';

interface MemoryControlsProps extends MemoryControlsType {
  className?: string;
}

export function MemoryControls({
  isEnabled,
  isPaused,
  onToggleMemory,
  onTogglePause,
  onClear,
  className,
}: MemoryControlsProps) {
  return (
    <div className={cn('flex flex-col gap-4 rounded-lg border p-4', className)}>
      <div className="flex items-center justify-between">
        <span>Memory Enabled</span>
        <Switch checked={isEnabled} onCheckedChange={onToggleMemory} />
      </div>

      <div className="flex items-center justify-between">
        <span>Pause Memory</span>
        <Switch
          checked={isPaused}
          onCheckedChange={onTogglePause}
          disabled={!isEnabled}
        />
      </div>

      <Button variant="destructive" onClick={onClear} disabled={!isEnabled}>
        Reset chat and memory
      </Button>
    </div>
  );
}
