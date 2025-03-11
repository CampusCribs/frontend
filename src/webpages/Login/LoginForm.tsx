import React, { useState } from "react";
import { useNavigate } from "react-router";
import { z } from "zod";

const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type UserLogin = z.infer<typeof LoginSchema>;

const LoginForm = () => {
  const [formData, setFormData] = useState<UserLogin>({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Partial<UserLogin>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      LoginSchema.parse(formData);
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
    <div className="flex flex-col bg-Card w-[300px] h-">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center"
      >
        <input
          name="email"
          title="Email"
          className=" border rounded-lg p-3 bg-white text-black w-full shadow-xl "
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p className="text-yellow-200">{errors.email}</p>}
        <input
          name="password"
          title="password"
          placeholder="Password"
          type="password"
          className="border rounded-lg p-3 bg-white text-black my-3 w-full shadow-xl"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && (
          <p className="text-yellow-200">{errors.password}</p>
        )}
        <div className="w-full flex flex-row-reverse">
          <button
            type="submit"
            className="bg-blue-500 rounded-full p-2 px-6 text-lg shadow-xl"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
