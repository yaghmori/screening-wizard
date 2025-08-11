"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface CalendarPickerProps {
  label?: string;
  value?: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function CalendarPicker({ 
  label, 
  value, 
  onChange, 
  placeholder = "Select date",
  className = "",
  disabled = false 
}: CalendarPickerProps) {
  const [open, setOpen] = React.useState(false)
  
  // Convert string date to Date object for the calendar
  const date = value ? new Date(value) : undefined

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {label && (
        <Label className="px-1">
          {label}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between font-normal"
            disabled={disabled}
          >
            {date ? date.toLocaleDateString() : placeholder}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(selectedDate) => {
              // Convert Date object back to ISO string format (YYYY-MM-DD)
              const dateString = selectedDate ? selectedDate.toISOString().split('T')[0] : null
              onChange(dateString)
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
