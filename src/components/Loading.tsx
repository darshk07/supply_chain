import { AiOutlineLoading } from "react-icons/ai";
const Loading = () => {
  return (
    <div className="w-screen h-screen backdrop-blur-md flex items-center justify-center absolute top-0 left-0 z-10">
      <AiOutlineLoading size={42} className="text-5xltext-black animate-spin" />
    </div>
  );
};

export default Loading;
