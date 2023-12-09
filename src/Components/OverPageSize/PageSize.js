import React, { useState, useLayoutEffect } from "react";

function useWindowSize() {
  const [size, setSize] = useState([0, 0]);

  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }

    window.addEventListener("resize", updateSize);
    updateSize();

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return size;
}

function PageSize() {
  const [width, height] = useWindowSize();
  const [show, setShow] = useState(false);

  return (
    <>
      <div className="sticky top-1 left-2 z-[180] ">
        <div className="flex items-start">
          <div className="card" style={{ display: show ? "block" : "none" }}>
            <span>
              Window size: {width} x {height}
            </span>
          </div>
          <button
            className="bg-[#6f2626] hover:bg-red-800 text-white font-bold py-1 px-2 rounded shadow-lg"
            onClick={() => setShow(!show)}
          >
            {show ? "hide" : "show"}
          </button>
        </div>
      </div>
    </>
  );
}

export default PageSize;
