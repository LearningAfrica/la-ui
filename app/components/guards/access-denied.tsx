import { Lock } from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty";

export default function AccessDenied() {
  return (
    <div className="grid h-full grid-rows-2">
      <div className="flex items-center justify-center">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="default">
              <Lock />
            </EmptyMedia>
            <EmptyTitle>Could not load resource</EmptyTitle>
            <EmptyDescription>
              Please check your link if you believe this is an error, contact
              support.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>{/* <Button>Add data</Button> */}</EmptyContent>
        </Empty>
      </div>
      <div className="bg-neutral-100"></div>
    </div>
  );
}
