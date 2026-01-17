import { useEffect, useState } from "react";
import { motion, Transition, useMotionValue } from "framer-motion";
import { buildImageURLs } from "@/lib/image-resolver";

const ONE_SECOND = 1000;
const AUTO_DELAY = ONE_SECOND * 10;
const DRAG_BUFFER = 10;

const SPRING_OPTIONS: Transition = {
  type: "spring",
  mass: 0.5,
  stiffness: 400,
  damping: 100,
};

const IndividualSlider = (props: {
  images: string[];
  userId?: string;
  postId: string;
}) => {
  const [imgIndex, setImgIndex] = useState(0);
  // const imgs = buildImageURLs(props.userId || "", props.postId, props.images);
  const imgs = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3krGAS5w7YyUrBn7Y55sqCFh13aR2La_dYQ&s",
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80",
  ];
  const dragX = useMotionValue(0);
  const imglength = props.images.length;

  useEffect(() => {
    const intervalRef = setInterval(() => {
      const x = dragX.get();

      if (x === 0) {
        setImgIndex((pv) => {
          if (pv === imglength - 1) {
            return 0;
          }
          return pv + 1;
        });
      }
    }, AUTO_DELAY);

    return () => clearInterval(intervalRef);
  }, [imglength]);

  const onDragEnd = () => {
    const x = dragX.get();

    if (x <= -DRAG_BUFFER && imgIndex < imgs.length - 1) {
      setImgIndex((pv) => pv + 1);
    } else if (x >= DRAG_BUFFER && imgIndex > 0) {
      setImgIndex((pv) => pv - 1);
    }
  };

  return (
    <div className="relative overflow-hidden ">
      <motion.div
        drag="x"
        dragConstraints={{
          left: 0,
          right: 0,
        }}
        style={{
          x: dragX,
        }}
        animate={{
          translateX: `-${imgIndex * 100}%`,
        }}
        transition={SPRING_OPTIONS}
        onDragEnd={onDragEnd}
        className="flex cursor-grab items-center active:cursor-grabbing"
      >
        <Images imgIndex={imgIndex} images={imgs} />
      </motion.div>

      <Dots imgIndex={imgIndex} setImgIndex={setImgIndex} images={imgs} />
    </div>
  );
};

const Images = (props: { imgIndex: number; images: string[] }) => {
  return (
    <>
      {props.images.map((imgSrc, idx) => {
        return (
          <motion.img
            draggable={false}
            key={idx}
            src={props.images[idx]}
            animate={{
              scale: props.imgIndex === idx ? 1 : 0.85,
            }}
            transition={SPRING_OPTIONS}
            className="aspect-square max-w-[600px] w-full shrink-0 rounded-xl bg-neutral-800 object-cover shadow-lg"
          />
        );
      })}
    </>
  );
};

const Dots = (props: {
  images: string[];
  imgIndex: number;
  setImgIndex: (idx: number) => void;
}) => {
  return (
    <div className="mt-4 flex w-full justify-center gap-2">
      {props.images.map((_, idx) => {
        return (
          <button
            key={idx}
            title="itterate"
            onClick={() => props.setImgIndex(idx)}
            className={`h-3 w-3 rounded-full transition-colors shadow-xl ${
              idx === props.imgIndex ? "bg-neutral-300" : "bg-neutral-500"
            }`}
          />
        );
      })}
    </div>
  );
};

export default IndividualSlider;
