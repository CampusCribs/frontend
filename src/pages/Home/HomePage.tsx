import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Dot, MapPin } from "lucide-react";
import { useNavigate } from "react-router";

const HomePage = () => {
  return (
    <div className="flex flex-col gap-4">
      <div
        className="flex flex-row justify-start gap-2 w-full 
      py-2 px-4 h-12"
      >
        <Badge variant="outline">Sell</Badge>
        <Badge variant="default">For you</Badge>
        <Badge variant="outline">Local</Badge>
        <Badge variant="outline">More</Badge>
      </div>

      <div className="flex flex-col">
        <div className="flex flex-row justify-between gap-2 w-full p-2 h-12">
          <div className="text-xl font-black">Today's Picks</div>
          <div className="flex flex-row gap-2 items-center text-blue-400">
            <div>
              <MapPin width={16} height={16} />
            </div>
            <div className="text-lg font-bold">Cincinnati</div>
          </div>
        </div>
        <div className="grid grid-cols-2">
          <ResidenceCard />
          <ResidenceCard />

          <ResidenceCard />
          <ResidenceCard />

          <ResidenceCard />
          <ResidenceCard />

          <ResidenceCard />
          <ResidenceCard />
        </div>
      </div>
    </div>
  );
};

const ResidenceCard = () => {
  const navigate = useNavigate();
  return (
    <Card
      className="rounded-none shadow-none m-0 w-full border-none cursor-pointer p-1"
      onClick={() => navigate("/posts/1234")}
    >
      <CardContent className="p-0 m-0 w-full border-none ">
        <img
          src={`https://picsum.photos/id/${Math.floor(
            Math.random() * (200 - 1) + 1
          )}/600/600`}
          alt="Residence"
          className="object-cover"
        />
      </CardContent>
      <CardFooter className="p-0 m-0 w-full px-4 py-2">
        <div className="flex flex-row justify-between">
          <div className="flex gap-0">
            <div className="flex gap-1">
              <div className="text-md font-bold">$1,100</div>
              <div className="text-md font-bold text-gray-500 line-through">
                $1,400
              </div>
            </div>
            <div className="flex justify-center items-center">
              <Dot width={24} height={24} />
            </div>
            <div className="flex gap-2 w-full">
              <div className="text-md font-bold">CUF</div>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default HomePage;
