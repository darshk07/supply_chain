import gola from "../photos/gola.png";
import { useConnect } from "wagmi";

function PRELOGIN() {
  const { connectors, connect } = useConnect();
  const wallet = connectors[0];

  const handleLogin = async () => {
    await connect({ connector: wallet });
  };

  return (
    <div className=" bg-[#2F2F2F] flex-1 w-screen justify-center">
      <center className="mt-1 m-auto pt-1 ">
        <img src={gola} className="items-center h-[350px] bg-blend-multiply" />

        <div className=" tracking-widest mt-12">
          <span className="text-[#fff] text-2xl block mb-4 wrapper">
            <span className="typing-demo">Hello User!</span>
          </span>
        </div>
      </center>
      <center className="mt-9">
        <button
          onClick={handleLogin}
          className="bg-primary rounded-xl py-2.5 px-5 font-medium uppercase text-[#2F2F2F] hover:border-2 hover:border-primary hover:text-primary hover:bg-[#2F2F2F] transition duration-300 ease-in-out"
        >
          Connect to Metamask
        </button>
      </center>
    </div>
  );
}

export default PRELOGIN;
