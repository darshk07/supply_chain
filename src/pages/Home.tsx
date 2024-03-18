import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { contractConfig } from "../config/contractConfig";
import Loading from "../components/Loading";
import { useState } from "react";
import { PiFolderNotchOpenFill } from "react-icons/pi";

const Home = () => {
  const { address } = useAccount();
  const {
    data: fetchedRole,
    error: roleError,
    isLoading: isFetching,
  }: any = useReadContract({
    ...contractConfig,
    functionName: "getRole",
    account: address,
  });

  const [accountAddress, setAccountAddress] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const { writeContract, error } = useWriteContract();
  // console.log(fetchedRole);
  // console.log(error);
  const handleRemoveRole = () => {
    writeContract({
      ...contractConfig,
      functionName: "removeRole",
      args: [accountAddress],
    });
    setAccountAddress("");
    setRole("");
  };

  const handleAddRole = () => {
    writeContract({
      ...contractConfig,
      functionName: "addRole",
      args: [role, accountAddress],
    });
    setAccountAddress("");
    setRole("");
  };

  if (isFetching) {
    return <Loading />;
  }

  if (fetchedRole === "Admin") {
    return (
      <div>
        <div className="">
          <h2>Add role</h2>
          <label htmlFor="address">
            <input
              name="address"
              type="text"
              onChange={(e) => {
                setAccountAddress(e.target.value);
              }}
            />
          </label>
          <label htmlFor="role">
            <input
              name="role"
              type="text"
              onChange={(e) => {
                setRole(e.target.value);
              }}
            />
          </label>
          <button onClick={() => handleAddRole()}>Add Role</button>
        </div>
        <div className="">
          <h2>Add role</h2>
          <label htmlFor="address">
            <input
              name="address"
              type="text"
              onChange={(e) => {
                setAccountAddress(e.target.value);
              }}
            />
          </label>
          <button onClick={handleRemoveRole}>Remove Role</button>
        </div>
      </div>
    );
  }

  if (fetchedRole === "None") {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex gap-2 flex-col">
          <div className="text-4xl">No Role Assigned</div>
          <div className="text-center">Contact Admin for the role.</div>
        </div>
      </div>
    );
  }
  return <div>Role assigned : {role}</div>;
};

export default Home;
