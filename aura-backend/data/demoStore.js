const bcrypt = require("bcryptjs");

const demoPassword = "Aura@123";

const demoUsers = [
  {
    id: "usr_admin_1",
    name: "AURA Admin",
    email: "admin@aura.dev",
    password: bcrypt.hashSync(demoPassword, 10),
    role: "admin",
    phone: "+91 9876543210",
    avatar: "",
    bio: "Platform owner and academic operations lead.",
    createdAt: new Date("2026-01-05").toISOString(),
  },
  {
    id: "usr_student_1",
    name: "Riya Sharma",
    email: "student@aura.dev",
    password: bcrypt.hashSync(demoPassword, 10),
    role: "student",
    phone: "+91 9012345678",
    avatar: "",
    bio: "Focused on product engineering and interview preparation.",
    createdAt: new Date("2026-02-10").toISOString(),
  },
  {
    id: "usr_staff_1",
    name: "Arjun Rao",
    email: "staff@aura.dev",
    password: bcrypt.hashSync(demoPassword, 10),
    role: "staff",
    staffId: "AURA-STF-102",
    phone: "+91 9988776655",
    avatar: "",
    bio: "Mentor for AI, mock interviews, and student success.",
    createdAt: new Date("2026-02-18").toISOString(),
  },
];

const demoCourses = [
  {
    id: "course_1",
    title: "Full Stack Launchpad",
    description: "React, Node, MongoDB, and deployment workflows in one guided track.",
    price: 7999,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    duration: "12 weeks",
    status: "published",
    enrolledCount: 148,
  },
  {
    id: "course_2",
    title: "AI Builder Pro",
    description: "Prompt engineering, automation, and product-grade AI integrations.",
    price: 9999,
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
    duration: "10 weeks",
    status: "published",
    enrolledCount: 94,
  },
  {
    id: "course_3",
    title: "Campus to Career",
    description: "Resume, interview, and placement preparation for students.",
    price: 4999,
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
    duration: "6 weeks",
    status: "draft",
    enrolledCount: 67,
  },
];

const demoEnrollments = [
  {
    id: "enroll_1",
    userId: "usr_student_1",
    courseId: "course_1",
    paymentStatus: "paid",
  },
  {
    id: "enroll_2",
    userId: "usr_student_1",
    courseId: "course_2",
    paymentStatus: "pending",
  },
];

const demoPayments = [
  {
    id: "pay_1",
    userId: "usr_student_1",
    courseId: "course_1",
    amount: 7999,
    method: "razorpay",
    receipt: "receipt_demo_1",
    status: "paid",
    orderId: "order_demo_1",
    transactionId: "txn_demo_1",
    paidAt: new Date("2026-03-01").toISOString(),
  },
];

const demoMaterials = [
  {
    id: "mat_1",
    courseId: "course_1",
    title: "React State Masterclass",
    type: "video",
    url: "https://example.com/react-state-masterclass",
    isPreview: true,
    description: "A premium walkthrough of state architecture and data flow.",
    uploadedBy: "usr_staff_1",
    tags: ["react", "frontend"],
  },
  {
    id: "mat_2",
    courseId: "course_2",
    title: "AI Prompt Blueprints",
    type: "document",
    url: "https://example.com/ai-prompt-blueprints",
    isPreview: false,
    description: "Reusable prompt systems for support, education, and product teams.",
    uploadedBy: "usr_staff_1",
    tags: ["ai", "prompts"],
  },
];

const demoChatbotLogs = [];

const demoNotifications = [
  {
    id: "note_1",
    userId: "usr_student_1",
    title: "Live workshop reminder",
    message: "Full Stack Launchpad live mentoring starts today at 7:30 PM.",
    type: "info",
    isRead: false,
    link: "/dashboard",
  },
];

const demoSiteContent = {
  key: "main",
  homeTitle: "AURA builds confident learners and sharp teams.",
  homeSubtitle:
    "Premium learning journeys with live mentorship, practical materials, AI assistance, and admin-grade control.",
  homeImage:
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
  aboutHeadline: "About AURA",
  aboutText:
    "AURA is a modern academy platform for students, mentors, and admins to manage learning, content, payments, and support from one workspace.",
  contactEmail: "support@aura.dev",
  contactPhone: "+91 90000 00000",
  contactAddress: "AURA Campus, Bengaluru",
};

const generateId = (prefix) =>
  `${prefix}_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;

module.exports = {
  demoPassword,
  demoUsers,
  demoCourses,
  demoEnrollments,
  demoPayments,
  demoMaterials,
  demoChatbotLogs,
  demoNotifications,
  demoSiteContent,
  generateId,
};
