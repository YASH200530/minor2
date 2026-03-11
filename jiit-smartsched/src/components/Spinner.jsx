export default function Spinner({ size = 18 }) {
  return (
    <div
      style={{
        width: size, height: size,
        border: "2px solid rgba(255,255,255,.25)",
        borderTop: "2px solid #fff",
        borderRadius: "50%",
        animation: "spin .75s linear infinite",
        display: "inline-block",
      }}
    />
  );
}
