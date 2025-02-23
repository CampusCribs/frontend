import { addUser } from "@/lib/actions";
import { useState } from "react";
import { z } from "zod";
import AddedToCartNote from "./AddedToCartNote";

const SignupSchema = z.object({
  email: z.string().email("Invalid email address"),
  Name: z.string().min(6, "Name must be at least 6 characters"),
});

type UserSignin = z.infer<typeof SignupSchema>;

const HomePage = () => {
  const [formData, setFormData] = useState<UserSignin>({
    email: "",
    Name: "",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [show, setShow] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<UserSignin>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      SignupSchema.parse(formData);
      setErrors({});
      // Form is valid, proceed with submission
      const firebasemessage = await addUser(formData.email, formData.Name);
      setMessage(firebasemessage);
      setShow(true);
      setTimeout(() => {
        setShow(false);
      }, 3000);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        setErrors(fieldErrors);
      }
    }
  };

  return (
    <div className=" h-full flex-col flex justify-center items-center">
      <div>
        <div className="w-full h-96 flex justify-center items-center p-5 ">
          <img
            alt="housing image"
            className="object-cover w-full h-full border border-stone-800 rounded-xl shadow-xl"
            src="https://www.uc.edu/news/articles/2022/05/n21087122/_jcr_content/main/responsive_section/par/textimage/image.img.jpeg/1651865176655/calhoun-reno3.jpeg"
          />
        </div>
        <h1 className="flex justify-center items-center font-semibold text-xl text-center">
          Exciting News! Our Site Will Be Live Soon – Stay Tuned!
        </h1>
      </div>
      <div className="flex justify-center items-center mt-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="text-lg font-semibold">Pre-Register Now!</div>
            <div className="text-md max-w-[700px]">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col justify-center items-center"
              >
                <input
                  name="Name"
                  title="Name"
                  className=" border rounded-lg p-3 bg-white text-black w-full shadow-xl "
                  placeholder="name"
                  value={formData.Name}
                  onChange={handleChange}
                />
                {errors.Name && <p className="text-red-600">{errors.Name}</p>}
                <input
                  name="email"
                  title="email"
                  placeholder="email"
                  type="email"
                  className="border rounded-lg p-3 bg-white text-black my-3 w-full shadow-xl"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <p className="text-red-600">{errors.email}</p>}
                <div className="w-full flex flex-row-reverse">
                  <button
                    type="submit"
                    className="bg-blue-500 rounded-full p-2 mt-2 text-white px-6 text-lg shadow-xl"
                  >
                    Register
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center mt-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="text-lg font-semibold px-2">About Us</div>
            <div className="text-md max-w-[700px] px-4">
              Campus Cribs is a platform that connects students with off-campus
              housing options. We provide a simple and easy way for students to
              find off-campus housing that fits their needs. Built by students
              for students.
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-20 border mt-5">
        <div className="flex m-3 font-semibold underline">
          <a href="mailto:Farahca@mail.uc.edu">Contact Us</a>
        </div>
      </div>
      <AddedToCartNote show={show} notification={message} />
    </div>
  );
};

export default HomePage;
