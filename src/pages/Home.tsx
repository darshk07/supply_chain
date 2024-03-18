import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { contractConfig } from "../config/contractConfig";
import Loading from "../components/Loading";
import { useState } from "react";
import { watchContractEvent } from "@wagmi/core";
import { config } from "../wagmiConfig";
import Manufacturer from "../components/Manufacturer";
import Distributor from "../components/Distributor";

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

  watchContractEvent(config, {
    ...contractConfig,
    eventName: "RoleAssigned",
    onLogs(logs: any) {
      console.log("New logs!", logs);
      if (logs[0]?.args?.addr === address) {
        window.location.reload();
      }
    },
  });

  if (isFetching) {
    return <Loading />;
  }

  if (fetchedRole === "Admin") {
    return (
      <div className="flex flex-col flex-1 items-center justify-center gap-4">
        <h2 className="font-semibold text-2xl">Your Role: {fetchedRole}</h2>
        <div className="p-8 bg-[#f5f5f5] rounded-md flex flex-col gap-8">
          <div className="flex items-start gap-4 flex-col">
            <h2 className="text-2xl">Add role</h2>
            <div className="flex gap-4">
              <label htmlFor="address">
                <input
                  className="border-2 border-black rounded-md"
                  name="address"
                  type="text"
                  onChange={(e) => {
                    setAccountAddress(e.target.value);
                  }}
                />
              </label>
              <label htmlFor="role">
                <input
                  className="border-2 border-black rounded-md"
                  name="role"
                  type="text"
                  onChange={(e) => {
                    setRole(e.target.value);
                  }}
                />
              </label>
            </div>
            <button
              className="px-6 py-2 rounded-md bg-[#fff]"
              onClick={() => handleAddRole()}
            >
              Add Role
            </button>
          </div>
          <div className="flex items-start gap-4 flex-col">
            <h2 className="text-2xl">Remove role</h2>
            <label htmlFor="address">
              <input
                className="border-2 border-black rounded-md"
                name="address"
                type="text"
                onChange={(e) => {
                  setAccountAddress(e.target.value);
                }}
              />
            </label>
            <button
              className="px-6 py-2 rounded-md bg-[#fff]"
              onClick={handleRemoveRole}
            >
              Remove Role
            </button>
          </div>
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

  if (fetchedRole === "Manufacturer") {
    return <Manufacturer />;
  }

  if (fetchedRole === "Distributor") {
    return <Distributor />;
  }

  return <div>Role assigned : {fetchedRole}</div>;
};

export default Home;
