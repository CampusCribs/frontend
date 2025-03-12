import IndividualSlider from "./IndividualSlider";

const IndividualPage = () => {
  //fetch images from server and pass them to the slider prop
  const images = [
    "https://picsum.photos/id/100/600/600",
    "https://picsum.photos/id/101/600/600",
    "https://picsum.photos/id/102/600/600",
    "https://picsum.photos/id/103/600/600",
    "https://picsum.photos/id/104/600/600",
  ];
  return (
    <div>
      <div>
        <IndividualSlider images={images} />
      </div>
    </div>
  );
};

export default IndividualPage;
