export const TIME_SLOTS = ["9:00","10:00","11:00","LUNCH","1:00","2:00","3:00","4:00"];

export const DAY_LABELS = [
  { s:"MON", f:"Monday"    },
  { s:"TUE", f:"Tuesday"   },
  { s:"WED", f:"Wednesday" },
  { s:"THU", f:"Thursday"  },
  { s:"FRI", f:"Friday"    },
  { s:"SAT", f:"Saturday"  },
];

export const SUBJECT_META = {
  CI121:     { name:"Computing Fundamentals", color:"#22c55e" },
  PH211:     { name:"Engineering Physics",    color:"#3b82f6" },
  MA211:     { name:"Engineering Maths",      color:"#8b5cf6" },
  HS111:     { name:"Communication Skills",   color:"#f59e0b" },
  GE112:     { name:"Workshop / Sport",       color:"#ec4899" },
  PH271:     { name:"Physics Lab",            color:"#06b6d4" },
  CS121:     { name:"Computing Lab",          color:"#14b8a6" },
  MA212:     { name:"Maths-II",               color:"#a855f7" },
  PH212:     { name:"Physics-II",             color:"#6366f1" },
  B11CI121:  { name:"Computing (B11)",        color:"#10b981" },
  B15CI121:  { name:"Computing (B15)",        color:"#0ea5e9" },
  "15BT111": { name:"Biotechnology",          color:"#84cc16" },
  MA111:     { name:"Maths-I",                color:"#a78bfa" },
  PH112:     { name:"Physics-I",              color:"#38bdf8" },
  PH171:     { name:"Physics Lab-I",          color:"#34d399" },
};

export const getSubjectColor = (s) => SUBJECT_META[s]?.color || "#7c3aed";
export const getSubjectName  = (s) => SUBJECT_META[s]?.name  || s;

export const ALL_BATCHES = [
  "A1","A2","A3","A4","A5","A6","A7","A8","A9","A10",
  "A11","A12","A13","A14","A15","A16","A17","A18",
  "B1","B2","B3","B4","B5","B6","B7","B8","B9","B10",
  "B11","B12","B13","B14","B15",
  "C1","C2","C3","D1","D2","G1","G2","G3","G4",
];

export const BRANCHES = ["CSE","IT","ECE","EEE","ME","CE","BT"];

export const DEMO_USERS = [
  { id:1, username:"admin",    password:"admin123",   role:"admin",   name:"Admin" },
  { id:2, username:"student1", password:"student123", role:"student", name:"Arjun Sharma" },
];
