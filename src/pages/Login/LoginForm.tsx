import React, { useState } from "react";
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

  const [errors, setErrors] = useState<Partial<UserLogin>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      LoginSchema.parse(formData);
      setErrors({});
      // Form is valid, proceed with submission
      console.log("Form data:", formData);
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
          className=" border rounded-lg p-2 bg-white text-black"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p>{errors.email}</p>}
        <input
          name="password"
          title="password"
          placeholder="Password"
          type="password"
          className="border rounded-lg p-2 bg-white text-black my-3"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <p>{errors.password}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
