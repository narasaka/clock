import { useEffect, useState } from "react";
import { QRCode } from "./components/qrcode";
import { ThemeSwitcher } from "./components/theme-switcher";

function App() {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="flex h-dvh flex-col bg-background p-4">
      <header className="flex w-full max-w-5xl flex-row-reverse">
        <ThemeSwitcher />
      </header>
      <div className="flex grow flex-col items-center justify-center">
        <QRCode
          value={currentTime}
          className="aspect-square w-full max-w-2xl p-12"
        />
      </div>
    </main>
  );
}

export default App;
