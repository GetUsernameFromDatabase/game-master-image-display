import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Delete, File } from "lucide-react";
import { useRef, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { parse as csvParse } from "csv-parse/browser/esm/sync";
import { ClimbingBoxLoader } from "react-spinners";
import { useAppDispatch } from "@/app/store/hooks";
import { setTableData } from "@/app/store/slices/table-slice";

const errorCodes = {
  responseNotOk: "RESPONSE_NOT_OK",
  noFile: "NO_FILE",
  noData: "NO_DATA",
  unknownError: "UNKNOWN_ERROR",
} as const;

type ErrorCodeValues = (typeof errorCodes)[keyof typeof errorCodes];
interface ImportResult {
  /** For non-thrown errors */
  errorCode: ErrorCodeValues | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[] | null;
}

function parseImportData(data: string) {
  const parsedData = csvParse(data, { columns: true });
  return parsedData;
}

async function importFromLink(csvLink: string): Promise<ImportResult> {
  const response = await fetch(csvLink);
  if (!response.ok) {
    return { errorCode: errorCodes.responseNotOk, data: null };
  }

  const text = await response.text();
  return { errorCode: null, data: parseImportData(text) };
}

async function importFromFile(input: HTMLInputElement): Promise<ImportResult> {
  if (!(input.files && input.files[0])) {
    return { errorCode: errorCodes.noFile, data: null };
  }
  const file = input.files[0];
  const content = await file.text();
  return { errorCode: null, data: parseImportData(content) };
}

export interface ImportDialogueProperties {
  onSuccess: () => void;
}
export function ImportDialogue({ onSuccess }: ImportDialogueProperties) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();

  const linkInput = useRef<HTMLInputElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  async function onSubmit() {
    if (!linkInput.current || !fileInput.current) {
      throw new Error("Link input and fileinput required");
    }

    const dataLink = linkInput.current.value;
    const file = fileInput.current.value;

    /**  */
    let result: ImportResult = { errorCode: errorCodes.noData, data: null };
    try {
      if (file) {
        result = await importFromFile(fileInput.current);
      } else if (dataLink) {
        setLoading(true);
        result = await importFromLink(dataLink);
      }
    } catch (error) {
      console.error("Error occured during import:", error);
      result.errorCode = errorCodes.unknownError;
    }

    setLoading(false);

    if (!result.errorCode && result.data) {
      dispatch(setTableData(result.data));
      setOpen(false);
      onSuccess();
      return;
    }

    console.error("No valid data found");
    // TODO: some error management
    // I am thinking display error text, red out the input (label?) that the error is associated with
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="h-8 gap-1">
          <File className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Import
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Table Data</DialogTitle>
          <DialogDescription>
            Import your table data wheter it be from a link or a file
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-6 items-center gap-4">
            <Label htmlFor="import-link" className="text-right">
              Link
            </Label>
            <Input
              id="import-link"
              ref={linkInput}
              type="text"
              className="col-span-5"
            />
          </div>
          <div className="text-center">or</div>
          <div className="grid grid-cols-6 items-center gap-4">
            <Label htmlFor="import-file" className="text-right">
              File
            </Label>
            <Input
              id="import-file"
              ref={fileInput}
              type="file"
              className="col-span-4"
              accept=".csv"
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <Delete
                  className="col-span-1"
                  onClick={() => {
                    if (fileInput.current?.value) fileInput.current.value = "";
                  }}
                ></Delete>
              </TooltipTrigger>
              <TooltipContent>
                <p>Discard the file</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <ClimbingBoxLoader
            color={"teal"}
            cssOverride={{
              display: "block",
              margin: "0 auto",
              borderColor: "red",
            }}
            loading={loading}
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
        <DialogFooter>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="submit" onClick={onSubmit}>
                Import
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                If file is selected then file will be used whatever is in the
                link input
              </p>
            </TooltipContent>
          </Tooltip>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
