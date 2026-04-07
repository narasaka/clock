import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { Search, ChevronDown, Check } from "lucide-react";
import { filterTimezones, type TimezoneWithOffset, cn } from "~/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

interface TimezoneSelectProps {
  timezones: TimezoneWithOffset[];
  value: string;
  onChange: (timezone: string) => void;
  placeholder?: string;
}

export function TimezoneSelect({
  timezones,
  value,
  onChange,
  placeholder = "Select timezone...",
}: TimezoneSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const filteredTimezones = useMemo(() => {
    return filterTimezones(timezones, searchQuery);
  }, [timezones, searchQuery]);

  const selectedTimezone = useMemo(() => {
    return timezones.find((tz) => tz.timezone === value);
  }, [timezones, value]);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [searchQuery]);

  useEffect(() => {
    const highlightedItem = itemRefs.current[highlightedIndex];
    if (highlightedItem) {
      highlightedItem.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex]);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleSelect = useCallback(
    (timezone: string) => {
      onChange(timezone);
      setOpen(false);
      setSearchQuery("");
      setHighlightedIndex(0);
    },
    [onChange],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (filteredTimezones.length === 0) {
      e.stopPropagation();
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        e.stopPropagation();
        setHighlightedIndex((prev) =>
          prev < filteredTimezones.length - 1 ? prev + 1 : 0,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        e.stopPropagation();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredTimezones.length - 1,
        );
        break;
      case "Enter":
        e.preventDefault();
        e.stopPropagation();
        if (filteredTimezones[highlightedIndex]) {
          handleSelect(filteredTimezones[highlightedIndex].timezone);
        }
        break;
      case "Escape":
        e.stopPropagation();
        setOpen(false);
        break;
      default:
        e.stopPropagation();
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          )}
        >
          <span className={cn(!selectedTimezone && "text-muted-foreground")}>
            {selectedTimezone
              ? `${selectedTimezone.timezone} (GMT${selectedTimezone.offset})`
              : placeholder}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[200px] p-0"
        align="start"
        sideOffset={4}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <div className="border-b p-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search city or GMT..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              className={cn(
                "flex h-9 w-full rounded-sm border border-input bg-transparent",
                "pl-8 pr-3 text-sm placeholder:text-muted-foreground",
                "focus:outline-none focus:ring-1 focus:ring-ring",
              )}
            />
          </div>
        </div>
        <div className="max-h-[300px] overflow-auto p-1">
          {filteredTimezones.length > 0 ? (
            filteredTimezones.map((timezone, index) => (
              <button
                key={timezone.timezone}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                type="button"
                onClick={() => handleSelect(timezone.timezone)}
                className={cn(
                  "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
                  index === highlightedIndex &&
                    "bg-accent text-accent-foreground",
                  index !== highlightedIndex &&
                    "hover:bg-accent/50 hover:text-accent-foreground",
                  value === timezone.timezone &&
                    index !== highlightedIndex &&
                    "bg-accent/30",
                )}
              >
                <span className="flex-1 text-left">
                  {timezone.timezone} (GMT{timezone.offset})
                </span>
                {value === timezone.timezone && (
                  <Check className="ml-2 h-4 w-4" />
                )}
              </button>
            ))
          ) : (
            <div className="px-2 py-4 text-center text-sm text-muted-foreground">
              No timezones found
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
