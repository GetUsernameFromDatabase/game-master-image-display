import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Fragment, useState } from 'react';
import { selectTableKeys } from '@/app/store/slices/table-slice';
import { useAppSelector } from '@/app/store/hooks';
import { BoxProperties, DataDisplayBox } from './data-display-box';
import { DropZone } from './drop-zone';

// TODO: there has to be a better way than to just use setBoxes, right?
//  just mutating object is not picked up well by react

export interface DataDisplayChooserProperties {
  onFinish(data: BoxProperties[]): void;
}

export function DataDisplayChooser(properties: DataDisplayChooserProperties) {
  const [open, setOpen] = useState(true);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const keys = useAppSelector(selectTableKeys);
  const [boxes, setBoxes] = useState(
    keys.map<BoxProperties>((key, index) => ({
      name: key,
      index: index,
      hide: false,
      sort: true,
      searchBy: index === 0,
    })),
  );

  // TODO: communicate to parent of open status
  // TODO: sort, hide, active row for search by...

  function onDataDisplayBoxDrop(box: BoxProperties) {
    if (dragIndex == null) {
      console.warn('Drag index is null, nothing to drop');
      return;
    }
  
    const dragBox = boxes.find((x) => x.index == dragIndex);
    if (!dragBox) {
      console.error('Drag box not found, cannot drop');
      return;
    }

    setBoxes(
      boxes.map((x) => {
        if (x.index === dragBox.index) {
          return { ...x, index: box.index };
        }
        if (x.index === box.index) {
          return { ...x, index: dragIndex };
        }
        return x;
      }),
    );
  }

  function onDropZoneDrop(desiredIndex: number) {
    if (dragIndex == null) {
      console.warn('Drag index is null, nothing to drop');
      return;
    }

    if (dragIndex === desiredIndex) {
      return;
    }

    const direction = desiredIndex < dragIndex ? 'UP' : 'DOWN';

    setBoxes(
      boxes.map((x) => {
        if (x.index === dragIndex) {
          return { ...x, index: desiredIndex };
        }

        if (
          direction == 'UP' &&
          x.index < dragIndex &&
          x.index >= desiredIndex
        ) {
          return { ...x, index: x.index + 1 };
        }

        if (
          direction == 'DOWN' &&
          x.index > dragIndex &&
          x.index <= desiredIndex
        ) {
          return { ...x, index: x.index - 1 };
        }

        return x;
      }),
    );
  }

  function onBoxChange(newBox: BoxProperties) {
    // if the change has search by then all other boxes must not have it
    const isSearchBy = newBox.searchBy === true;
    setBoxes(
      boxes.map((x) => {
        if (x.index === newBox.index && x.name === newBox.name) {
          return newBox;
        }

        if (isSearchBy) {
          return { ...x, searchBy: false };
        }
        return x;
      }),
    );
  }

  function onSubmit() {
    properties.onFinish(boxes);
    setOpen(false);
  }

  return (
    <>
      <Dialog open={open}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Column Mode Picker</DialogTitle>
            <DialogDescription>
              Pick the modes for your columns.
              <br></br>
              <br></br>
              By default the first column will be used to search by text. Change
              this by clicking on the name of a different column.
            </DialogDescription>
          </DialogHeader>

          <div className='grid py-4'>
            {boxes
              .sort((a, b) => a.index - b.index)
              .map((box) => (
                <Fragment key={box.name}>
                  <DropZone onDrop={() => onDropZoneDrop(box.index)}></DropZone>
                  <DataDisplayBox
                    className='justify-start'
                    draggable={true}
                    onDragStart={() => {
                      setDragIndex(box.index);
                    }}
                    onDrop={() => onDataDisplayBoxDrop(box)}
                    onBoxChange={onBoxChange}
                    {...box}
                  ></DataDisplayBox>
                </Fragment>
              ))}
            <DropZone
              onDrop={() => onDropZoneDrop(boxes.length - 1)}
            ></DropZone>
          </div>
          <DialogFooter>
            <Button type='submit' onClick={onSubmit}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
