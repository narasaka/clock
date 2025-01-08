import { useEffect, useState } from "react";
import { QRCode } from "~/components/qrcode";
import { ThemeSwitcher } from "~/components/theme-switcher";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "~/components/ui/select";
import { SelectValue } from "@radix-ui/react-select";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { getTimezonesWithOffsets } from "~/lib/utils";
import { GuideDialog } from "./components/guide-dialog";

dayjs.extend(utc);
dayjs.extend(timezone);

function App() {
  const [selectedTimezone, setSelectedTimezone] = useState(dayjs.tz.guess());
  const [currentTime, setCurrentTime] = useState(dayjs().tz(selectedTimezone));
  const timezones = getTimezonesWithOffsets();

  useEffect(() => {
    const interval = setInterval(() => {
      const now = dayjs().tz(selectedTimezone);
      setCurrentTime(now);
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedTimezone]);

  return (
    <main className="flex h-dvh flex-col bg-background p-4">
      <header className="mx-auto flex w-full max-w-2xl gap-2">
        <Select
          onValueChange={(value) => {
            setSelectedTimezone(value);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Timezone" />
          </SelectTrigger>
          <SelectContent>
            {timezones.map((timezone) => (
              <SelectItem value={timezone.timezone}>
                {timezone.timezone} (GMT{timezone.offset})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <ThemeSwitcher />
      </header>
      <div className="flex grow flex-col items-center justify-center">
        <QRCode
          value={currentTime.format("hh:mm:ss A")}
          className="aspect-square w-full max-w-2xl p-1"
        />
      </div>
      <footer className="mx-auto w-full max-w-2xl space-y-1 font-mono text-sm">
        <GuideDialog />
        <a
          href="https://github.com/narasaka/clock"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
        >
          {"> source code"}
        </a>
      </footer>
    </main>
  );
}

export default App;
