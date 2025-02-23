import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { z } from "zod";

import { Label } from "@/components/ui/label";

const PostSchema = z.object({
  title: z.string().min(5, "Title must be at least 6 characters"),
  description: z.string().min(6, "Description must be at least 6 characters"),
  price: z.number().min(1, "Price must be at least 1"),
  roommates: z.number().min(1, "Roomates must be at least 1"),
  beginDate: z.date(),
  endDate: z.date(),
});

type PostInfo = z.infer<typeof PostSchema>;

type props = {
  hide: boolean;
  next: boolean;
  errorGoBack: () => void;
};

const AddPostPageOne = ({ hide, next, errorGoBack }: props) => {
  const [formData, setFormData] = useState<PostInfo>({
    title: "",
    description: "",
    price: 0,
    roommates: 0,
    beginDate: new Date(),
    endDate: new Date(),
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Partial<PostInfo>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
    setErrors({});
  };

  useEffect(() => {
    if (next) {
      try {
        PostSchema.parse(formData);
        setErrors({});
        // Form is valid, proceed with submission

        navigate("/");
      } catch (error) {
        if (error instanceof z.ZodError) {
          const fieldErrors = error.flatten().fieldErrors;
          setErrors(fieldErrors);
          errorGoBack();
        }
      }
    }
  }, [next]);
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
            <Label htmlFor="roommates" className="">
              Number of roommates:
            </Label>
            <input
              name="roommates"
              title="roommates"
              placeholder="roommates"
              type="number"
              className="border rounded-lg p-3 bg-white text-black my-3 w-full shadow-xl"
              value={formData.roommates}
              onChange={handleChange}
              max={10}
            />
            {errors.roommates && (
              <p className="text-red-500">{errors.roommates}</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPostPageOne;
