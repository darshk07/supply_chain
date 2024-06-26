import Carousel from "./Carousel"; // Assuming Carousel is imported correctly

const NoRoleAssigned = () => {
  return (
    <div className="flex-1 flex items-start justify-center bg-cover bg-center bg-secondary">
      <div className="flex flex-col mt-12 max-w-[80%] text-center items-center">
        <div className="flex flex-col items-center gap-4">
          <h1 className="font-semibold text-white text-[50px]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-white">
              {" "}
              No role assigned yet{" "}
            </span>
          </h1>
          <p className="text-gray-400 text-[20px]">Contact Admin</p>
          <p className="text-gray-200 text-[20px] pt-5 font-bold">
            Our Services
          </p>
        </div>

        {/* Carousel container with margin for spacing */}
        <div>
          {" "}
          {/* Added margin-top for spacing */}
          <Carousel />
        </div>
      </div>
    </div>
  );
};

export default NoRoleAssigned;
