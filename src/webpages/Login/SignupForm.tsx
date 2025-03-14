import React, { useState } from "react";
import { useNavigate } from "react-router";
import { z } from "zod";

const SignupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  userName: z.string().min(6, "Username must be at least 6 characters"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 characters"),
});

type UserSignup = z.infer<typeof SignupSchema>;

const SignupForm = () => {
  const [formData, setFormData] = useState<UserSignup>({
    email: "",
    password: "",
    confirmPassword: "",
    userName: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Partial<UserSignup>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      SignupSchema.parse(formData);
      setErrors({});
      // Form is valid, proceed with submission
      if (formData.password !== formData.confirmPassword) {
        setErrors({ confirmPassword: "Passwords do not match" });
        return;
      }
      console.log("Form data:", formData);
      //TODO: Submit form data to server and attach cookie/jwt to response as well as make sure username is distinct
      navigate("/");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        setErrors(fieldErrors);
      }
    }
  };

  return (
    <div className="flex flex-col bg-Card w-[340px] h-">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center"
      >
        <div className="flex flex-row w-full mb-1">
          <div className="flex flex-col pr-1">
            <input
              name="firstName"
              title="firstName"
              className=" border rounded-lg p-3 bg-white  text-black w-full shadow-xl "
              placeholder="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
            {errors.firstName && (
              <p className="text-yellow-200">{errors.firstName}</p>
            )}
          </div>
          <div className="flex flex-col pl-1">
            <input
              name="lastName"
              title="lastName"
              className=" border rounded-lg p-3 bg-white  text-black w-full shadow-xl "
              placeholder="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
            {errors.lastName && (
              <p className="text-yellow-200">{errors.lastName}</p>
            )}
          </div>
        </div>
        <input
          name="email"
          title="Email"
          className=" border rounded-lg p-3 bg-white my-1 text-black w-full shadow-xl "
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          name="userName"
          title="userName"
          placeholder="username"
          className="border rounded-lg p-3 bg-white text-black my-1 w-full shadow-xl"
          value={formData.userName}
          onChange={handleChange}
        />
        {errors.userName && (
          <p className="text-yellow-200">{errors.userName}</p>
        )}
        {errors.email && <p className="text-yellow-200">{errors.email}</p>}
        <input
          name="phoneNumber"
          title="phoneNumber"
          className=" border rounded-lg p-3 bg-white my-1 text-black w-full shadow-xl "
          placeholder="phone number"
          value={formData.phoneNumber}
          onChange={handleChange}
        />
        {errors.phoneNumber && (
          <p className="text-yellow-200">{errors.phoneNumber}</p>
        )}
        <input
          name="password"
          title="password"
          placeholder="Password"
          type="password"
          className="border rounded-lg p-3 bg-white text-black my-1 w-full shadow-xl"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && (
          <p className="text-yellow-200">{errors.password}</p>
        )}
        <input
          name="confirmPassword"
          title="confirmPassword"
          placeholder="Confirm Password"
          type="password"
          className="border rounded-lg p-3 bg-white text-black my-1 w-full shadow-xl"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        {errors.confirmPassword && (
          <p className="text-yellow-200">{errors.confirmPassword}</p>
        )}
        <div className="w-full flex flex-row-reverse">
          <button
            type="submit"
            className="bg-blue-500 rounded-full p-2 px-6 text-lg shadow-xl"
          >
            Sign Up
          </button>
          <div
            className="text-sm underline font-light mr-auto ml-2 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Already have an account?
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
