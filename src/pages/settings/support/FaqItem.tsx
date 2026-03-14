import { ChevronRight } from "lucide-react";
import * as motion from "motion/react-client";
import { useState } from "react";

const variants = {
  initial: {
    display: "none",
    opacity: 0,
    y: 100,
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
    y: 100,
    transition: {
      duration: 0.5,
    },
  },
};
const imgvariants = {
  initial: {
    opacity: 1,
    rotate: 0,
  },
  animate: {
    opacity: 1,
    rotate: 90,
    transition: {
      duration: 0.25,
    },
  },
  exit: {
    opacity: 0,
    rotate: 0,
    transition: {
      duration: 0.5,
    },
  },
};
type FaqItemProps = {
  question: string;
  answer: string;
};

const FaqItem = (props: FaqItemProps) => {
  const [open, setopen] = useState(false);

  return (
    <div className="flex flex-col">
      <div
        className="flex border rounded-xl p-4 justify-between items-center cursor-pointer"
        onClick={() => setopen(!open)}
      >
        <p>{props.question}</p>
        <motion.div animate={open ? imgvariants.animate : imgvariants.initial}>
          <ChevronRight />
        </motion.div>
      </div>
      <motion.div
        initial={variants.initial}
        exit={variants.exit}
        animate={open ? variants.animate : variants.initial}
        className={`  p-5`}
      >
        <p>{props.answer}</p>
      </motion.div>
    </div>
  );
};

export default FaqItem;
