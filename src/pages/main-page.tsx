import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ImportDialogue } from "@/components/import-dialogue";
import { useState } from "react";
import { DataDisplayChooser } from "@/components/data-display-chooser";
import { ImageTable } from "@/components/image-table";
import { useAppDispatch } from "@/app/store/hooks";
import { setColumnSettings } from "@/app/store/slices/table-slice";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Image } from "lucide-react";

export default function MainPage() {
  const dispatch = useAppDispatch();

  const [columnChooserDialogueOpen, setColumnChooserDialogueOpen] =
    useState(false);

  function handleImportSuccess() {
    setColumnChooserDialogueOpen(true);
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="flex items-center">
            <div className="ml-auto flex items-center gap-2">
              <Link to="view-image" target="_blank">
                <Button size="sm" variant="outline" className="h-8 gap-1">
                  <Image className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Image View Window
                  </span>
                </Button>
              </Link>

              <ImportDialogue onSuccess={handleImportSuccess}></ImportDialogue>
            </div>
          </div>
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Images</CardTitle>
              <CardDescription>
                Here are your images, click on them to see them change in the
                image view window
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageTable></ImageTable>
            </CardContent>
          </Card>
          {columnChooserDialogueOpen && (
            <DataDisplayChooser
              onFinish={(boxes) => {
                dispatch(setColumnSettings(boxes));
                setColumnChooserDialogueOpen(false);
              }}
            ></DataDisplayChooser>
          )}
        </main>
      </div>
    </div>
  );
}
