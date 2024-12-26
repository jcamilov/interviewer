import * as React from "react";
import { DayPicker } from "react-day-picker";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={`p-3 bg-white dark:bg-gray-950 ${className}`}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button:
          "btn btn-outline btn-sm h-7 w-7 bg-transparent p-0 opacity-75 hover:opacity-100",
        nav_button_previous: "absolute left-2",
        nav_button_next: "absolute right-2",
        table: "w-full border-collapse",
        head_row: "flex justify-between w-full",
        head_cell: "w-9 font-normal text-[0.8rem] text-center",
        row: "flex w-full",
        cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
        day: "btn btn-ghost btn-sm h-9 w-9 p-0 font-normal",
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected: "bg-primary text-primary-content hover:bg-primary-focus",
        day_today: "bg-accent text-accent-content",
        day_outside: "text-muted opacity-50",
        day_disabled: "text-muted opacity-50",
        day_range_middle: "bg-accent text-accent-content",
        day_hidden: "invisible",
        ...classNames,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
