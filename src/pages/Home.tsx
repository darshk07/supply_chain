import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { contractConfig } from "../config/contractConfig";
import Loading from "../components/Loading";
import { useState } from "react";
import { watchContractEvent } from "@wagmi/core";
import { config } from "../wagmiConfig";
import Manufacturer from "../components/Manufacturer";
import Distributor from "../components/Distributor";
import Retailer from "../components/Retailer";
import NoRoleAssigned from "../components/NoRoleAssigned";

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
      <div className="flex flex-col flex-1 items-center justify-center gap-4 bg-secondary text-white">
        <h2 className="font-semibold text-5xl mb-4">Hello, {fetchedRole}!</h2>
        <div className="p-12 bg-[#575353] rounded-xl flex flex-col gap-8 w-2/5">
          <div className="flex items-start gap-4 flex-col">
            <h2 className="text-2xl w-full flex justify-center border-b border-white pb-2">
              Add role
            </h2>
            <div className="flex gap-4 w-full">
              <label htmlFor="address">
                <input
                  className="border-2 border-black text-black rounded-md p-1 focus:outline-none w-[350px]"
                  name="address"
                  type="text"
                  onChange={(e) => {
                    setAccountAddress(e.target.value);
                  }}
                />
              </label>
              <label htmlFor="role">
                <select
                  className="border-2 border-black rounded-md p-1 text-black focus:outline-none w-[150px]"
                  name="role"
                  id="role"
                  onChange={(e) => {
                    setRole(e.target.value);
                  }}
                >
                  <option value="Manufacturer" className="text-black">
                    Manufacturer
                  </option>
                  <option value="Distributor" className="text-black">
                    Distributor
                  </option>
                  <option value="Retailer" className="text-black">
                    Retailer
                  </option>
                </select>
              </label>
            </div>
            <button
              className="px-6 py-2 rounded-md bg-primary p-1 text-black"
              onClick={() => handleAddRole()}
            >
              Add Role
            </button>
          </div>
          <div className="flex items-start gap-4 flex-col">
            <h2 className="text-2xl w-full flex justify-center border-b border-white pb-2">
              Remove role
            </h2>
            <label htmlFor="address">
              <input
                className="border-2 border-black text-black rounded-md p-1 focus:outline-none w-[520px]"
                name="address"
                type="text"
                onChange={(e) => {
                  setAccountAddress(e.target.value);
                }}
              />
            </label>
            <button
              className="px-6 py-2 rounded-md bg-primary text-black"
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
    return <NoRoleAssigned />;
  }

  if (fetchedRole === "Manufacturer") {
    return <Manufacturer />;
  }

  if (fetchedRole === "Distributor") {
    return <Distributor />;
  }

  if (fetchedRole === "Retailer") {
    return <Retailer />;
  }

  return <div>Role assigned : {fetchedRole}</div>;
};

export default Home;
