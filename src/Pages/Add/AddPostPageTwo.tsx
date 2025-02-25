import { Label } from "@radix-ui/react-label";
import React, { useEffect, useState } from "react";
import CalendarComponent from "./CalendarComponent";
import { Input } from "@/components/ui/input";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";

type Props = {
  hide: boolean;
};

const AddPostPageTwo = ({ hide }: Props) => {
  const [images, setImages] = useState<File[]>([]);
  const current = useSelector(
    (state: RootState) => state.persistedReducer.PostData
  );
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]);
    }
  };
  // handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {};
  useEffect(() => {
    console.log(current);
    if (hide) {
      // set the info to state
    }
  }, [hide]);
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
          <Input type="file" accept="image/*" onChange={handleFileUpload} />
        </div>
        <div className="p-3 flex flex-row flex-wrap w-full items-center justify-left">
          {images &&
            Array.from(images).map((image) => (
              <img
                key={image.name}
                src={URL.createObjectURL(image)}
                alt="uploaded image"
                onClick={() => {
                  setImages(images.filter((i) => i.name !== image.name));
                }}
                className="w-32 h-32 object-cover m-2 border border-black rounded-xl shadow-xl "
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default AddPostPageTwo;
