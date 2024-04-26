import gola from "../photos/gola.png";

function PRELOGIN() {
  return (
    <div className=" bg-[#2F2F2F] flex-1 w-screen justify-center">
      <center className="mt-1 m-auto pt-1 ">
        <img src={gola} className="items-center h-[350px] bg-blend-multiply" />

        <div className=" tracking-widest mt-12">
          <span className="text-[#FFE900] text-2xl block mb-4 wrapper">
            <span className="typing-demo">Hello User!</span>
          </span>
        </div>
      </center>
      <center className="mt-9">
        <button className="relative -top-1 -left-1 bg-[#FCFCFC] py-2.5 px-5 font-medium uppercase text-[#2F2F2F] transition-all before:absolute before:top-1 before:left-1 before:-z-[1] before:h-full before:w-full before:border-2 before:border-gray-700 before:transition-all before:content-[''] hover:top-0 hover:left-0 before:hover:top-0 before:hover:left-0">
          Connect to Metamask
        </button>
      </center>
    </div>
  );
}

export default PRELOGIN;
