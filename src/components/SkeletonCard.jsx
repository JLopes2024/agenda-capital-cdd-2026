function SkeletonCard() {
  return (
    <div
      style={{
        backgroundColor: "#e0e0e0",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "12px",
        animation: "pulse 1.5s infinite"
      }}
    >
      <div style={{ width: "60%", height: "18px", backgroundColor: "#ccc", marginBottom: "10px" }} />
      <div style={{ width: "40%", height: "14px", backgroundColor: "#ccc", marginBottom: "6px" }} />
      <div style={{ width: "50%", height: "14px", backgroundColor: "#ccc" }} />
    </div>
  );
}

export default SkeletonCard;
