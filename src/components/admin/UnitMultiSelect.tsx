"use client";

import { useId, useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export interface UnitOption {
  slug: string;
  title: string;
  arm?: string;
}

interface UnitMultiSelectProps {
  label: string;
  options: UnitOption[];
  selected: string[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
}

function toggle(selected: string[], slug: string): string[] {
  return selected.includes(slug) ? selected.filter((entry) => entry !== slug) : [...selected, slug];
}

export function UnitMultiSelect({
  label,
  options,
  selected,
  onChange,
  disabled = false,
}: UnitMultiSelectProps) {
  const id = useId();
  const [filter, setFilter] = useState("");

  const selectedTitles = useMemo(() => {
    const bySlug = new Map(options.map((option) => [option.slug, option.title]));
    return selected.map((slug) => bySlug.get(slug) ?? slug);
  }, [options, selected]);

  const filtered = useMemo(() => {
    const term = filter.trim().toLowerCase();
    if (!term) return options;
    return options.filter(
      (option) =>
        option.title.toLowerCase().includes(term) || option.slug.toLowerCase().includes(term),
    );
  }, [options, filter]);

  const summary =
    selectedTitles.length === 0
      ? "None selected"
      : selectedTitles.length <= 2
        ? selectedTitles.join(", ")
        : `${selectedTitles.length} selected`;

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            role="combobox"
            disabled={disabled || options.length === 0}
            aria-label={label}
            className="w-full justify-between font-normal"
          >
            <span
              className={cn("truncate", selectedTitles.length === 0 && "text-muted-foreground")}
            >
              {summary}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-[var(--radix-popover-trigger-width)] min-w-64 p-2"
        >
          {options.length > 6 ? (
            <div className="relative mb-2">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                placeholder={`Filter ${label.toLowerCase()}…`}
                className="h-8 pl-8 text-sm"
                aria-label={`Filter ${label}`}
              />
            </div>
          ) : null}
          <ScrollArea className="max-h-56">
            <div className="space-y-0.5">
              {filtered.length === 0 ? (
                <p className="px-2 py-3 text-xs text-muted-foreground">No matches.</p>
              ) : (
                filtered.map((option) => {
                  const optionId = `${id}-${option.slug}`;
                  const checked = selected.includes(option.slug);
                  return (
                    <div
                      key={option.slug}
                      className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-accent"
                    >
                      <Checkbox
                        id={optionId}
                        checked={checked}
                        onCheckedChange={() => onChange(toggle(selected, option.slug))}
                      />
                      <Label
                        htmlFor={optionId}
                        className="min-w-0 flex-1 cursor-pointer truncate text-sm font-normal"
                      >
                        {option.title}
                      </Label>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
          {selected.length > 0 ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="mt-2 w-full"
              onClick={() => onChange([])}
            >
              Clear
            </Button>
          ) : null}
        </PopoverContent>
      </Popover>
    </div>
  );
}
