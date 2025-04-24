"use client"

import * as React from "react"
import { addYears, format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function DatePicker({
                             value,
                             onChange,
                             placeholder = "Pick a date",
                             className,
                             disabled = false
                           }: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [currentDate, setCurrentDate] = React.useState<Date>(
      value || new Date()
  )

  // Calculate date ranges
  const maxDate = addYears(new Date(), -18)
  const minDate = addYears(new Date(), -100)
  const years = Array.from(
      { length: maxDate.getFullYear() - minDate.getFullYear() + 1 },
      (_, i) => maxDate.getFullYear() - i
  )
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  // Handle year/month selection
  const handleYearChange = (year: string) => {
    const newDate = new Date(currentDate)
    newDate.setFullYear(parseInt(year))
    setCurrentDate(newDate)
  }

  const handleMonthChange = (monthName: string) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(months.indexOf(monthName))
    setCurrentDate(newDate)
  }

  // Update current date when value changes
  React.useEffect(() => {
    if (value) {
      setCurrentDate(value)
    }
  }, [value])

  return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
              variant={"outline"}
              className={cn(
                  "w-full justify-start text-left font-normal",
                  !value && "text-muted-foreground",
                  className
              )}
              disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "PPP") : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3 border-b border-border">
            <div className="flex gap-2">
              <Select
                  value={months[currentDate.getMonth()]}
                  onValueChange={handleMonthChange}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {months.map((month) => (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                  value={currentDate.getFullYear().toString()}
                  onValueChange={handleYearChange}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Calendar
              mode="single"
              selected={value}
              onSelect={(date) => {
                onChange?.(date)
                setIsOpen(false)
              }}
              defaultMonth={currentDate}
              fromDate={minDate}
              toDate={maxDate}
              initialFocus
          />
        </PopoverContent>
      </Popover>
  )
}