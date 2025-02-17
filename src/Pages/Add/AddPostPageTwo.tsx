import { Label } from "@radix-ui/react-label";
import React, { useEffect } from "react";
import CalendarComponent from "./CalendarComponent";
import { Input } from "@/components/ui/input";

type Props = {
  hide: boolean;
  submit: boolean;
};

const AddPostPageTwo = ({ hide, submit }: Props) => {
  useEffect(() => {
    if (submit) {
      console.log("page two submit");
    }
  }, [submit]);
  return (
    <div className={`${hide ? "hidden" : "flex"}`}>
      <div className="flex flex-col w-full">
        <div className="pl-3 flex flex-col w-full my-2">
          <Label htmlFor="title" className="">
            Begin date:
          </Label>
          <CalendarComponent begin />
        </div>
        <div className="pl-3 flex flex-col w-full my-2">
          <Label htmlFor="title" className="">
            End date:
          </Label>
          <CalendarComponent begin={false} />
        </div>
        <div className="pl-3 flex flex-col w-full my-2">
          <Label htmlFor="title" className="">
            Upload images:
          </Label>
          <Input type="file" />
        </div>
      </div>
    </div>
  );
};

export default AddPostPageTwo;
