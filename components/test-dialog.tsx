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
import { Sparkles, ArrowRight } from "lucide-react";

type TestDialogProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
};

const TestDialog = ({ open, setOpen} : TestDialogProps) => {
  const router = useRouter();
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[400px] border border-white/10 bg-[#0B0E14] p-0 shadow-2xl gap-0">
          
          <div className="p-6 pb-2 flex flex-col items-center text-center">
            {/* Icon Wrapper */}
            <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                <Sparkles className="h-6 w-6 text-white" />
            </div>

            <DialogHeader className="mb-2">
                <DialogTitle className="text-xl font-semibold text-white text-center">
                    Analyze your potential?
                </DialogTitle>
                <DialogDescription className="text-zinc-400 text-center leading-relaxed">
                    Take a quick assessment to unlock personalized career paths and tailored roadmaps.
                </DialogDescription>
            </DialogHeader>

            {/* Stat Badge */}
            <div className="mt-4 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5">
                <p className="text-[11px] font-medium text-emerald-400 flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    69% of users found this helpful
                </p>
            </div>
          </div>

          <DialogFooter className="p-6 pt-2 flex flex-col gap-2 sm:flex-col sm:space-x-0">
            <Button 
                className="w-full bg-white text-black hover:bg-zinc-200 font-semibold h-11" 
                onClick={() => router.push('/interest-detector')}
            >
                Take the Test
                <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <Button 
                variant="ghost" 
                className="w-full text-zinc-500 hover:text-white hover:bg-white/5 h-11"
                onClick={() => setOpen(false)}
            >
                No, skip for now
            </Button>
          </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default TestDialog;