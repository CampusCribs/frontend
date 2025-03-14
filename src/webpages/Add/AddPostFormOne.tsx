import React, { useState } from "react";
import { z } from "zod";

import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { setPostData } from "@/state/slices/Post";
import { useEffect } from "react";

const PostSchema = z.object({
  title: z.string().min(6, "Title must be at least 6 characters"),
  description: z.string().min(6, "Description must be at least 6 characters"),
  price: z.number().min(1, "Price must be at least 1"),
  roommates: z.number().min(1, "Roomates must be at least 1"),
});

type PostInfo = z.infer<typeof PostSchema>;

type props = {
  hide: boolean;
  moveForward: () => void;
};

const AddPostPageOne = ({ hide, moveForward }: props) => {
  const current = useSelector(
    (state: RootState) => state.persistedReducer.PostData
  );
  const [formData, setFormData] = useState<PostInfo>({
    title: "",
    description: "",
    price: 0,
    roommates: 0,
  });
  const dispatch = useDispatch<AppDispatch>();
  const [errors, setErrors] = useState<Partial<PostInfo>>({});
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "price" || name === "roommates") {
      if (Number.isNaN(parseInt(value))) {
        setFormData({ ...formData, [name]: 0 });
        return;
      } else setFormData({ ...formData, [name]: parseInt(value) });
      return;
    }
    setFormData({ ...formData, [name]: value });
    setErrors({});
  };
  const handleNext = () => {
    try {
      PostSchema.parse(formData);
      dispatch(
        setPostData({
          ...formData,
          BeginDate: current.BeginDate,
          EndDate: current.EndDate,
        })
      );
      moveForward();
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.formErrors.fieldErrors);
      }
    }
  };
  useEffect(() => {
    console.log(current);
  }, [current]);
  return (
    <div className={`w-full h-full ${hide ? "hidden" : "flex"}`}>
      <div className="flex flex-col bg-Card w-full ">
        <form
          onSubmit={(e) => e.preventDefault()} // Prevent form submission
          className="flex flex-col justify-center items-center w-full"
        >
          <div className="pl-3 flex flex-col w-full my-2">
            <Label htmlFor="title" className="">
              Title:
            </Label>
            <input
              name="title"
              title="title"
              placeholder="title"
              type="text"
              className="border rounded-lg p-3 bg-white text-black my-3 w-full shadow-xl"
              value={formData.title}
              onChange={handleChange}
            />
            {errors.title && <p className="text-red-500">{errors.title}</p>}
          </div>
          <div className="pl-3 flex flex-col w-full my-2">
            <Label htmlFor="description" className="">
              Description:
            </Label>
            <textarea
              name="description"
              title="description"
              placeholder="description"
              className="border rounded-lg p-3 bg-white text-black my-3 w-full shadow-xl"
              value={formData.description}
              onChange={handleChange}
            />
            {errors.description && (
              <p className="text-red-500">{errors.description}</p>
            )}
          </div>
          <div className="pl-3 flex flex-col w-full my-2">
            <Label htmlFor="price" className="">
              Price:
            </Label>
            <input
              name="price"
              title="price"
              placeholder="price"
              type="text"
              className="border rounded-lg p-3 bg-white text-black my-3 w-full shadow-xl"
              value={formData.price}
              onChange={handleChange}
            />
            {errors.price && <p className="text-red-500">{errors.price}</p>}
          </div>
          <div className="pl-3 flex flex-col w-full my-2">
            <Label htmlFor="price" className="">
              Number of roommates:
            </Label>
            <input
              name="roommates"
              title="roommates"
              placeholder="roommates"
              className="border rounded-lg p-3 bg-white text-black my-3 w-full shadow-xl"
              value={formData.roommates}
              onChange={handleChange}
            />
            {errors.roommates && (
              <p className="text-red-500">{errors.roommates}</p>
            )}
          </div>
        </form>
        <div className="flex flex-row-reverse justify-between p-4">
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-full p-2 px-6 text-lg shadow-xl"
            onClick={handleNext}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPostPageOne;
