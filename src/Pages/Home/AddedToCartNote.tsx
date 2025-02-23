import * as motion from "motion/react-client";

const variants = {
  initial: {
    display: "none",
    opacity: 1,
    y: -300,
  },
  animate: {
    display: "block",
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
    },
  },
  exit: {
    opacity: 0,
    y: -300,
    transition: {
      duration: 0.5,
    },
  },
};
type props = {
  show: boolean;
  notification: string | null;
};
const AddedToCartNote = ({ show, notification }: props) => {
  return (
    <motion.div
      initial={variants.initial}
      exit={variants.exit}
      animate={show ? variants.animate : variants.initial}
      className={`fixed top-5 border border-black rounded-2xl flex justify-center items-center h-14 w-[300px] bg-white shadow-2xl overflow-hidden z-50`}
    >
      <h1 className="flex items-center justify-center text-center h-full">
        {notification}
      </h1>
    </motion.div>
  );
};

export default AddedToCartNote;
