"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export function DividendFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // If min_yield is not present, default to "3.5".
  const currentParam = searchParams.get("min_yield");
  const currentValue = currentParam === null ? "3.5" : currentParam;

  const handleValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("min_yield", value);

    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium">配当利回り:</span>
      <Select
        value={currentValue}
        onValueChange={handleValueChange}
        disabled={isPending}
      >
        <SelectTrigger className="w-35">
          <SelectValue placeholder="配当利回り" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="4">4%以上</SelectItem>
          <SelectItem value="3.75">3.75%以上</SelectItem>
          <SelectItem value="3.5">3.5%以上</SelectItem>
          <SelectItem value="3">3%以上</SelectItem>
          <SelectItem value="0">全て</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
