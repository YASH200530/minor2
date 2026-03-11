export default function StatCard({ icon, label, value, sub, subColor = "#6b7280" }) {
  return (
    <div className="stat-card">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
        <span style={{ fontSize:11, color:"#6b7280" }}>{label}</span>
        <span style={{ fontSize:22 }}>{icon}</span>
      </div>
      <div style={{ fontSize:30, fontWeight:800, color:"#fff", marginBottom:4 }}>{value}</div>
      <div style={{ fontSize:11, color:subColor }}>{sub}</div>
    </div>
  );
}
