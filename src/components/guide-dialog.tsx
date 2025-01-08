import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "~/components/ui/dialog";

export const GuideDialog = () => (
  <Dialog>
    <DialogTrigger className="hover:underline hover:underline-offset-4">
      {"> how do i read this?"}
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>Reading the clock</DialogHeader>
      <DialogDescription>
        Open your phone's camera app and just... read. Yes, you don't have to go
        anywhere. Stay in your camera app. I have only tested on iOS devices, so
        I have no idea about what to do on Android, but do enjoy this clock.
      </DialogDescription>
    </DialogContent>
  </Dialog>
);
