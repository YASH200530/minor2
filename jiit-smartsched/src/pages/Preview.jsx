import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

// ── Global Styles ──────────────────────────────────────────────────────────────
const G = () => (
  <style>{`
    * { box-sizing: border-box; margin: 0; padding: 0; }
    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: #0d0d0d; }
    ::-webkit-scrollbar-thumb { background: #7c3aed; border-radius: 4px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
    @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
    @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
    @keyframes glow { 0%,100%{box-shadow:0 0 10px rgba(124,58,237,0.2)} 50%{box-shadow:0 0 25px rgba(124,58,237,0.5)} }
    .page-enter { animation: fadeIn 0.25s ease forwards; }
    .nav-btn { transition: all 0.18s cubic-bezier(.4,0,.2,1); }
    .nav-btn:hover { background: rgba(124,58,237,0.12) !important; color: #c4b5fd !important; transform: translateX(3px); }
    .nav-btn.active { background: #7c3aed !important; color: #fff !important; box-shadow: 0 4px 15px rgba(124,58,237,0.35); }
    .stat-card { transition: all 0.22s cubic-bezier(.4,0,.2,1); }
    .stat-card:hover { transform: translateY(-4px) scale(1.02); box-shadow: 0 12px 35px rgba(124,58,237,0.18); border-color: rgba(124,58,237,0.3) !important; }
    .feature-card { transition: all 0.22s cubic-bezier(.4,0,.2,1); }
    .feature-card:hover { transform: translateY(-5px); box-shadow: 0 16px 40px rgba(124,58,237,0.15); border-color: rgba(124,58,237,0.4) !important; }
    .feature-card:hover .feat-icon { background: #7c3aed !important; transform: scale(1.1); }
    .feat-icon { transition: all 0.2s ease; }
    .teacher-card { transition: all 0.22s cubic-bezier(.4,0,.2,1); }
    .teacher-card:hover { transform: translateY(-4px); box-shadow: 0 12px 35px rgba(124,58,237,0.15); border-color: rgba(124,58,237,0.25) !important; }
    .teacher-card:hover .avatar { transform: scale(1.08); box-shadow: 0 0 0 3px rgba(124,58,237,0.4); }
    .avatar { transition: all 0.2s ease; }
    .room-card { transition: all 0.22s cubic-bezier(.4,0,.2,1); }
    .room-card:hover { transform: translateY(-4px); box-shadow: 0 12px 35px rgba(124,58,237,0.15); border-color: rgba(124,58,237,0.25) !important; }
    .subject-card { transition: all 0.22s cubic-bezier(.4,0,.2,1); }
    .subject-card:hover { transform: translateY(-4px); box-shadow: 0 12px 35px rgba(124,58,237,0.15); border-color: rgba(124,58,237,0.3) !important; }
    .subject-card:hover .sub-icon { background: #7c3aed !important; }
    .sub-icon { transition: background 0.2s; }
    .quick-action { transition: all 0.18s ease; }
    .quick-action:hover { background: rgba(124,58,237,0.1) !important; border-color: rgba(124,58,237,0.3) !important; color: #e9d5ff !important; transform: translateX(4px); }
    .activity-row { transition: all 0.15s ease; }
    .activity-row:hover { background: rgba(124,58,237,0.06); border-radius: 10px; padding-left: 8px; }
    .btn-primary { transition: all 0.18s ease; }
    .btn-primary:hover { background: #6d28d9 !important; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(124,58,237,0.4); }
    .btn-primary:active { transform: translateY(0); }
    .btn-secondary { transition: all 0.18s ease; }
    .btn-secondary:hover { background: rgba(255,255,255,0.07) !important; border-color: rgba(255,255,255,0.15) !important; color: #fff !important; }
    .icon-btn { transition: all 0.15s ease; }
    .icon-btn:hover { color: #a78bfa !important; transform: scale(1.2); }
    .delete-btn { transition: all 0.15s ease; }
    .delete-btn:hover { color: #f87171 !important; transform: scale(1.2); }
    .clash-row { transition: all 0.18s ease; }
    .clash-row:hover { background: rgba(255,255,255,0.03); border-radius: 12px; }
    .timetable-cell { transition: all 0.18s cubic-bezier(.4,0,.2,1); }
    .timetable-cell:hover { transform: scale(1.04) translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,0.4); z-index: 10; }
    .drop-zone { transition: background 0.15s; }
    .drop-zone:hover { background: rgba(124,58,237,0.06) !important; }
    .header-icon { transition: all 0.18s ease; }
    .header-icon:hover { color: #a78bfa !important; transform: scale(1.15); }
    .campus-btn { transition: all 0.2s ease; }
    .resolve-btn { transition: all 0.18s ease; }
    .resolve-btn:hover { background: #6d28d9 !important; transform: translateY(-1px); box-shadow: 0 4px 15px rgba(124,58,237,0.35); }
    .nav-link { transition: color 0.15s; }
    .nav-link:hover { color: #e9d5ff !important; }
    .hero-btn { transition: all 0.2s cubic-bezier(.4,0,.2,1); }
    .hero-btn:hover { background: #6d28d9 !important; transform: translateY(-2px); box-shadow: 0 10px 30px rgba(124,58,237,0.5); }
    .footer-link { transition: color 0.15s; }
    .footer-link:hover { color: #a78bfa !important; cursor: pointer; }
    .campus-card { transition: all 0.22s ease; }
    .campus-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(124,58,237,0.12); }
    .upload-box { transition: all 0.2s ease; }
    .upload-box:hover { border-color: rgba(124,58,237,0.4) !important; background: rgba(124,58,237,0.04) !important; }
    .modal-overlay { animation: fadeIn 0.15s ease; }
    input:focus { border-color: rgba(124,58,237,0.5) !important; outline: none; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); }
    .time-row:hover td { background: rgba(124,58,237,0.03); }
  `}</style>
);

