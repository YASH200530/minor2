require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

// ─── Connect ────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => { console.error("❌ MongoDB connection failed:", err.message); process.exit(1); });

// ─── Inline schema (no import needed) ───────────────────────
const adminSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  name:       { type: String, required: true },
  password:   { type: String, required: true },
  role:       { type: String, default: "admin" },
  isActive:   { type: Boolean, default: true },
  createdAt:  { type: Date, default: Date.now },
});
const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);

// ─── 100 Admin entries ───────────────────────────────────────
// Format: employeeId = JIIT001 to JIIT100
// Default password = Admin@2026  (change after first login)
// Names are realistic JIIT faculty names

const ADMIN_DATA = [
  { employeeId: "JIIT001", name: "Dr. Rajesh Kumar Sharma",    password: "Admin@2026" },
  { employeeId: "JIIT002", name: "Dr. Priya Mehta",            password: "Admin@2026" },
  { employeeId: "JIIT003", name: "Prof. Anil Verma",           password: "Admin@2026" },
  { employeeId: "JIIT004", name: "Dr. Sunita Yadav",           password: "Admin@2026" },
  { employeeId: "JIIT005", name: "Prof. Vikram Singh",         password: "Admin@2026" },
  { employeeId: "JIIT006", name: "Dr. Kavitha Nair",           password: "Admin@2026" },
  { employeeId: "JIIT007", name: "Prof. Amit Gupta",           password: "Admin@2026" },
  { employeeId: "JIIT008", name: "Dr. Neha Joshi",             password: "Admin@2026" },
  { employeeId: "JIIT009", name: "Prof. Rahul Bhatia",         password: "Admin@2026" },
  { employeeId: "JIIT010", name: "Dr. Pooja Saxena",           password: "Admin@2026" },
  { employeeId: "JIIT011", name: "Prof. Sanjay Tiwari",        password: "Admin@2026" },
  { employeeId: "JIIT012", name: "Dr. Meena Kapoor",           password: "Admin@2026" },
  { employeeId: "JIIT013", name: "Prof. Deepak Mishra",        password: "Admin@2026" },
  { employeeId: "JIIT014", name: "Dr. Ananya Chatterjee",      password: "Admin@2026" },
  { employeeId: "JIIT015", name: "Prof. Suresh Pandey",        password: "Admin@2026" },
  { employeeId: "JIIT016", name: "Dr. Ritu Agarwal",           password: "Admin@2026" },
  { employeeId: "JIIT017", name: "Prof. Manoj Srivastava",     password: "Admin@2026" },
  { employeeId: "JIIT018", name: "Dr. Shruti Dubey",           password: "Admin@2026" },
  { employeeId: "JIIT019", name: "Prof. Naveen Chandra",       password: "Admin@2026" },
  { employeeId: "JIIT020", name: "Dr. Divya Menon",            password: "Admin@2026" },
  { employeeId: "JIIT021", name: "Prof. Vinod Tripathi",       password: "Admin@2026" },
  { employeeId: "JIIT022", name: "Dr. Anjali Patel",           password: "Admin@2026" },
  { employeeId: "JIIT023", name: "Prof. Girish Chandra",       password: "Admin@2026" },
  { employeeId: "JIIT024", name: "Dr. Swati Rastogi",          password: "Admin@2026" },
  { employeeId: "JIIT025", name: "Prof. Alok Kumar",           password: "Admin@2026" },
  { employeeId: "JIIT026", name: "Dr. Nandita Roy",            password: "Admin@2026" },
  { employeeId: "JIIT027", name: "Prof. Pankaj Shukla",        password: "Admin@2026" },
  { employeeId: "JIIT028", name: "Dr. Varsha Singh",           password: "Admin@2026" },
  { employeeId: "JIIT029", name: "Prof. Dinesh Yadav",         password: "Admin@2026" },
  { employeeId: "JIIT030", name: "Dr. Rashmi Verma",           password: "Admin@2026" },
  { employeeId: "JIIT031", name: "Prof. Ashish Mathur",        password: "Admin@2026" },
  { employeeId: "JIIT032", name: "Dr. Smita Wagh",             password: "Admin@2026" },
  { employeeId: "JIIT033", name: "Prof. Hemant Jha",           password: "Admin@2026" },
  { employeeId: "JIIT034", name: "Dr. Tanvi Goswami",          password: "Admin@2026" },
  { employeeId: "JIIT035", name: "Prof. Krishnan Murthy",      password: "Admin@2026" },
  { employeeId: "JIIT036", name: "Dr. Parveen Kaur",           password: "Admin@2026" },
  { employeeId: "JIIT037", name: "Prof. Lalit Mohan",          password: "Admin@2026" },
  { employeeId: "JIIT038", name: "Dr. Sudha Rani",             password: "Admin@2026" },
  { employeeId: "JIIT039", name: "Prof. Bharat Lal",           password: "Admin@2026" },
  { employeeId: "JIIT040", name: "Dr. Preeti Sharma",          password: "Admin@2026" },
  { employeeId: "JIIT041", name: "Prof. Umesh Pandey",         password: "Admin@2026" },
  { employeeId: "JIIT042", name: "Dr. Archana Dixit",          password: "Admin@2026" },
  { employeeId: "JIIT043", name: "Prof. Yogesh Misra",         password: "Admin@2026" },
  { employeeId: "JIIT044", name: "Dr. Madhu Bala",             password: "Admin@2026" },
  { employeeId: "JIIT045", name: "Prof. Naresh Gupta",         password: "Admin@2026" },
  { employeeId: "JIIT046", name: "Dr. Shalini Agarwal",        password: "Admin@2026" },
  { employeeId: "JIIT047", name: "Prof. Rajeev Saxena",        password: "Admin@2026" },
  { employeeId: "JIIT048", name: "Dr. Usha Rani",              password: "Admin@2026" },
  { employeeId: "JIIT049", name: "Prof. Santosh Kumar",        password: "Admin@2026" },
  { employeeId: "JIIT050", name: "Dr. Geeta Tiwari",           password: "Admin@2026" },
  { employeeId: "JIIT051", name: "Prof. Ramesh Chandra",       password: "Admin@2026" },
  { employeeId: "JIIT052", name: "Dr. Vibha Singh",            password: "Admin@2026" },
  { employeeId: "JIIT053", name: "Prof. Kiran Bhatia",         password: "Admin@2026" },
  { employeeId: "JIIT054", name: "Dr. Nisha Yadav",            password: "Admin@2026" },
  { employeeId: "JIIT055", name: "Prof. Jagdish Prasad",       password: "Admin@2026" },
  { employeeId: "JIIT056", name: "Dr. Rekha Jain",             password: "Admin@2026" },
  { employeeId: "JIIT057", name: "Prof. Sunil Kapoor",         password: "Admin@2026" },
  { employeeId: "JIIT058", name: "Dr. Manju Lata",             password: "Admin@2026" },
  { employeeId: "JIIT059", name: "Prof. Praveen Sinha",        password: "Admin@2026" },
  { employeeId: "JIIT060", name: "Dr. Sarita Mishra",          password: "Admin@2026" },
  { employeeId: "JIIT061", name: "Prof. Rajan Shukla",         password: "Admin@2026" },
  { employeeId: "JIIT062", name: "Dr. Asha Mathur",            password: "Admin@2026" },
  { employeeId: "JIIT063", name: "Prof. Surendra Nath",        password: "Admin@2026" },
  { employeeId: "JIIT064", name: "Dr. Pratibha Roy",           password: "Admin@2026" },
  { employeeId: "JIIT065", name: "Prof. Devendra Yadav",       password: "Admin@2026" },
  { employeeId: "JIIT066", name: "Dr. Shobha Verma",           password: "Admin@2026" },
  { employeeId: "JIIT067", name: "Prof. Ajay Kumar Singh",     password: "Admin@2026" },
  { employeeId: "JIIT068", name: "Dr. Vandana Gupta",          password: "Admin@2026" },
  { employeeId: "JIIT069", name: "Prof. Rohit Sharma",         password: "Admin@2026" },
  { employeeId: "JIIT070", name: "Dr. Kamla Devi",             password: "Admin@2026" },
  { employeeId: "JIIT071", name: "Prof. Prakash Joshi",        password: "Admin@2026" },
  { employeeId: "JIIT072", name: "Dr. Sunita Kumari",          password: "Admin@2026" },
  { employeeId: "JIIT073", name: "Prof. Harish Chandra",       password: "Admin@2026" },
  { employeeId: "JIIT074", name: "Dr. Lata Pandey",            password: "Admin@2026" },
  { employeeId: "JIIT075", name: "Prof. Brijesh Tiwari",       password: "Admin@2026" },
  { employeeId: "JIIT076", name: "Dr. Swapna Menon",           password: "Admin@2026" },
  { employeeId: "JIIT077", name: "Prof. Shyam Sundar",         password: "Admin@2026" },
  { employeeId: "JIIT078", name: "Dr. Namrata Singh",          password: "Admin@2026" },
  { employeeId: "JIIT079", name: "Prof. Trilok Nath",          password: "Admin@2026" },
  { employeeId: "JIIT080", name: "Dr. Veena Kapoor",           password: "Admin@2026" },
  { employeeId: "JIIT081", name: "Prof. Avinash Kumar",        password: "Admin@2026" },
  { employeeId: "JIIT082", name: "Dr. Seema Dixit",            password: "Admin@2026" },
  { employeeId: "JIIT083", name: "Prof. Ganesh Prasad",        password: "Admin@2026" },
  { employeeId: "JIIT084", name: "Dr. Bharti Saxena",          password: "Admin@2026" },
  { employeeId: "JIIT085", name: "Prof. Vikas Mishra",         password: "Admin@2026" },
  { employeeId: "JIIT086", name: "Dr. Jyoti Rani",             password: "Admin@2026" },
  { employeeId: "JIIT087", name: "Prof. Mahendra Singh",       password: "Admin@2026" },
  { employeeId: "JIIT088", name: "Dr. Puja Agarwal",           password: "Admin@2026" },
  { employeeId: "JIIT089", name: "Prof. Satish Chandra",       password: "Admin@2026" },
  { employeeId: "JIIT090", name: "Dr. Renu Bhatia",            password: "Admin@2026" },
  { employeeId: "JIIT091", name: "Prof. Dinesh Chandra",       password: "Admin@2026" },
  { employeeId: "JIIT092", name: "Dr. Alka Yadav",             password: "Admin@2026" },
  { employeeId: "JIIT093", name: "Prof. Rajendra Prasad",      password: "Admin@2026" },
  { employeeId: "JIIT094", name: "Dr. Savita Kumari",          password: "Admin@2026" },
  { employeeId: "JIIT095", name: "Prof. Subhash Chand",        password: "Admin@2026" },
  { employeeId: "JIIT096", name: "Dr. Meenakshi Joshi",        password: "Admin@2026" },
  { employeeId: "JIIT097", name: "Prof. Radheshyam Gupta",     password: "Admin@2026" },
  { employeeId: "JIIT098", name: "Dr. Chitra Nair",            password: "Admin@2026" },
  { employeeId: "JIIT099", name: "Prof. Sushil Kumar",         password: "Admin@2026" },
  { employeeId: "JIIT100", name: "Dr. Anita Sharma",           password: "Admin@2026" },
];

// ─── Seed function ───────────────────────────────────────────
async function seed() {
  try {
    // Hash all passwords
    const hashedAdmins = await Promise.all(
      ADMIN_DATA.map(async (admin) => ({
        ...admin,
        password: await bcrypt.hash(admin.password, 10),
      }))
    );

    // Clear existing admins (comment this out if you want to keep existing ones)
    await Admin.deleteMany({});
    console.log("🗑️  Cleared existing admin records");

    // Insert all 100
    await Admin.insertMany(hashedAdmins);
    console.log("✅ Successfully inserted 100 admin entries");
    console.log("─────────────────────────────────────────");
    console.log("📋 Login credentials:");
    console.log("   Employee ID : JIIT001 to JIIT100");
    console.log("   Password    : Admin@2026");
    console.log("─────────────────────────────────────────");
    console.log("⚠️  IMPORTANT: Change passwords after first login!");

  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
  } finally {
    mongoose.connection.close();
    console.log("🔌 MongoDB connection closed");
  }
}

mongoose.connection.once("open", seed);