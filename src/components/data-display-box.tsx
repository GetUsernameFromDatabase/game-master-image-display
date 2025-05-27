import { HTMLAttributes, useId } from 'react';
import { buttonVariants } from './ui/button';
import { cn } from '@/lib/utils';
import { Checkbox } from './ui/checkbox';

export interface BoxProperties {
  name: string;
  index: number;
  hide: boolean;
  sort: boolean;
  searchBy: boolean;
  filter: boolean;
}

interface BoxElementPropertes
  extends HTMLAttributes<HTMLDivElement>,
    BoxProperties {
  onBoxChange(box: BoxProperties): void;
}

export const DataDisplayBox = ({
  ref,
  index,
  name,
  searchBy,

  hide,
  sort,
  filter,

  onBoxChange,
  className,
  ...properties
}: BoxElementPropertes & {
  ref: React.RefObject<HTMLDivElement> | undefined;
}) => {
  const id = useId();

  const box: BoxProperties = {
    index: index,
    name: name,
    searchBy: searchBy,

    hide: hide,
    sort: sort,
    filter: filter,
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
          ref={undefined}
          id={`hide-${id}`}
          defaultChecked={box.hide}
          onCheckedChange={(state) => {
            if (typeof state !== 'boolean') {
              console.error('New state for box hide status should be boolean');
              return;
            }
            onBoxChange({ ...box, hide: state });
          }}
        ></Checkbox>
      </div>

      {/* Currently as it is sort button is not needed, will cut this functionality
         for more text space */}
      {/* <div className='flex items-center space-x-2 mx-2 col-span-2' ref={ref}>
        <label htmlFor={`sort-${id}`}>sort</label>
        <Checkbox
          ref={undefined}
          id={`sort-${id}`}
          defaultChecked={box.sort}
          onCheckedChange={(state) => {
            if (typeof state !== 'boolean') {
              console.error('New state for box sort status should be boolean');
              return;
            }
            onBoxChange({ ...box, sort: state });
          }}
        ></Checkbox>
      </div> */}

      <div className='flex items-center space-x-2 mx-2 col-span-2' ref={ref}>
        <label htmlFor={`filter-${id}`}>filter</label>
        <Checkbox
          ref={undefined}
          id={`filter-${id}`}
          defaultChecked={box.filter}
          onCheckedChange={(state) => {
            if (typeof state !== 'boolean') {
              console.error(
                'New state for box filter status should be boolean',
              );
              return;
            }
            onBoxChange({ ...box, filter: state });
          }}
        ></Checkbox>
      </div>
    </div>
  );
};
