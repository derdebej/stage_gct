import React from "react";

interface DateFilterProps {
  year: string;
  month: string;
  day: string;
  setYear: (val: string) => void;
  setMonth: (val: string) => void;
  setDay: (val: string) => void;
}

const DateFilter: React.FC<DateFilterProps> = ({
  year,
  month,
  day,
  setYear,
  setMonth,
  setDay,
}) => {
  return (
    <div className="flex gap-2">
      <input
        type="number"
        placeholder="Année"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        className="border rounded-md px-3 py-1 text-sm text-gray-700 w-30"
      />
      <input
        type="number"
        placeholder="Mois"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="border rounded-md px-3 py-1 text-sm text-gray-700 w-30"
      />
      <input
        type="number"
        placeholder="Jour"
        value={day}
        onChange={(e) => setDay(e.target.value)}
        className="border rounded-md px-3 py-1 text-sm text-gray-700 w-30"
      />
    </div>
  );
};

export default DateFilter;
