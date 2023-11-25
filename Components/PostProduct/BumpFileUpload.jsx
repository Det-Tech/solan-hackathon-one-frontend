import React, { useEffect } from "react";
import Image from "next/image";

//INTERNAL IMPORT
import Style from "./PostProduct.module.css";
import images from "../../assets";

const BumpFileUpload = ({click, addFile, fileInputRef, title}) => {

  return (
    <>
      <div
        style={{
          background: "#1C2245",
          boxShadow:
            "0px 4px 50px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25) inset",
          borderRadius: "10px",
          position: "relative",
          padding: "10px",
          height: "80px",
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          padding: "30px",
        }}
        onClick={() => click()}
        onChange={addFile}
      >
        <input type="file" style={{ display: "none" }} ref={fileInputRef} />
        <div style={{position:"relative"}}>
          <Image className={Style.circle} src={images.circle} alt="image" />
          <span
            style={{
              position: "absolute",
              left:"8px",
              top: "-10px",
              color: "#FFF",
              textShadow: "0px 4px 20px rgba(255, 255, 255, 0.40)",
              fontFamily: "Montserrat",
              fontSize: "56px",
              fontStyle: "normal",
              fontWeight: "700",
              lineHeight: "normal",
            }}
          >
            +
          </span>
        </div>
        <p
          style={{
            fontSize: "20px",
          }}
        >
          {title}
        </p>
      </div>
    </>
  );
};

export default BumpFileUpload;
