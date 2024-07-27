import { allowDrop } from '@/lib/dragging';
import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef } from 'react';

export const DropZone = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...properties }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('grid py-2', className)}
      onDragOver={allowDrop}
      {...properties}
    ></div>
  );
});
