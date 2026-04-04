import { useState, useEffect, useMemo } from "react"
import {
  format,
  startOfMonth,
  startOfYear,
  endOfMonth,
  endOfYear,
  addMonths,
} from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DateRangePickerProps {
  startDate: Date | undefined
  endDate: Date | undefined
  onChange: (dates: [Date | null, Date | null]) => void
  className?: string
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
  placeholder?: {
    start?: string
    end?: string
  }
}

interface QuickSelectItem {
  label: string
  getDate: () => Date
}

function QuickSelectPanel({ items, onSelect }: { items: QuickSelectItem[]; onSelect: (date: Date) => void }) {
  return (
    <div className="hidden sm:flex flex-col gap-1 border-r border-border p-3 bg-muted/50 dark:bg-muted/20 shrink-0">
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
        Quick Select
      </div>
      {items.map((item) => (
        <Button
          key={item.label}
          variant="ghost"
          size="sm"
          className="justify-start"
          onClick={() => onSelect(item.getDate())}
        >
          {item.label}
        </Button>
      ))}
    </div>
  )
}

const START_QUICK_SELECTS: QuickSelectItem[] = [
  { label: "Today", getDate: () => new Date() },
  { label: "Start of Month", getDate: () => startOfMonth(new Date()) },
  { label: "Start of Year", getDate: () => startOfYear(new Date()) },
]

const END_QUICK_SELECTS: QuickSelectItem[] = [
  { label: "Today", getDate: () => new Date() },
  { label: "End of Month", getDate: () => endOfMonth(new Date()) },
  { label: "End of Year", getDate: () => endOfYear(new Date()) },
  { label: "End of Next Month", getDate: () => endOfMonth(addMonths(new Date(), 1)) },
  { label: "End of Next Year", getDate: () => endOfYear(addMonths(new Date(), 12)) },
]

function DateRangePicker({
  startDate,
  endDate,
  onChange,
  className = "",
  disabled = false,
  minDate,
  maxDate,
  placeholder,
}: DateRangePickerProps) {
  const [localStartDate, setLocalStartDate] = useState<Date | undefined>(startDate)
  const [localEndDate, setLocalEndDate] = useState<Date | undefined>(endDate)
  const [startMonth, setStartMonth] = useState<Date | undefined>(startDate)
  const [endMonth, setEndMonth] = useState<Date | undefined>(endDate)

  useEffect(() => {
    setLocalStartDate(startDate)
    setLocalEndDate(endDate)
    setStartMonth(startDate)
    setEndMonth(endDate)
  }, [startDate, endDate])

  const handleStartDateSelect = (date: Date | undefined) => {
    setLocalStartDate(date)
    if (date) setStartMonth(date)
    if (date && localEndDate && date > localEndDate) {
      setLocalEndDate(date)
      onChange([date, date])
    } else {
      onChange([date || null, localEndDate || null])
    }
  }

  const handleEndDateSelect = (date: Date | undefined) => {
    setLocalEndDate(date)
    if (date) setEndMonth(date)
    if (date && localStartDate && date < localStartDate) {
      setLocalStartDate(date)
      onChange([date, date])
    } else {
      onChange([localStartDate || null, date || null])
    }
  }

  const dateDisabledMatcher = useMemo(
    () =>
      minDate || maxDate
        ? (date: Date) => {
            if (minDate && date < minDate) return true
            if (maxDate && date > maxDate) return true
            return false
          }
        : undefined,
    [minDate, maxDate]
  )

  return (
    <div data-slot="date-range-picker" className={cn("flex flex-col sm:flex-row gap-2", className)}>
      {/* Start Date Picker */}
      <div className="flex-1">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !localStartDate && "text-muted-foreground",
                disabled && "cursor-not-allowed opacity-50"
              )}
              disabled={disabled}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {localStartDate
                ? format(localStartDate, "dd/MM/yyyy")
                : placeholder?.start || "Start date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto min-w-[22rem] p-0" align="start">
            <div className="flex">
              <QuickSelectPanel items={START_QUICK_SELECTS} onSelect={handleStartDateSelect} />
              <Calendar
                className="min-w-0 flex-1"
                mode="single"
                selected={localStartDate}
                onSelect={handleStartDateSelect}
                month={startMonth}
                onMonthChange={setStartMonth}
                disabled={dateDisabledMatcher}
                initialFocus
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Separator */}
      <div className="flex items-center justify-center">
        <span className="text-muted-foreground text-sm">to</span>
      </div>

      {/* End Date Picker */}
      <div className="flex-1">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !localEndDate && "text-muted-foreground",
                disabled && "cursor-not-allowed opacity-50"
              )}
              disabled={disabled}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {localEndDate
                ? format(localEndDate, "dd/MM/yyyy")
                : placeholder?.end || "End date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto min-w-[22rem] p-0" align="start">
            <div className="flex">
              <QuickSelectPanel items={END_QUICK_SELECTS} onSelect={handleEndDateSelect} />
              <Calendar
                className="min-w-0 flex-1"
                mode="single"
                selected={localEndDate}
                onSelect={handleEndDateSelect}
                month={endMonth}
                onMonthChange={setEndMonth}
                disabled={dateDisabledMatcher}
                initialFocus
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

export { DateRangePicker, type DateRangePickerProps }
