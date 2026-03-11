export default function Chip({ text, bg = "#7c3aed" }) {
  return (
    <span
      className="chip"
      style={{
        background: `${bg}22`,
        color: bg,
        border: `1px solid ${bg}44`,
      }}
    >
      {text}
    </span>
  );
}