// ── Data ───────────────────────────────────────────────────────────────────────
const campusData = {
  "128": {
    classes:312, teachers:58, rooms:45, clashes:3,
    activity:[
      {text:"New timetable generated for B.Tech Sem 4",time:"2 hours ago",dot:"#22c55e"},
      {text:"Clash resolved in Room 301 - A Block",time:"4 hours ago",dot:"#7c3aed"},
      {text:"Prof. Rajesh Kumar added to CS Dept",time:"1 day ago",dot:"#22c55e"},
      {text:"Lab A-Block schedule updated",time:"2 days ago",dot:"#3b82f6"},
    ],
    teachers:[
      {id:1,name:"Dr. Rajesh Kumar",dept:"Computer Science",email:"rajesh.k@jiit.ac.in",phone:"+91 98765-43201",classes:14,initials:"RK"},
      {id:2,name:"Prof. Sunita Sharma",dept:"Mathematics",email:"sunita.s@jiit.ac.in",phone:"+91 98765-43202",classes:12,initials:"SS"},
      {id:3,name:"Dr. Anil Verma",dept:"Electronics",email:"anil.v@jiit.ac.in",phone:"+91 98765-43203",classes:10,initials:"AV"},
      {id:4,name:"Prof. Meena Gupta",dept:"Physics",email:"meena.g@jiit.ac.in",phone:"+91 98765-43204",classes:8,initials:"MG"},
      {id:5,name:"Dr. Vikas Singh",dept:"Chemistry",email:"vikas.s@jiit.ac.in",phone:"+91 98765-43205",classes:11,initials:"VS"},
      {id:6,name:"Prof. Kavita Joshi",dept:"Biotechnology",email:"kavita.j@jiit.ac.in",phone:"+91 98765-43206",classes:9,initials:"KJ"},
    ],
    rooms:[
      {id:1,name:"Room 301",type:"Lecture Hall",block:"A-Block",capacity:60,utilization:85},
      {id:2,name:"Lab CS-01",type:"Computer Lab",block:"B-Block",capacity:40,utilization:70},
      {id:3,name:"Room 405",type:"Classroom",block:"A-Block",capacity:50,utilization:90},
      {id:4,name:"Auditorium",type:"Auditorium",block:"Main Block",capacity:500,utilization:45},
      {id:5,name:"Lab EC-01",type:"Electronics Lab",block:"C-Block",capacity:35,utilization:65},
      {id:6,name:"Room 502",type:"Classroom",block:"B-Block",capacity:55,utilization:80},
    ],
    subjects:[
      {id:1,code:"CS101",name:"Data Structures",dept:"Computer Science",credits:4,hours:6},
      {id:2,code:"MA201",name:"Calculus II",dept:"Mathematics",credits:3,hours:4},
      {id:3,code:"PH101",name:"Engineering Physics",dept:"Physics",credits:4,hours:5},
      {id:4,code:"CH301",name:"Organic Chemistry",dept:"Chemistry",credits:4,hours:6},
      {id:5,code:"CS202",name:"Operating Systems",dept:"Computer Science",credits:3,hours:4},
      {id:6,code:"EE101",name:"Circuit Theory",dept:"Electrical Eng.",credits:4,hours:5},
    ],
    analytics:{
      avgUtil:"74.2%",avgWork:"13.8 hrs",clashRes:"91.2%",eff:"8.9/10",
      roomUtil:[{n:"Rm 301",v:85},{n:"Lab CS",v:70},{n:"Rm 405",v:90},{n:"Auditor",v:45},{n:"Lab EC",v:65},{n:"Rm 502",v:80}],
      workload:[{n:"Rajesh",h:18},{n:"Sunita",h:15},{n:"Anil",h:12},{n:"Meena",h:10},{n:"Vikas",h:14}],
      trends:[{w:"Wk 1",c:28,r:20},{w:"Wk 2",c:35,r:28},{w:"Wk 3",c:22,r:18},{w:"Wk 4",c:18,r:14}],
      pie:[{name:"Resolved",value:89},{name:"Pending",value:11}],
    },
    schedule:{
      "Monday-9:00 AM":{code:"CS101",teacher:"Prof. Rajesh",room:"301",col:"#3b0764",border:"#7c3aed"},
      "Monday-11:00 AM":{code:"MA201",teacher:"Prof. Sunita",room:"405",col:"#172554",border:"#3b82f6"},
      "Tuesday-10:00 AM":{code:"CH301",teacher:"Dr. Vikas",room:"502",col:"#451a03",border:"#f59e0b"},
      "Wednesday-9:00 AM":{code:"MA201",teacher:"Prof. Sunita",room:"405",col:"#172554",border:"#3b82f6"},
      "Thursday-10:00 AM":{code:"CS202",teacher:"Prof. Rajesh",room:"301",col:"#3b0764",border:"#7c3aed"},
      "Friday-9:00 AM":{code:"EE101",teacher:"Dr. Anil",room:"Lab 103",col:"#450a0a",border:"#ef4444"},
      "Friday-11:00 AM":{code:"MA201",teacher:"Prof. Sunita",room:"405",col:"#172554",border:"#3b82f6"},
      "Saturday-10:00 AM":{code:"PH101",teacher:"Prof. Meena",room:"Lab 202",col:"#052e16",border:"#22c55e"},
      "Wednesday-12:00 PM":{code:"PH101",teacher:"Prof. Meena",room:"Lab 202",col:"#052e16",border:"#22c55e"},
    },
  },
  "62": {
    classes:248, teachers:42, rooms:28, clashes:5,
    activity:[
      {text:"New timetable generated for MCA Sem 2",time:"1 hour ago",dot:"#22c55e"},
      {text:"Clash resolved in Room C-201",time:"3 hours ago",dot:"#7c3aed"},
      {text:"Dr. Priya Singh added to IT Dept",time:"1 day ago",dot:"#22c55e"},
      {text:"Seminar Hall schedule updated",time:"2 days ago",dot:"#3b82f6"},
    ],
    teachers:[
      {id:1,name:"Dr. Sarah Johnson",dept:"Computer Science",email:"sarah.j@jiit.ac.in",phone:"+91 234-567-8901",classes:12,initials:"SJ"},
      {id:2,name:"Prof. Michael Chen",dept:"Mathematics",email:"michael.c@jiit.ac.in",phone:"+91 234-567-8902",classes:10,initials:"MC"},
      {id:3,name:"Dr. Emily Rodriguez",dept:"Physics",email:"emily.r@jiit.ac.in",phone:"+91 234-567-8903",classes:8,initials:"ER"},
      {id:4,name:"Prof. James Wilson",dept:"Chemistry",email:"james.w@jiit.ac.in",phone:"+91 234-567-8904",classes:9,initials:"JW"},
      {id:5,name:"Dr. Priya Singh",dept:"Information Technology",email:"priya.s@jiit.ac.in",phone:"+91 234-567-8905",classes:11,initials:"PS"},
      {id:6,name:"Prof. Amit Sharma",dept:"Electrical Eng.",email:"amit.s@jiit.ac.in",phone:"+91 234-567-8906",classes:7,initials:"AS"},
    ],
    rooms:[
      {id:1,name:"Room 301",type:"Lecture Hall",block:"A-Block",capacity:60,utilization:85},
      {id:2,name:"Lab 202",type:"Computer Lab",block:"B-Block",capacity:40,utilization:70},
      {id:3,name:"Room 405",type:"Classroom",block:"A-Block",capacity:50,utilization:90},
      {id:4,name:"Auditorium",type:"Auditorium",block:"Main Block",capacity:200,utilization:45},
      {id:5,name:"Lab 103",type:"Physics Lab",block:"C-Block",capacity:35,utilization:65},
      {id:6,name:"Room 502",type:"Classroom",block:"B-Block",capacity:55,utilization:80},
    ],
    subjects:[
      {id:1,code:"CS101",name:"Data Structures",dept:"Computer Science",credits:4,hours:6},
      {id:2,code:"MA201",name:"Calculus II",dept:"Mathematics",credits:3,hours:4},
      {id:3,code:"PH101",name:"Quantum Physics",dept:"Physics",credits:4,hours:5},
      {id:4,code:"CH301",name:"Organic Chemistry",dept:"Chemistry",credits:4,hours:6},
      {id:5,code:"CS202",name:"Operating Systems",dept:"Computer Science",credits:3,hours:4},
      {id:6,code:"EE101",name:"Circuit Theory",dept:"Electrical Eng.",credits:4,hours:5},
    ],
    analytics:{
      avgUtil:"72.5%",avgWork:"15 hrs",clashRes:"89.4%",eff:"8.7/10",
      roomUtil:[{n:"Rm 301",v:85},{n:"Lab 202",v:70},{n:"Rm 405",v:90},{n:"Auditor",v:45},{n:"Lab 103",v:65},{n:"Rm 502",v:80}],
      workload:[{n:"Sarah",h:19},{n:"Chen",h:15},{n:"Emily",h:11},{n:"Wilson",h:13},{n:"Priya",h:15}],
      trends:[{w:"Wk 1",c:27,r:19},{w:"Wk 2",c:36,r:28},{w:"Wk 3",c:21,r:19},{w:"Wk 4",c:18,r:14}],
      pie:[{name:"Resolved",value:89},{name:"Pending",value:11}],
    },
    schedule:{
      "Monday-9:00 AM":{code:"CS101",teacher:"Dr. Sarah",room:"301",col:"#3b0764",border:"#7c3aed"},
      "Monday-11:00 AM":{code:"MA201",teacher:"Prof. Chen",room:"405",col:"#172554",border:"#3b82f6"},
      "Tuesday-10:00 AM":{code:"CH301",teacher:"Prof. Wilson",room:"502",col:"#451a03",border:"#f59e0b"},
      "Wednesday-9:00 AM":{code:"MA201",teacher:"Prof. Chen",room:"405",col:"#172554",border:"#3b82f6"},
      "Thursday-10:00 AM":{code:"CS202",teacher:"Dr. Sarah",room:"301",col:"#3b0764",border:"#7c3aed"},
      "Friday-9:00 AM":{code:"EE101",teacher:"Dr. Kumar",room:"Lab 103",col:"#450a0a",border:"#ef4444"},
      "Friday-11:00 AM":{code:"MA201",teacher:"Prof. Chen",room:"405",col:"#172554",border:"#3b82f6"},
      "Saturday-10:00 AM":{code:"PH101",teacher:"Dr. Emily",room:"Lab 202",col:"#052e16",border:"#22c55e"},
      "Wednesday-12:00 PM":{code:"PH101",teacher:"Dr. Emily",room:"Lab 202",col:"#052e16",border:"#22c55e"},
    },
  },
};

const deptTag={
  "Computer Science":["#3b0764","#c4b5fd"],
  "Mathematics":["#172554","#93c5fd"],
  "Physics":["#052e16","#86efac"],
  "Chemistry":["#451a03","#fcd34d"],
  "Electronics":["#431407","#fdba74"],
  "Biotechnology":["#500724","#f9a8d4"],
  "Information Technology":["#172554","#93c5fd"],
  "Electrical Eng.":["#450a0a","#fca5a5"],
};
const deptCode={
  "Computer Science":"#a78bfa","Mathematics":"#60a5fa","Physics":"#34d399",
  "Chemistry":"#fbbf24","Electrical Eng.":"#f87171","Electronics":"#fb923c","Biotechnology":"#f472b6",
};
const DAYS=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const TIMES=["9:00 AM","10:00 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM"];
const PIE_COLORS=["#22c55e","#7c3aed"];
const sampleClashes={
  "128":[
    {id:1,type:"Room Conflict",desc:"Room 301 double-booked",subjects:"CS101 & EC201",time:"Mon 9:00 AM",status:"pending"},
    {id:2,type:"Teacher Conflict",desc:"Prof. Rajesh Kumar in two classes",subjects:"CS202 & CS301",time:"Tue 10:00 AM",status:"pending"},
    {id:3,type:"Room Conflict",desc:"Lab CS-01 scheduling overlap",subjects:"CS101 Lab & CS202 Lab",time:"Wed 2:00 PM",status:"resolved"},
  ],
  "62":[
    {id:1,type:"Room Conflict",desc:"Room 301 double-booked",subjects:"CS101 & PH101",time:"Mon 9:00 AM",status:"pending"},
    {id:2,type:"Teacher Conflict",desc:"Dr. Sarah Johnson in two classes",subjects:"CS202 & CS101",time:"Thu 10:00 AM",status:"pending"},
    {id:3,type:"Room Conflict",desc:"Lab 202 scheduling overlap",subjects:"CS Lab & IT Lab",time:"Fri 2:00 PM",status:"pending"},
    {id:4,type:"Teacher Conflict",desc:"Prof. Michael Chen overloaded",subjects:"MA201 & MA301",time:"Wed 11:00 AM",status:"resolved"},
    {id:5,type:"Room Conflict",desc:"Auditorium overlap detected",subjects:"Seminar & Event",time:"Sat 9:00 AM",status:"resolved"},
  ],
};

