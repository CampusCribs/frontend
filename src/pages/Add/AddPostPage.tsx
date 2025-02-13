import React, { useState } from "react";
import { useNavigate } from "react-router";
import { z } from "zod";
import CalendarComponent from "./CalendarComponent";

const PostSchema = z.object({
  title: z.string().min(6, "Title must be at least 6 characters"),
  description: z.string().min(6, "Description must be at least 6 characters"),
  price: z.number().min(1, "Price must be at least 1"),
  roomates: z.number().min(1, "Roomates must be at least 1"),
  beginDate: z.date(),
  endDate: z.date(),
});

type PostInfo = z.infer<typeof PostSchema>;

const AddPostPage = () => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
      }
    }
  };
  return (
    <div className="w-full h-full">
      <h1 className="text-4xl text-left pl-6 pb-5">Add Post</h1>
      <div className="flex flex-col bg-Card w-[300px] h-">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center items-center"
        >
          <div className="flex ">
            <h1 className="semibold mr-5">Title:</h1>
            <input
              name="title"
              title="title"
              className=" border rounded-lg p-3 bg-white text-black w-full shadow-xl "
              placeholder="title"
              value={formData.title}
              onChange={handleChange}
            />
            {errors.title && <p className="text-red-500">{errors.title}</p>}
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
            name="price"
            title="price"
            placeholder="price"
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
          <CalendarComponent begin={true} />
          <CalendarComponent begin={false} />
          <div className="w-full flex flex-row-reverse">
            <button
              type="submit"
              className="bg-blue-500 text-white rounded-full p-2 px-6 text-lg shadow-xl"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPostPage;
