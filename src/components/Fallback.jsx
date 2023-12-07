import { ArrowPathIcon } from "@heroicons/react/24/solid";

const Fallback = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center text-[#25d366] ">
      <ArrowPathIcon className="w-10 h-10 animate-spin" />
    </div>
  );
};

export default Fallback;
