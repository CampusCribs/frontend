import FaqItem from "./FaqItem";

const faqs = [
  {
    id: 1,
    question: "How do I reset my password?",
    answer:
      "Application is in beta. Please contact support to reset your password.",
  },
  {
    id: 2,
    question: "How do I change my email address?",
    answer:
      "Application is in beta. Please contact support to change your email.",
  },
  {
    id: 3,
    question: "How do I delete my account?",
    answer:
      "Application is in beta. Please contact support to delete your account.",
  },
];
const SupportPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-center mt-5">Support </h1>
      <div className="flex justify-center items-center">
        <div className="flex flex-col mt-10 w-full  p-5 rounded-lg ">
          {faqs.map((item) => (
            <FaqItem
              key={item.id}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </div>
      </div>
      <div>
        <div className="flex justify-center text-xl font-semibold">
          Have more questions?{" "}
        </div>
        <div className="flex justify-center">
          Please contact us at
          <a
            href="mailto:support@campuscribs.org"
            className="ml-1 text-blue-500 underline cursor-pointer"
          >
            support@campuscribs.org
          </a>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
