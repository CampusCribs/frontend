import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { z } from "zod";

import { Label } from "@/components/ui/label";
const PostSchema = z.object({
  title: z.string().min(6, "Title must be at least 6 characters"),
  description: z.string().min(6, "Description must be at least 6 characters"),
  price: z.number().min(1, "Price must be at least 1"),
  roomates: z.number().min(1, "Roomates must be at least 1"),
  beginDate: z.date(),
  endDate: z.date(),
});

type PostInfo = z.infer<typeof PostSchema>;

type props = {
  hide: boolean;
  submit: boolean;
  errorGoBack: () => void;
};

const AddPostPageOne = ({ hide, submit, errorGoBack }: props) => {
  const [formData, setFormData] = useState<PostInfo>({
    title: "",
    description: "",
    price: 0,
    roomates: 0,
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
    if (submit) {
      try {
        PostSchema.parse(formData);
        setErrors({});
        // Form is valid, proceed with submission
        console.log("Form data:", formData);
        navigate("/");
      } catch (error) {
        if (error instanceof z.ZodError) {
          const fieldErrors = error.flatten().fieldErrors;
          setErrors(fieldErrors);
          errorGoBack();
        }
      }
    }
  }, [submit]);
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
            {errors.price && <p className="text-red-500">{errors.price}</p>}
          </div>
          <div className="pl-3 flex flex-col w-full my-2">
            <Label htmlFor="description" className="">
              Description:
            </Label>
            <input
              name="description"
              title="description"
              placeholder="description"
              type="text"
              className="border rounded-lg p-3 bg-white text-black my-3 w-full shadow-xl"
              value={formData.price}
              onChange={handleChange}
            />
            {errors.price && <p className="text-red-500">{errors.price}</p>}
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
          <input
            name="description"
            title="description"
            placeholder="description"
            type="text"
            className="border rounded-lg p-3 bg-white text-black my-3 w-full shadow-xl"
            value={formData.description}
            onChange={handleChange}
          />
          {errors.description && (
            <p className="text-red-500">{errors.description}</p>
          )}
          <input
            name="description"
            title="description"
            placeholder="description"
            type="text"
            className="border rounded-lg p-3 bg-white text-black my-3 w-full shadow-xl"
            value={formData.description}
            onChange={handleChange}
          />
          {errors.description && (
            <p className="text-red-500">{errors.description}</p>
          )}
          <input
            name="description"
            title="description"
            placeholder="description"
            type="text"
            className="border rounded-lg p-3 bg-white text-black my-3 w-full shadow-xl"
            value={formData.description}
            onChange={handleChange}
          />
          {errors.description && (
            <p className="text-red-500">{errors.description}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddPostPageOne;
