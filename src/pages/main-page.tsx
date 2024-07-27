import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ImportDialogue } from '@/components/import-dialogue';
import { useState } from 'react';
import { DataDisplayChooser } from '@/components/data-display-chooser';
import { ImageTable } from '@/components/image-table';
import { useAppDispatch } from '@/app/store/hooks';
import { setColumnSettings } from '@/app/store/slices/table-slice';

export default function MainPage() {
    const dispatch = useAppDispatch();

  const [columnChooserDialogueOpen, setColumnChooserDialogueOpen] =
    useState(false);

  function handleImportSuccess() {
    setColumnChooserDialogueOpen(true);
  }

  return (
    // TODO: move all tags till main (included) into a page wrapper orsm
    <div className='flex min-h-screen w-full flex-col bg-muted/40'>
      <div className='flex flex-col sm:gap-4 sm:py-4 sm:pl-14'>
        <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
          <div className='flex items-center'>
            <div className='ml-auto flex items-center gap-2'>
              <ImportDialogue onSuccess={handleImportSuccess}></ImportDialogue>
            </div>
          </div>
          <Card x-chunk='dashboard-06-chunk-0'>
            <CardHeader>
              <CardTitle>Images</CardTitle>
              <CardDescription>
                Here are your images, click on them for fullscreen picture
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageTable></ImageTable>
            </CardContent>
          </Card>
          {columnChooserDialogueOpen && (
            <DataDisplayChooser
              onFinish={(boxes) => {
                console.log(boxes);
                dispatch(setColumnSettings(boxes))
                setColumnChooserDialogueOpen(false);
              }}
            ></DataDisplayChooser>
          )}
        </main>
      </div>
    </div>
  );
}
