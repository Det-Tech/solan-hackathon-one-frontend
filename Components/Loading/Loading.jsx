const loader = {
    position: "absolute",
    left: "50%",
    top: "50%",
    zIndex: 1,
    width: "120px",
    height: "120px",
    margin: "-76px 0 0 -76px",
    border: "16px solid #f3f3f3",
    borderRadius: "50%",
    borderTop: "16px solid #3498db",
    "-webkitAnimation": "spin 2s linear infinite",
    animation: "spin 2s linear infinite",
}
const Loading = () => {
  return (
    <div
      style={{
        // background: "linear-gradient(45deg, #2f1c74, #624fa7b3)",
        // width: "100vw",
        // height: "100vh",
      }}
    >
      <div style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        zIndex: 1,
        width: "120px",
        height: "120px",
        margin: "-76px 0 0 -76px",
        border: "16px solid #f3f3f3",
        borderRadius: "50%",
        borderTop: "16px solid #3498db",
        "-webkit-animation": "spin 2s linear infinite",
        animation: "spin 2s linear infinite",
        // -webkit-animation:"spin 2s linear infinite",
        "-moz-animation": "spin 2s linear infinite",
            "-ms-animation":"spin 2s linear infinite",
                "animation": "spin 2s linear infinite",
      }}></div>
    </div>
  );
};

export default Loading;
