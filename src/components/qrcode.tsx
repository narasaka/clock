import { QRCodeSVG } from "qrcode.react";
import { useTheme } from "~/components/theme-provider";
import { type HTMLAttributes, useRef } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const QRCode: React.FC<Props> = ({ value, className }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { theme } = useTheme();
  const isDarkTheme = theme === "dark";

  return (
    <div ref={containerRef} className={className}>
      <QRCodeSVG
        value={value}
        size={512}
        bgColor={isDarkTheme ? "#09090b" : "#fff"}
        fgColor={isDarkTheme ? "#fff" : "#09090b"}
        level="L"
        className="h-full w-full"
      />
    </div>
  );
};
