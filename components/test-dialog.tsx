"use client";

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation";

type TestDialogProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
};

const TestDialog = ({ open, setOpen} : TestDialogProps) => {
  const router = useRouter();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-green-500">Want to give a test ?</DialogTitle>
            <DialogDescription className="mt-2">
                Give a test to get better and personalized career paths and roadmaps.
                <p className="text-blue-500 mt-2 text-[12px]">69% users who took the test found it helpful.</p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button className="bg-green-500 cursor-pointer" onClick={() => router.push('/interest-detector')}>Yes</Button>
            <Button className="bg-red-500 cursor-pointer">No</Button>
          </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default TestDialog;