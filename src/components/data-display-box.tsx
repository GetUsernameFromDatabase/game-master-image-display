import { HTMLAttributes, forwardRef, useId } from 'react';
import { buttonVariants } from './ui/button';
import { cn } from '@/lib/utils';
import { Checkbox } from './ui/checkbox';

export interface BoxProperties {
  name: string;
  index: number;
  hide: boolean;
  sort: boolean;
  searchBy: boolean;
}

interface BoxElementPropertes
  extends HTMLAttributes<HTMLDivElement>,
    BoxProperties {
  onBoxChange(box: BoxProperties): void;
}

export const DataDisplayBox = forwardRef<HTMLDivElement, BoxElementPropertes>(
  (
    {
      hide,
      index,
      name,
      searchBy,
      sort,
      onBoxChange,
      className,
      ...properties
    },
    ref,
  ) => {
    const id = useId();

    const box: BoxProperties = {
      hide: hide,
      index: index,
      name: name,
      searchBy: searchBy,
      sort: sort,
    };

    return (
      <div
        ref={ref}
        className={cn(
          buttonVariants({ variant: box.searchBy ? 'secondary' : 'outline' }),
          'grid grid-cols-12',
          className,
        )}
        onDragOver={(event) => event.preventDefault()}
        {...properties}
      >
        <p
          className='col-span-8 cursor-default'
          onClick={() => {
            onBoxChange({ ...box, searchBy: !box.searchBy });
          }}
        >
          {box.name}
        </p>
        <div className='flex items-center space-x-2 mx-2 col-span-2' ref={ref}>
          <label htmlFor={`hide-${id}`}>hide</label>
          <Checkbox
            id={`hide-${id}`}
            defaultChecked={box.hide}
            onCheckedChange={(state) => {
              if (typeof state !== 'boolean') {
                console.error(
                  'New state for box hide status should be boolean',
                );
                return;
              }
              onBoxChange({ ...box, hide: state });
            }}
          ></Checkbox>
        </div>
        <div className='flex items-center space-x-2 mx-2 col-span-2' ref={ref}>
          <label htmlFor={`sort-${id}`}>sort</label>
          <Checkbox
            id={`sort-${id}`}
            defaultChecked={box.sort}
            onCheckedChange={(state) => {
              if (typeof state !== 'boolean') {
                console.error(
                  'New state for box sort status should be boolean',
                );
                return;
              }
              onBoxChange({ ...box, sort: state });
            }}
          ></Checkbox>
        </div>
      </div>
    );
  },
);
