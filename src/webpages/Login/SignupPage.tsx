import { Undo2 } from "lucide-react";
import { useNavigate } from "react-router";
import SignupForm from "./SignupForm";

const SignupPage = () => {
  const navigate = useNavigate();
  return (
    <div className=" h-screen text-white bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-emerald-100 via-pink-700 to-neutral-700 flex justify-center">
      <div className="h-full max-w-[600px] w-full ">
        <Undo2
          className="absolute top-5 left-5 text-white"
          size={40}
          onClick={() => navigate("/")}
        />
        <div className="flex items-center justify-center w-full flex-col h-full">
          <h1 className="w-full pb-20 text-6xl font-semibold text-white pl-10 font">
            Sign Up
          </h1>
          <SignupForm />
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