// ── Reusable components ────────────────────────────────────────────────────────
function HoverCard({children,className="",style={}}) {
  return (
    <div className={className} style={{background:"#111",border:"1px solid rgba(255,255,255,0.06)",borderRadius:16,padding:20,...style}}>
      {children}
    </div>
  );
}

function UtilBar({val}) {
  const c = val>=85?"#ef4444":val>=70?"#f59e0b":"#7c3aed";
  return (
    <div style={{marginTop:12}}>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#6b7280",marginBottom:4}}>
        <span>Utilization</span>
        <span style={{color:val>=85?"#f87171":val>=70?"#fbbf24":"#a78bfa",fontWeight:600}}>{val}%</span>
      </div>
      <div style={{height:5,background:"rgba(255,255,255,0.05)",borderRadius:99,overflow:"hidden"}}>
        <div style={{width:`${val}%`,height:"100%",background:c,borderRadius:99,transition:"width 0.6s ease"}}/>
      </div>
    </div>
  );
}

function Modal({title,onClose,children}) {
  return (
    <div className="modal-overlay" style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:16}}>
      <div style={{background:"#131313",border:"1px solid rgba(124,58,237,0.25)",borderRadius:20,padding:24,width:"100%",maxWidth:420,boxShadow:"0 25px 60px rgba(0,0,0,0.6)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
          <span style={{color:"#fff",fontWeight:700,fontSize:16}}>{title}</span>
          <button onClick={onClose} className="icon-btn" style={{background:"none",border:"none",color:"#6b7280",cursor:"pointer",fontSize:20,lineHeight:1}}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Input({label,placeholder,value,onChange}) {
  return (
    <div style={{marginBottom:12}}>
      <div style={{fontSize:11,color:"#6b7280",marginBottom:5,fontWeight:500}}>{label}</div>
      <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        style={{width:"100%",background:"#0d0d0d",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10,padding:"10px 14px",fontSize:13,color:"#fff",outline:"none",transition:"all 0.2s",boxSizing:"border-box"}}
        onFocus={e=>{e.target.style.borderColor="rgba(124,58,237,0.5)";e.target.style.boxShadow="0 0 0 3px rgba(124,58,237,0.1)"}}
        onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.07)";e.target.style.boxShadow="none"}}
      />
    </div>
  );
}

// ── LANDING PAGE ───────────────────────────────────────────────────────────────
function Landing({onEnter}) {
  const features=[
    {icon:"⚠️",title:"Clash Detection",desc:"Automatically detect scheduling conflicts and overlapping classes in real-time",hi:false},
    {icon:"✨",title:"Auto Rescheduling",desc:"AI-powered smart suggestions to resolve clashes instantly with optimal solutions",hi:true},
    {icon:"👥",title:"Teacher Preferences",desc:"Respect faculty availability and preferred time slots for better work-life balance",hi:false},
    {icon:"🏢",title:"Room Optimization",desc:"Maximize space utilization with intelligent room allocation algorithms",hi:false},
    {icon:"📊",title:"Analytics Dashboard",desc:"Visual insights into resource utilization, workload distribution, and efficiency",hi:false},
    {icon:"🖱️",title:"Drag & Drop Editor",desc:"Intuitive interface to manually adjust schedules with real-time conflict warnings",hi:false},
  ];
  return (
    <div style={{background:"#0a0a0a",color:"#fff",fontFamily:"system-ui,sans-serif",minHeight:"100%",overflowY:"auto"}}>
      {/* Nav */}
      <nav style={{position:"sticky",top:0,zIndex:50,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 40px",borderBottom:"1px solid rgba(255,255,255,0.05)",background:"rgba(10,10,10,0.9)",backdropFilter:"blur(12px)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:36,height:36,background:"#1e1a3a",border:"1px solid rgba(124,58,237,0.4)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>📅</div>
          <div>
            <div style={{fontWeight:700,fontSize:14,color:"#fff"}}>JIIT SmartSched AI</div>
            <div style={{fontSize:10,color:"#6b7280"}}>Sector 128 & 62</div>
          </div>
        </div>
        <div style={{display:"flex",gap:28,fontSize:13,color:"#9ca3af"}}>
          {["Features","About","Contact"].map(l=>(
            <span key={l} className="nav-link" style={{cursor:"pointer",color:"#9ca3af"}}>{l}</span>
          ))}
        </div>
        <button onClick={onEnter} className="btn-primary" style={{background:"#7c3aed",color:"#fff",border:"none",borderRadius:10,padding:"9px 20px",fontSize:13,fontWeight:600,cursor:"pointer"}}>Sign In →</button>
      </nav>

      {/* Hero */}
      <div style={{position:"relative",minHeight:520,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"80px 16px 60px",background:"radial-gradient(ellipse at 65% 45%, rgba(109,40,217,0.3) 0%, rgba(15,10,30,0.6) 55%, #0a0a0a 100%)",overflow:"hidden"}}>
        <div style={{position:"absolute",top:60,right:80,width:300,height:300,background:"radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)",pointerEvents:"none"}}/>
        <div style={{display:"inline-flex",alignItems:"center",gap:7,background:"rgba(30,26,58,0.85)",border:"1px solid rgba(124,58,237,0.35)",color:"#c4b5fd",fontSize:13,padding:"7px 18px",borderRadius:99,marginBottom:28}}>
          ✨ AI-Powered Scheduling
        </div>
        <h1 style={{fontSize:58,fontWeight:800,color:"#fff",marginBottom:16,lineHeight:1.1,letterSpacing:"-0.02em"}}>JIIT SmartSched AI</h1>
        <p style={{fontSize:17,color:"#9ca3af",marginBottom:6,maxWidth:520}}>AI-powered timetable clash detection and optimization for</p>
        <p style={{fontSize:17,color:"#a78bfa",fontWeight:600,marginBottom:8}}>Jaypee Institute of Information Technology</p>
        <p style={{fontSize:13,color:"#4b5563",marginBottom:44}}>Sector 128, Noida &nbsp;•&nbsp; Sector 62, Noida</p>
        <button onClick={onEnter} className="hero-btn" style={{display:"inline-flex",alignItems:"center",gap:9,background:"#7c3aed",color:"#fff",border:"none",borderRadius:14,padding:"15px 36px",fontSize:15,fontWeight:700,cursor:"pointer",boxShadow:"0 8px 30px rgba(124,58,237,0.4)"}}>
          Get Started <span style={{fontSize:18}}>→</span>
        </button>
      </div>

      {/* Stats */}
      <div style={{borderTop:"1px solid rgba(255,255,255,0.05)",borderBottom:"1px solid rgba(255,255,255,0.05)",padding:"30px 40px",display:"flex",justifyContent:"center",gap:72,background:"#0d0d0d",flexWrap:"wrap"}}>
        {[["450+","Faculty Members"],["120+","Classrooms"],["800+","Subjects Managed"],["99%","Clashes Resolved"]].map(([v,l])=>(
          <div key={l} style={{textAlign:"center"}}>
            <div style={{fontSize:30,fontWeight:700,color:"#a78bfa"}}>{v}</div>
            <div style={{fontSize:12,color:"#6b7280",marginTop:3}}>{l}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div style={{padding:"70px 40px",maxWidth:1100,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:52}}>
          <h2 style={{fontSize:38,fontWeight:700,color:"#fff",marginBottom:10}}>Powerful Features</h2>
          <p style={{color:"#6b7280",fontSize:15}}>Everything you need to manage JIIT timetables efficiently</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}}>
          {features.map(f=>(
            <div key={f.title} className="feature-card" style={{background:"#111111",border:"1px solid rgba(255,255,255,0.05)",borderRadius:18,padding:24,cursor:"default"}}>
              <div className="feat-icon" style={{width:48,height:48,background:"#1e1a3a",borderRadius:13,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,marginBottom:16}}>{f.icon}</div>
              <div style={{fontSize:15,fontWeight:600,color:"#fff",marginBottom:8}}>{f.title}</div>
              <div style={{fontSize:13,color:"#6b7280",lineHeight:1.65}}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Campuses */}
      <div style={{padding:"0 40px 70px",maxWidth:1100,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:44}}>
          <h2 style={{fontSize:34,fontWeight:700,color:"#fff",marginBottom:8}}>Our Campuses</h2>
          <p style={{color:"#6b7280",fontSize:14}}>Serving both JIIT campuses with unified scheduling</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:22}}>
          {[
            {sec:"Sector 128",addr:"A-10, Sector 128, Noida, UP 201304",depts:["Computer Science & Engineering","Electronics & Communication","Biotechnology","Humanities & Social Sciences"],bc:"rgba(124,58,237,0.3)",tagBg:"rgba(88,28,135,0.5)",tagC:"#c4b5fd"},
            {sec:"Sector 62",addr:"H-165, Sector 63, Noida, UP 201307",depts:["Information Technology","Computer Science","Electronics","Mathematics & Computing"],bc:"rgba(59,130,246,0.2)",tagBg:"rgba(30,58,138,0.5)",tagC:"#93c5fd"},
          ].map(c=>(
            <div key={c.sec} className="campus-card" style={{background:"#111",border:`1px solid ${c.bc}`,borderRadius:18,padding:28,cursor:"default"}}>
              <div style={{display:"inline-block",background:c.tagBg,color:c.tagC,fontSize:11,fontWeight:600,padding:"3px 14px",borderRadius:99,marginBottom:12}}>{c.sec}</div>
              <div style={{fontSize:18,fontWeight:700,color:"#fff",marginBottom:6}}>JIIT {c.sec}</div>
              <div style={{display:"flex",alignItems:"center",gap:6,color:"#6b7280",fontSize:12,marginBottom:16}}>📍 {c.addr}</div>
              {c.depts.map(d=>(
                <div key={d} style={{display:"flex",alignItems:"center",gap:8,fontSize:13,color:"#9ca3af",marginBottom:7}}>
                  <div style={{width:5,height:5,background:"#7c3aed",borderRadius:"50%"}}/>
                  {d}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer style={{borderTop:"1px solid rgba(255,255,255,0.05)",padding:"48px 40px 28px",background:"#0a0a0a"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:44,marginBottom:44}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
              <div style={{width:34,height:34,background:"#1e1a3a",border:"1px solid rgba(124,58,237,0.4)",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>📅</div>
              <span style={{fontWeight:700,fontSize:14,color:"#fff"}}>JIIT SmartSched AI</span>
            </div>
            <p style={{fontSize:12,color:"#4b5563",lineHeight:1.75}}>Intelligent timetable management for JIIT — Sector 128 & Sector 62, Noida.</p>
          </div>
          <div>
            <div style={{fontSize:13,fontWeight:600,color:"#fff",marginBottom:16}}>Contact Us</div>
            {[["✉️","support@jiit.ac.in"],["📞","+91 120 234-3000"],["📍","Sector 128 & 62, Noida, UP"]].map(([ic,t])=>(
              <div key={t} style={{display:"flex",gap:10,fontSize:12,color:"#6b7280",marginBottom:10}}><span>{ic}</span><span>{t}</span></div>
            ))}
          </div>
          <div>
            <div style={{fontSize:13,fontWeight:600,color:"#fff",marginBottom:16}}>Quick Links</div>
            {["Documentation","API Reference","Privacy Policy","Terms of Service"].map(l=>(
              <div key={l} className="footer-link" style={{fontSize:12,color:"#6b7280",marginBottom:9}}>{l}</div>
            ))}
          </div>
        </div>
        <div style={{borderTop:"1px solid rgba(255,255,255,0.05)",paddingTop:20,textAlign:"center",fontSize:12,color:"#374151"}}>
          © 2024 JIIT SmartSched AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

// ── DASHBOARD HOME ─────────────────────────────────────────────────────────────
function DashPage({campus,setPage}) {
  const d=campusData[campus];
  const stats=[
    {l:"Total Classes",v:d.classes,change:"+12%",up:true,icon:"📚"},
    {l:"Total Teachers",v:d.teachers,change:"+3",up:true,icon:"👥"},
    {l:"Total Rooms",v:d.rooms,change:"",up:null,icon:"🏢"},
    {l:"Clashes Detected",v:d.clashes,change:"-8",up:false,icon:"⚠️"},
  ];
  return (
    <div className="page-enter">
      <div style={{marginBottom:24}}>
        <h2 style={{fontSize:22,fontWeight:700,color:"#fff"}}>Dashboard</h2>
        <p style={{fontSize:12,color:"#6b7280",marginTop:3}}>JIIT Sector {campus} — Welcome back, Admin</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:22}}>
        {stats.map(s=>(
          <div key={s.l} className="stat-card" style={{background:"#111",border:"1px solid rgba(255,255,255,0.06)",borderRadius:16,padding:18,cursor:"default"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
              <span style={{fontSize:12,color:"#6b7280"}}>{s.l}</span>
              <div style={{width:36,height:36,background:"#1e1a3a",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{s.icon}</div>
            </div>
            <div style={{display:"flex",alignItems:"flex-end",gap:10}}>
              <span style={{fontSize:34,fontWeight:700,color:"#fff"}}>{s.v}</span>
              {s.change&&<span style={{fontSize:12,marginBottom:5,display:"flex",alignItems:"center",gap:2,color:s.up?"#22c55e":"#ef4444"}}>
                {s.up?"↗":"↘"} {s.change}
              </span>}
            </div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <HoverCard>
          <div style={{fontSize:14,fontWeight:600,color:"#fff",marginBottom:16}}>Recent Activity</div>
          {d.activity.map((a,i)=>(
            <div key={i} className="activity-row" style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:i<d.activity.length-1?14:0,paddingBottom:i<d.activity.length-1?14:0,borderBottom:i<d.activity.length-1?"1px solid rgba(255,255,255,0.04)":"none",padding:"6px 6px",cursor:"default",borderRadius:8,transition:"all 0.15s"}}>
              <div>
                <div style={{fontSize:13,color:"#e5e7eb"}}>{a.text}</div>
                <div style={{fontSize:11,color:"#4b5563",marginTop:2}}>{a.time}</div>
              </div>
              <div style={{width:8,height:8,borderRadius:"50%",background:a.dot,flexShrink:0,marginLeft:12,boxShadow:`0 0 6px ${a.dot}`}}/>
            </div>
          ))}
        </HoverCard>
        <HoverCard>
          <div style={{fontSize:14,fontWeight:600,color:"#fff",marginBottom:14}}>Quick Actions</div>
          {[["📅 Generate New Timetable","timetable"],["⚠️ Detect Clashes","clashdetection"],["👤 Add Teacher","teachers"],["🏢 Add Room","rooms"]].map(([l,p])=>(
            <button key={l} onClick={()=>setPage(p)} className="quick-action" style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"11px 14px",background:"none",border:"1px solid rgba(255,255,255,0.05)",borderRadius:11,color:"#9ca3af",fontSize:13,cursor:"pointer",marginBottom:8,textAlign:"left",transition:"all 0.18s"}}>
              {l}
            </button>
          ))}
        </HoverCard>
      </div>
    </div>
  );
}

// ── TEACHERS ───────────────────────────────────────────────────────────────────
function TeachersPage({campus}) {
  const [search,setSearch]=useState("");
  const [teachers,setTeachers]=useState(campusData[campus].teachers);
  const [modal,setModal]=useState(false);
  const [form,setForm]=useState({name:"",dept:"",email:"",phone:""});
  const filtered=teachers.filter(t=>t.name.toLowerCase().includes(search.toLowerCase())||t.dept.toLowerCase().includes(search.toLowerCase()));
  const add=()=>{
    if(!form.name) return;
    setTeachers([...teachers,{id:Date.now(),...form,classes:0,initials:form.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}]);
    setForm({name:"",dept:"",email:"",phone:""});setModal(false);
  };
  return (
    <div className="page-enter">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
        <div><h2 style={{fontSize:22,fontWeight:700,color:"#fff"}}>Teachers Management</h2><p style={{fontSize:12,color:"#6b7280",marginTop:3}}>Manage faculty and their schedules — Sector {campus}</p></div>
        <button onClick={()=>setModal(true)} className="btn-primary" style={{display:"flex",alignItems:"center",gap:6,background:"#7c3aed",color:"#fff",border:"none",borderRadius:11,padding:"9px 18px",fontSize:13,fontWeight:600,cursor:"pointer"}}>
          + Add Teacher
        </button>
      </div>
      <div style={{position:"relative",marginBottom:20}}>
        <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"#4b5563",fontSize:14}}>🔍</span>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search teachers by name or department..."
          style={{width:"100%",background:"#111",border:"1px solid rgba(255,255,255,0.05)",borderRadius:12,padding:"11px 14px 11px 40px",fontSize:13,color:"#fff",outline:"none",transition:"all 0.2s",boxSizing:"border-box"}}
          onFocus={e=>{e.target.style.borderColor="rgba(124,58,237,0.4)";e.target.style.boxShadow="0 0 0 3px rgba(124,58,237,0.08)"}}
          onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.05)";e.target.style.boxShadow="none"}}
        />
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
        {filtered.map(t=>{
          const [bg,tc]=deptTag[t.dept]||["#1f2937","#9ca3af"];
          return (
            <div key={t.id} className="teacher-card" style={{background:"#111",border:"1px solid rgba(255,255,255,0.06)",borderRadius:16,padding:18,cursor:"default"}}>
              <div style={{display:"flex",gap:12,marginBottom:14,alignItems:"flex-start"}}>
                <div className="avatar" style={{width:46,height:46,background:"linear-gradient(135deg,#6d28d9,#4c1d95)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"#fff",flexShrink:0}}>{t.initials}</div>
                <div>
                  <div style={{fontSize:13,fontWeight:600,color:"#fff",marginBottom:4}}>{t.name}</div>
                  <span style={{fontSize:11,background:bg,color:tc,padding:"2px 10px",borderRadius:99}}>{t.dept}</span>
                </div>
              </div>
              <div style={{fontSize:11,color:"#6b7280",marginBottom:4}}>✉ {t.email}</div>
              <div style={{fontSize:11,color:"#6b7280",marginBottom:12}}>📞 {t.phone}</div>
              <div style={{borderTop:"1px solid rgba(255,255,255,0.05)",paddingTop:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:12,color:"#9ca3af"}}>{t.classes} Classes</span>
                <div style={{display:"flex",gap:12}}>
                  <span className="icon-btn" style={{color:"#4b5563",cursor:"pointer",fontSize:14}}>✏️</span>
                  <span className="delete-btn" onClick={()=>setTeachers(teachers.filter(x=>x.id!==t.id))} style={{color:"#4b5563",cursor:"pointer",fontSize:14}}>🗑️</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {modal&&(
        <Modal title="Add New Teacher" onClose={()=>setModal(false)}>
          <Input label="Full Name" placeholder="Dr. / Prof. Full Name" value={form.name} onChange={v=>setForm({...form,name:v})}/>
          <Input label="Department" placeholder="e.g. Computer Science" value={form.dept} onChange={v=>setForm({...form,dept:v})}/>
          <Input label="Email" placeholder="name@jiit.ac.in" value={form.email} onChange={v=>setForm({...form,email:v})}/>
          <Input label="Phone" placeholder="+91 xxxxx-xxxxx" value={form.phone} onChange={v=>setForm({...form,phone:v})}/>
          <div style={{display:"flex",gap:10,marginTop:18}}>
            <button onClick={()=>setModal(false)} className="btn-secondary" style={{flex:1,padding:"10px",background:"none",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,color:"#9ca3af",cursor:"pointer",fontSize:13}}>Cancel</button>
            <button onClick={add} className="btn-primary" style={{flex:1,padding:"10px",background:"#7c3aed",border:"none",borderRadius:10,color:"#fff",cursor:"pointer",fontSize:13,fontWeight:600}}>Add Teacher</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── ROOMS ──────────────────────────────────────────────────────────────────────
function RoomsPage({campus}) {
  const [search,setSearch]=useState("");
  const [rooms,setRooms]=useState(campusData[campus].rooms);
  const [modal,setModal]=useState(false);
  const [form,setForm]=useState({name:"",type:"",block:"",capacity:""});
  const filtered=rooms.filter(r=>r.name.toLowerCase().includes(search.toLowerCase())||r.block.toLowerCase().includes(search.toLowerCase()));
  const add=()=>{
    if(!form.name) return;
    setRooms([...rooms,{id:Date.now(),...form,capacity:parseInt(form.capacity)||0,utilization:0}]);
    setForm({name:"",type:"",block:"",capacity:""});setModal(false);
  };
  return (
    <div className="page-enter">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
        <div><h2 style={{fontSize:22,fontWeight:700,color:"#fff"}}>Rooms Management</h2><p style={{fontSize:12,color:"#6b7280",marginTop:3}}>Manage classroom and lab spaces — Sector {campus}</p></div>
        <button onClick={()=>setModal(true)} className="btn-primary" style={{display:"flex",alignItems:"center",gap:6,background:"#7c3aed",color:"#fff",border:"none",borderRadius:11,padding:"9px 18px",fontSize:13,fontWeight:600,cursor:"pointer"}}>
          + Add Room
        </button>
      </div>
      <div style={{position:"relative",marginBottom:20}}>
        <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"#4b5563",fontSize:14}}>🔍</span>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search rooms by name, block, or type..."
          style={{width:"100%",background:"#111",border:"1px solid rgba(255,255,255,0.05)",borderRadius:12,padding:"11px 14px 11px 40px",fontSize:13,color:"#fff",outline:"none",transition:"all 0.2s",boxSizing:"border-box"}}
          onFocus={e=>{e.target.style.borderColor="rgba(124,58,237,0.4)";e.target.style.boxShadow="0 0 0 3px rgba(124,58,237,0.08)"}}
          onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.05)";e.target.style.boxShadow="none"}}
        />
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
        {filtered.map(r=>(
          <div key={r.id} className="room-card" style={{background:"#111",border:"1px solid rgba(255,255,255,0.06)",borderRadius:16,padding:18,cursor:"default"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
              <div>
                <div style={{fontWeight:600,color:"#fff",fontSize:14}}>{r.name}</div>
                <div style={{fontSize:11,color:"#6b7280",marginTop:2}}>{r.type}</div>
              </div>
              <div style={{display:"flex",gap:10}}>
                <span className="icon-btn" style={{color:"#4b5563",cursor:"pointer",fontSize:13}}>✏️</span>
                <span className="delete-btn" onClick={()=>setRooms(rooms.filter(x=>x.id!==r.id))} style={{color:"#4b5563",cursor:"pointer",fontSize:13}}>🗑️</span>
              </div>
            </div>
            <div style={{fontSize:11,color:"#6b7280",marginBottom:3}}>📍 {r.block}</div>
            <div style={{fontSize:11,color:"#6b7280"}}>👥 Capacity: {r.capacity}</div>
            <UtilBar val={r.utilization}/>
          </div>
        ))}
      </div>
      {modal&&(
        <Modal title="Add New Room" onClose={()=>setModal(false)}>
          <Input label="Room Name" placeholder="e.g. Room 301" value={form.name} onChange={v=>setForm({...form,name:v})}/>
          <Input label="Type" placeholder="e.g. Lecture Hall, Lab" value={form.type} onChange={v=>setForm({...form,type:v})}/>
          <Input label="Block" placeholder="e.g. A-Block" value={form.block} onChange={v=>setForm({...form,block:v})}/>
          <Input label="Capacity" placeholder="e.g. 60" value={form.capacity} onChange={v=>setForm({...form,capacity:v})}/>
          <div style={{display:"flex",gap:10,marginTop:18}}>
            <button onClick={()=>setModal(false)} className="btn-secondary" style={{flex:1,padding:"10px",background:"none",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,color:"#9ca3af",cursor:"pointer",fontSize:13}}>Cancel</button>
            <button onClick={add} className="btn-primary" style={{flex:1,padding:"10px",background:"#7c3aed",border:"none",borderRadius:10,color:"#fff",cursor:"pointer",fontSize:13,fontWeight:600}}>Add Room</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── SUBJECTS ───────────────────────────────────────────────────────────────────
function SubjectsPage({campus}) {
  const [search,setSearch]=useState("");
  const [subjects,setSubjects]=useState(campusData[campus].subjects);
  const [modal,setModal]=useState(false);
  const [form,setForm]=useState({code:"",name:"",dept:"",credits:"",hours:""});
  const filtered=subjects.filter(s=>s.name.toLowerCase().includes(search.toLowerCase())||s.code.toLowerCase().includes(search.toLowerCase()));
  const add=()=>{
    if(!form.name) return;
    setSubjects([...subjects,{id:Date.now(),...form,credits:parseInt(form.credits)||0,hours:parseInt(form.hours)||0}]);
    setForm({code:"",name:"",dept:"",credits:"",hours:""});setModal(false);
  };
  return (
    <div className="page-enter">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
        <div><h2 style={{fontSize:22,fontWeight:700,color:"#fff"}}>Subjects Management</h2><p style={{fontSize:12,color:"#6b7280",marginTop:3}}>Manage courses and their schedules — Sector {campus}</p></div>
        <button onClick={()=>setModal(true)} className="btn-primary" style={{display:"flex",alignItems:"center",gap:6,background:"#7c3aed",color:"#fff",border:"none",borderRadius:11,padding:"9px 18px",fontSize:13,fontWeight:600,cursor:"pointer"}}>
          + Add Subject
        </button>
      </div>
      <div style={{position:"relative",marginBottom:20}}>
        <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"#4b5563",fontSize:14}}>🔍</span>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search subjects by code, name, or department..."
          style={{width:"100%",background:"#111",border:"1px solid rgba(255,255,255,0.05)",borderRadius:12,padding:"11px 14px 11px 40px",fontSize:13,color:"#fff",outline:"none",transition:"all 0.2s",boxSizing:"border-box"}}
          onFocus={e=>{e.target.style.borderColor="rgba(124,58,237,0.4)";e.target.style.boxShadow="0 0 0 3px rgba(124,58,237,0.08)"}}
          onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.05)";e.target.style.boxShadow="none"}}
        />
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
        {filtered.map(s=>(
          <div key={s.id} className="subject-card" style={{background:"#111",border:"1px solid rgba(255,255,255,0.06)",borderRadius:16,padding:18,cursor:"default"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <div>
                <div style={{fontSize:11,fontWeight:700,color:deptCode[s.dept]||"#a78bfa",marginBottom:3}}>{s.code}</div>
                <div style={{fontSize:14,fontWeight:700,color:"#fff"}}>{s.name}</div>
                <div style={{fontSize:11,color:"#6b7280",marginTop:2}}>{s.dept}</div>
              </div>
              <div className="sub-icon" style={{width:36,height:36,background:"#1e1a3a",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>📖</div>
            </div>
            <div style={{borderTop:"1px solid rgba(255,255,255,0.05)",paddingTop:10,marginTop:6}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:5}}><span style={{color:"#6b7280"}}>Credits</span><span style={{color:"#fff",fontWeight:600}}>{s.credits}</span></div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12}}><span style={{color:"#6b7280"}}>⏱ Hours/Week</span><span style={{color:"#fff",fontWeight:600}}>{s.hours}</span></div>
            </div>
            <div style={{display:"flex",justifyContent:"flex-end",gap:12,marginTop:12,paddingTop:10,borderTop:"1px solid rgba(255,255,255,0.05)"}}>
              <span className="icon-btn" style={{color:"#4b5563",cursor:"pointer",fontSize:13}}>✏️</span>
              <span className="delete-btn" onClick={()=>setSubjects(subjects.filter(x=>x.id!==s.id))} style={{color:"#4b5563",cursor:"pointer",fontSize:13}}>🗑️</span>
            </div>
          </div>
        ))}
      </div>
      {modal&&(
        <Modal title="Add New Subject" onClose={()=>setModal(false)}>
          <Input label="Subject Code" placeholder="e.g. CS101" value={form.code} onChange={v=>setForm({...form,code:v})}/>
          <Input label="Subject Name" placeholder="e.g. Data Structures" value={form.name} onChange={v=>setForm({...form,name:v})}/>
          <Input label="Department" placeholder="e.g. Computer Science" value={form.dept} onChange={v=>setForm({...form,dept:v})}/>
          <Input label="Credits" placeholder="e.g. 4" value={form.credits} onChange={v=>setForm({...form,credits:v})}/>
          <Input label="Hours/Week" placeholder="e.g. 6" value={form.hours} onChange={v=>setForm({...form,hours:v})}/>
          <div style={{display:"flex",gap:10,marginTop:18}}>
            <button onClick={()=>setModal(false)} className="btn-secondary" style={{flex:1,padding:"10px",background:"none",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,color:"#9ca3af",cursor:"pointer",fontSize:13}}>Cancel</button>
            <button onClick={add} className="btn-primary" style={{flex:1,padding:"10px",background:"#7c3aed",border:"none",borderRadius:10,color:"#fff",cursor:"pointer",fontSize:13,fontWeight:600}}>Add Subject</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── CLASH DETECTION ────────────────────────────────────────────────────────────
function ClashPage({campus}) {
  const [state,setState]=useState("idle");
  const [clashes,setClashes]=useState([]);
  const analyze=()=>{setState("loading");setTimeout(()=>{setClashes(sampleClashes[campus]);setState("done");},2200);};
  const resolve=(id)=>setClashes(clashes.map(c=>c.id===id?{...c,status:"resolved"}:c));
  const pending=clashes.filter(c=>c.status==="pending");
  const resolved=clashes.filter(c=>c.status==="resolved");
  return (
    <div className="page-enter">
      <div style={{marginBottom:20}}>
        <h2 style={{fontSize:22,fontWeight:700,color:"#fff"}}>Clash Detection</h2>
        <p style={{fontSize:12,color:"#6b7280",marginTop:3}}>Upload and analyze timetables for conflicts — Sector {campus}</p>
      </div>
      {state!=="done"?(
        <div className="upload-box" style={{background:"#111",border:"2px dashed rgba(124,58,237,0.25)",borderRadius:20,padding:"90px 40px",display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center",cursor:"pointer",transition:"all 0.2s"}} onClick={state==="idle"?analyze:undefined}>
          <div style={{width:72,height:72,background:"#1e1a3a",border:"1px solid rgba(124,58,237,0.3)",borderRadius:18,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,marginBottom:20}}>
            {state==="loading"?<div style={{width:32,height:32,border:"3px solid rgba(167,139,250,0.25)",borderTop:"3px solid #a78bfa",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>:"⬆️"}
          </div>
          <div style={{fontSize:18,fontWeight:700,color:"#fff",marginBottom:8}}>{state==="loading"?"Analyzing Timetable...":"Upload Timetable"}</div>
          <div style={{fontSize:13,color:"#6b7280",marginBottom:28}}>{state==="loading"?"AI is scanning for scheduling conflicts":"Click here or drop your CSV / Excel file to detect clashes"}</div>
          {state==="idle"&&(
            <div style={{display:"flex",gap:12}}>
              <button onClick={e=>{e.stopPropagation();analyze();}} className="btn-primary" style={{display:"flex",alignItems:"center",gap:7,background:"#7c3aed",color:"#fff",border:"none",borderRadius:12,padding:"12px 24px",fontSize:13,fontWeight:600,cursor:"pointer"}}>
                ⬆️ Upload & Analyze
              </button>
              <button className="btn-secondary" style={{display:"flex",alignItems:"center",gap:7,background:"#1a1a1a",color:"#fff",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,padding:"12px 24px",fontSize:13,cursor:"pointer"}}>
                ⬇️ Export Report
              </button>
            </div>
          )}
          {state==="loading"&&(
            <div>
              <div style={{width:240,height:5,background:"rgba(255,255,255,0.05)",borderRadius:99,overflow:"hidden"}}>
                <div style={{width:"70%",height:"100%",background:"linear-gradient(90deg,#7c3aed,#a855f7)",borderRadius:99,animation:"pulse 1.2s ease infinite"}}/>
              </div>
              <div style={{fontSize:11,color:"#4b5563",marginTop:8}}>Scanning 248 classes...</div>
            </div>
          )}
        </div>
      ):(
        <div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:20}}>
            {[["Total Clashes",clashes.length,"#fff"],["Pending",pending.length,"#f87171"],["Resolved",resolved.length,"#4ade80"]].map(([l,v,c])=>(
              <div key={l} className="stat-card" style={{background:"#111",border:"1px solid rgba(255,255,255,0.06)",borderRadius:16,padding:18,textAlign:"center",cursor:"default"}}>
                <div style={{fontSize:30,fontWeight:700,color:c}}>{v}</div>
                <div style={{fontSize:12,color:"#6b7280",marginTop:4}}>{l}</div>
              </div>
            ))}
          </div>
          <HoverCard>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <span style={{fontSize:14,fontWeight:600,color:"#fff"}}>Detected Clashes</span>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>{setState("idle");setClashes([]);}} className="btn-secondary" style={{fontSize:11,color:"#6b7280",background:"none",border:"1px solid rgba(255,255,255,0.08)",borderRadius:8,padding:"5px 10px",cursor:"pointer"}}>↺ Re-analyze</button>
                <button className="btn-secondary" style={{fontSize:11,color:"#6b7280",background:"none",border:"1px solid rgba(255,255,255,0.08)",borderRadius:8,padding:"5px 10px",cursor:"pointer"}}>⬇ Export</button>
              </div>
            </div>
            {clashes.map((c,i)=>(
              <div key={c.id} className="clash-row" style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 8px",borderTop:i>0?"1px solid rgba(255,255,255,0.04)":"none",borderRadius:10,transition:"all 0.15s",cursor:"default"}}>
                <div style={{display:"flex",gap:12,alignItems:"center"}}>
                  <div style={{width:36,height:36,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",background:c.status==="resolved"?"rgba(34,197,94,0.1)":"rgba(239,68,68,0.1)",fontSize:16,flexShrink:0}}>
                    {c.status==="resolved"?"✅":"⚠️"}
                  </div>
                  <div>
                    <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:3}}>
                      <span style={{fontSize:13,fontWeight:500,color:"#fff"}}>{c.type}</span>
                      <span style={{fontSize:10,padding:"2px 8px",borderRadius:99,background:c.status==="resolved"?"rgba(34,197,94,0.1)":"rgba(239,68,68,0.1)",color:c.status==="resolved"?"#4ade80":"#f87171"}}>{c.status}</span>
                    </div>
                    <div style={{fontSize:11,color:"#6b7280"}}>{c.desc} — {c.subjects}</div>
                    <div style={{fontSize:10,color:"#374151",marginTop:1}}>🕐 {c.time}</div>
                  </div>
                </div>
                {c.status==="pending"&&(
                  <button onClick={()=>resolve(c.id)} className="resolve-btn" style={{background:"#7c3aed",color:"#fff",border:"none",borderRadius:9,padding:"7px 14px",fontSize:11,fontWeight:600,cursor:"pointer",flexShrink:0}}>Auto-Resolve</button>
                )}
              </div>
            ))}
          </HoverCard>
        </div>
      )}
    </div>
  );
}

// ── TIMETABLE ──────────────────────────────────────────────────────────────────
function TimetablePage({campus}) {
  const [schedule,setSchedule]=useState(campusData[campus].schedule);
  const [dragging,setDragging]=useState(null);
  const [dropTarget,setDropTarget]=useState(null);
  const legend=[
    {l:"Computer Science",c:"#7c3aed"},{l:"Mathematics",c:"#3b82f6"},{l:"Physics",c:"#22c55e"},
    {l:"Chemistry",c:"#f59e0b"},{l:"Electrical Eng.",c:"#ef4444"},
  ];
  return (
    <div className="page-enter">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
        <div><h2 style={{fontSize:22,fontWeight:700,color:"#fff"}}>Timetable View</h2><p style={{fontSize:12,color:"#6b7280",marginTop:3}}>Drag and drop class blocks to reschedule — Sector {campus}</p></div>
        <button className="btn-primary" style={{display:"flex",alignItems:"center",gap:6,background:"#7c3aed",color:"#fff",border:"none",borderRadius:11,padding:"9px 18px",fontSize:13,fontWeight:600,cursor:"pointer"}}>
          ⬇ Export
        </button>
      </div>
      <div style={{background:"#111",border:"1px solid rgba(255,255,255,0.05)",borderRadius:18,overflow:"auto",marginBottom:14}}>
        <table style={{width:"100%",borderCollapse:"collapse",minWidth:900}}>
          <thead>
            <tr style={{borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
              <th style={{padding:"12px 16px",textAlign:"left",fontSize:11,color:"#6b7280",fontWeight:500,width:90}}>Time</th>
              {DAYS.map(d=>(
                <th key={d} style={{padding:"12px 10px",fontSize:12,fontWeight:600,color:"#fff",background:"rgba(26,20,53,0.7)",borderLeft:"1px solid rgba(255,255,255,0.04)"}}>{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIMES.map(time=>(
              <tr key={time} className="time-row" style={{borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                <td style={{padding:"6px 16px",fontSize:11,color:"#6b7280",whiteSpace:"nowrap"}}>{time}</td>
                {DAYS.map(day=>{
                  const key=`${day}-${time}`;
                  const cell=schedule[key];
                  const isTarget=dropTarget===key;
                  return (
                    <td key={day} className="drop-zone" style={{padding:4,borderLeft:"1px solid rgba(255,255,255,0.04)",height:58,verticalAlign:"top",background:isTarget?"rgba(124,58,237,0.08)":"transparent",transition:"background 0.15s",borderRadius:isTarget?8:0}}
                      onDragOver={e=>{e.preventDefault();setDropTarget(key);}}
                      onDragLeave={()=>setDropTarget(null)}
                      onDrop={()=>{
                        if(!dragging||dragging.key===key) return;
                        const s={...schedule};delete s[dragging.key];s[key]=dragging.item;
                        setSchedule(s);setDragging(null);setDropTarget(null);
                      }}
                    >
                      {cell&&(
                        <div draggable onDragStart={()=>setDragging({key,item:cell})} onDragEnd={()=>setDragging(null)}
                          className="timetable-cell"
                          style={{height:"100%",borderRadius:10,border:`1px solid ${cell.border}`,background:cell.col,padding:"5px 8px",cursor:"grab",userSelect:"none",position:"relative",overflow:"hidden"}}>
                          <div style={{position:"absolute",inset:0,background:`linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%)`,pointerEvents:"none"}}/>
                          <div style={{fontSize:11,fontWeight:700,color:"#fff"}}>{cell.code}</div>
                          <div style={{fontSize:10,color:"rgba(255,255,255,0.65)"}}>{cell.teacher}</div>
                          <div style={{fontSize:9,color:"rgba(255,255,255,0.4)"}}>{cell.room}</div>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{background:"#111",border:"1px solid rgba(255,255,255,0.05)",borderRadius:14,padding:"14px 20px"}}>
        <div style={{fontSize:12,fontWeight:500,color:"#9ca3af",marginBottom:10}}>Subject Legend</div>
        <div style={{display:"flex",gap:22,flexWrap:"wrap"}}>
          {legend.map(({l,c})=>(
            <div key={l} style={{display:"flex",alignItems:"center",gap:7,fontSize:12,color:"#9ca3af"}}>
              <div style={{width:10,height:10,background:c,borderRadius:3}}/>
              {l}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── ANALYTICS ──────────────────────────────────────────────────────────────────
function AnalyticsPage({campus}) {
  const d=campusData[campus].analytics;
  return (
    <div className="page-enter">
      <div style={{marginBottom:20}}>
        <h2 style={{fontSize:22,fontWeight:700,color:"#fff"}}>Analytics Dashboard</h2>
        <p style={{fontSize:12,color:"#6b7280",marginTop:3}}>Insights and performance metrics — Sector {campus}</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
        {[["📐 Avg. Room Utilization",d.avgUtil,"+5.2% from last month","#4ade80"],["👩‍🏫 Avg. Teacher Workload",d.avgWork,"Per week","#6b7280"],["⚡ Clash Resolution",d.clashRes,"+12% improvement","#4ade80"],["🎯 Efficiency Score",d.eff,"Overall performance","#a78bfa"]].map(([l,v,s,sc])=>(
          <div key={l} className="stat-card" style={{background:"#111",border:"1px solid rgba(255,255,255,0.06)",borderRadius:16,padding:18,cursor:"default"}}>
            <div style={{fontSize:11,color:"#6b7280",marginBottom:10}}>{l}</div>
            <div style={{fontSize:24,fontWeight:700,color:"#fff",marginBottom:5}}>{v}</div>
            <div style={{fontSize:11,color:sc}}>{s}</div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        <HoverCard>
          <div style={{fontSize:13,fontWeight:600,color:"#fff",marginBottom:3}}>Room Utilization</div>
          <div style={{fontSize:11,color:"#6b7280",marginBottom:14}}>Percentage of time rooms are occupied</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={d.roomUtil.map(r=>({name:r.n,value:r.v}))} barSize={22}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false}/>
              <XAxis dataKey="name" tick={{fill:"#6b7280",fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:"#6b7280",fontSize:10}} axisLine={false} tickLine={false} domain={[0,100]}/>
              <Tooltip contentStyle={{background:"#1a1a1a",border:"1px solid rgba(124,58,237,0.2)",borderRadius:10,color:"#fff",fontSize:12}}/>
              <Bar dataKey="value" fill="#7c3aed" radius={[5,5,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </HoverCard>
        <HoverCard>
          <div style={{fontSize:13,fontWeight:600,color:"#fff",marginBottom:3}}>Teacher Workload</div>
          <div style={{fontSize:11,color:"#6b7280",marginBottom:14}}>Weekly teaching hours per faculty</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={d.workload.map(w=>({name:w.n,hours:w.h}))} barSize={22}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false}/>
              <XAxis dataKey="name" tick={{fill:"#6b7280",fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:"#6b7280",fontSize:10}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{background:"#1a1a1a",border:"1px solid rgba(124,58,237,0.2)",borderRadius:10,color:"#fff",fontSize:12}}/>
              <Bar dataKey="hours" fill="#22c55e" radius={[5,5,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </HoverCard>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <HoverCard>
          <div style={{fontSize:13,fontWeight:600,color:"#fff",marginBottom:3}}>Clash Resolution Status</div>
          <div style={{fontSize:11,color:"#6b7280",marginBottom:10}}>Distribution of resolved vs pending clashes</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={d.pie} cx="50%" cy="50%" outerRadius={80} dataKey="value" startAngle={90} endAngle={-270}>
                {d.pie.map((_,i)=><Cell key={i} fill={PIE_COLORS[i%2]}/>)}
              </Pie>
              <Legend formatter={(v,e)=><span style={{color:e.color,fontSize:12}}>{v} {e.payload.value}%</span>}/>
              <Tooltip contentStyle={{background:"#1a1a1a",border:"1px solid rgba(124,58,237,0.2)",borderRadius:10,color:"#fff",fontSize:12}}/>
            </PieChart>
          </ResponsiveContainer>
        </HoverCard>
        <HoverCard>
          <div style={{fontSize:13,fontWeight:600,color:"#fff",marginBottom:3}}>Weekly Clash Trends</div>
          <div style={{fontSize:11,color:"#6b7280",marginBottom:14}}>Detected and resolved clashes over time</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={d.trends.map(t=>({week:t.w,clashes:t.c,resolved:t.r}))} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false}/>
              <XAxis dataKey="week" tick={{fill:"#6b7280",fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:"#6b7280",fontSize:10}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{background:"#1a1a1a",border:"1px solid rgba(124,58,237,0.2)",borderRadius:10,color:"#fff",fontSize:12}}/>
              <Bar dataKey="clashes" fill="#ef4444" radius={[4,4,0,0]} name="clashes"/>
              <Bar dataKey="resolved" fill="#22c55e" radius={[4,4,0,0]} name="resolved"/>
              <Legend wrapperStyle={{paddingTop:10,fontSize:11}}/>
            </BarChart>
          </ResponsiveContainer>
        </HoverCard>
      </div>
    </div>
  );
}

// ── HOW TO NAVIGATE TOOLTIP ────────────────────────────────────────────────────
function NavGuide({onClose}) {
  return (
    <div style={{position:"fixed",bottom:20,right:20,background:"#13102a",border:"1px solid rgba(124,58,237,0.4)",borderRadius:16,padding:20,maxWidth:320,zIndex:999,boxShadow:"0 20px 50px rgba(0,0,0,0.5)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <span style={{color:"#a78bfa",fontWeight:700,fontSize:14}}>🗺️ How to Navigate</span>
        <button onClick={onClose} style={{background:"none",border:"none",color:"#6b7280",cursor:"pointer",fontSize:18,lineHeight:1}}>×</button>
      </div>
      {[
        ["🖱️ Sidebar","Click any item in the left sidebar to switch pages"],
        ["🔄 Campus","Toggle Sec 128 / Sec 62 at the top of sidebar"],
        ["🏠 Landing","Click × in the header to return to landing page"],
        ["🖱️ Cards","Hover over cards for lift & glow effects"],
        ["📅 Timetable","Drag & drop colored blocks to reschedule classes"],
        ["⚠️ Clashes","Click 'Upload & Analyze' then 'Auto-Resolve'"],
        ["➕ Add Data","Use '+ Add' buttons to add teachers, rooms, subjects"],
      ].map(([k,v])=>(
        <div key={k} style={{display:"flex",gap:8,marginBottom:8}}>
          <span style={{fontSize:12,color:"#7c3aed",fontWeight:600,flexShrink:0,minWidth:90}}>{k}</span>
          <span style={{fontSize:11,color:"#9ca3af",lineHeight:1.5}}>{v}</span>
        </div>
      ))}
    </div>
  );
}

// ── APP SHELL ──────────────────────────────────────────────────────────────────
const NAV=[
  {id:"dashboard",label:"Dashboard",icon:"⊞"},
  {id:"teachers",label:"Teachers",icon:"👥"},
  {id:"rooms",label:"Rooms",icon:"🏢"},
  {id:"subjects",label:"Subjects",icon:"📚"},
  {id:"clashdetection",label:"Clash Detection",icon:"⚠️"},
  {id:"timetable",label:"Timetable",icon:"📅"},
  {id:"analytics",label:"Analytics",icon:"📊"},
];

function AppShell({onBack}) {
  const [page,setPage]=useState("dashboard");
  const [campus,setCampus]=useState("128");
  const [showGuide,setShowGuide]=useState(true);
  const pages={
    dashboard:<DashPage campus={campus} setPage={setPage}/>,
    teachers:<TeachersPage campus={campus}/>,
    rooms:<RoomsPage campus={campus}/>,
    subjects:<SubjectsPage campus={campus}/>,
    clashdetection:<ClashPage campus={campus}/>,
    timetable:<TimetablePage campus={campus}/>,
    analytics:<AnalyticsPage campus={campus}/>,
  };
  return (
    <div style={{display:"flex",height:"100%",background:"#0a0a0a",color:"#fff",fontFamily:"system-ui,sans-serif",overflow:"hidden",position:"relative"}}>
      {/* Sidebar */}
      <aside style={{width:216,minWidth:216,background:"#0d0d0d",borderRight:"1px solid rgba(255,255,255,0.05)",display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{padding:"14px 12px",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
          <div style={{display:"flex",alignItems:"center",gap:9}}>
            <div style={{width:34,height:34,background:"#1e1a3a",border:"1px solid rgba(124,58,237,0.4)",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>📅</div>
            <div><div style={{fontWeight:700,fontSize:12,color:"#fff"}}>JIIT SmartSched AI</div><div style={{fontSize:10,color:"#6b7280"}}>Timetable Manager</div></div>
          </div>
        </div>
        {/* Campus toggle */}
        <div style={{padding:"10px 12px",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
          <div style={{fontSize:9,color:"#4b5563",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>Campus</div>
          <div style={{display:"flex",borderRadius:9,background:"#111",border:"1px solid rgba(255,255,255,0.05)",overflow:"hidden"}}>
            {["128","62"].map(s=>(
              <button key={s} onClick={()=>setCampus(s)} className="campus-btn" style={{flex:1,padding:"7px 0",background:campus===s?"#7c3aed":"none",border:"none",color:campus===s?"#fff":"#6b7280",cursor:"pointer",fontWeight:campus===s?600:400,fontSize:11,transition:"all 0.2s",boxShadow:campus===s?"0 2px 8px rgba(124,58,237,0.3)":"none"}}>
                Sec {s}
              </button>
            ))}
          </div>
        </div>
        {/* Nav items */}
        <nav style={{flex:1,padding:"8px",overflowY:"auto"}}>
          {NAV.map(({id,label,icon})=>(
            <button key={id} onClick={()=>setPage(id)} className={`nav-btn${page===id?" active":""}`}
              style={{width:"100%",display:"flex",alignItems:"center",gap:9,padding:"9px 12px",borderRadius:10,border:"none",background:page===id?"#7c3aed":"none",color:page===id?"#fff":"#6b7280",fontSize:12,fontWeight:page===id?600:400,cursor:"pointer",marginBottom:1,textAlign:"left"}}>
              <span style={{fontSize:15}}>{icon}</span>{label}
            </button>
          ))}
        </nav>
        {/* User */}
        <div style={{padding:"12px",borderTop:"1px solid rgba(255,255,255,0.05)"}}>
          <div style={{display:"flex",alignItems:"center",gap:9}}>
            <div style={{width:30,height:30,background:"linear-gradient(135deg,#7c3aed,#4c1d95)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff"}}>A</div>
            <div><div style={{fontSize:12,color:"#fff",fontWeight:500}}>Admin User</div><div style={{fontSize:10,color:"#6b7280"}}>JIIT Sec {campus}</div></div>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <header style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 20px",borderBottom:"1px solid rgba(255,255,255,0.05)",background:"#0d0d0d",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <button onClick={onBack} className="header-icon" style={{background:"none",border:"none",color:"#6b7280",cursor:"pointer",fontSize:18,lineHeight:1,padding:2}}>×</button>
            <span style={{fontSize:15,fontWeight:600,color:"#fff"}}>{NAV.find(n=>n.id===page)?.label}</span>
          </div>
          <div style={{display:"flex",gap:4}}>
            <button onClick={()=>setShowGuide(v=>!v)} style={{background:"rgba(124,58,237,0.15)",border:"1px solid rgba(124,58,237,0.25)",borderRadius:8,color:"#a78bfa",cursor:"pointer",padding:"5px 10px",fontSize:11,fontWeight:600,transition:"all 0.2s"}} onMouseEnter={e=>{e.target.style.background="rgba(124,58,237,0.25)"}} onMouseLeave={e=>{e.target.style.background="rgba(124,58,237,0.15)"}}>
              🗺️ How to Navigate
            </button>
            <button className="header-icon" style={{background:"none",border:"none",color:"#6b7280",cursor:"pointer",padding:"6px 8px",fontSize:16,position:"relative"}}>
              🔔
              <span style={{position:"absolute",top:4,right:4,width:6,height:6,background:"#7c3aed",borderRadius:"50%",boxShadow:"0 0 4px #7c3aed"}}/>
            </button>
            <button className="header-icon" style={{background:"none",border:"none",color:"#6b7280",cursor:"pointer",padding:"6px 8px",fontSize:16}}>⚙️</button>
          </div>
        </header>
        <main style={{flex:1,overflowY:"auto",padding:20}}>
          {pages[page]}
        </main>
      </div>

      {showGuide&&<NavGuide onClose={()=>setShowGuide(false)}/>}
    </div>
  );
}

// ── ROOT ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [view,setView]=useState("landing");
  return (
    <div style={{width:"100%",height:"100vh",overflow:"auto",background:"#0a0a0a"}}>
      <G/>
      {view==="landing"
        ?<Landing onEnter={()=>setView("app")}/>
        :<AppShell onBack={()=>setView("landing")}/>
      }
    </div>
  );
}
