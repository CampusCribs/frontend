import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { setPostData } from "../../state/slices/Post";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";

type props = {
  begin: boolean;
};
const CalendarComponent = ({ begin }: props) => {
  const dispatch = useDispatch<AppDispatch>();
  const current = useSelector(
    (state: RootState) => state.persistedReducer.PostData
  );
  const [date, setDate] = useState<Date>();

  useEffect(() => {
    if (date) {
      if (begin) {
        dispatch(
          setPostData({
            ...current,
            BeginDate: date.toISOString(),
          })
        );
      } else {
        dispatch(
          setPostData({
            ...current,
            EndDate: date.toISOString(),
          })
        );
      }
    }
  }, [date]);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default CalendarComponent;
