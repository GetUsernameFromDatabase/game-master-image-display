import { cn } from "@/lib/utils";
import { HTMLAttributes, DragEvent } from "react";

function allowDrop(ev: DragEvent) {
  ev.preventDefault();
}

export const DropZone = ({
  ref,
  className,
  ...properties
}: HTMLAttributes<HTMLDivElement> & {
  ref: React.RefObject<HTMLDivElement> | undefined;
}) => {
  return (
    <div
      ref={ref}
      className={cn("grid py-2", className)}
      onDragOver={allowDrop}
      {...properties}
    ></div>
  );
};
