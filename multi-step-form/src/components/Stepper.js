import React, {useContext, useEffect} from "react";
export default function Stepper() {
  return(
    <div className="d-flex flex-row mb-3 align-items-center justify-content-center">
      <div className="stepper-item mx-auto text-center font-medium border rounded-5">
        1
      </div>
      <div className="stepper-item mx-auto text-center font-medium border rounded-5">
        2
      </div>
      <div className="stepper-item mx-auto text-center font-medium border rounded-5">
        3
      </div>
    </div>
  );
}
