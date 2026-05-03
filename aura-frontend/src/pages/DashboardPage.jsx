import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AppShell from "../components/AppShell";
import AdminUsersPanel from "../components/AdminUsersPanel";
import ChatPanel from "../components/ChatPanel";
import CourseGrid from "../components/CourseGrid";
import CreateCourseForm from "../components/CreateCourseForm";
import HomeContentPanel from "../components/HomeContentPanel";
import MaterialsPanel from "../components/MaterialsPanel";
import MetricCard from "../components/MetricCard";
import PaymentPanel from "../components/PaymentPanel";
import ProfilePanel from "../components/ProfilePanel";
import ReportPanel from "../components/ReportPanel";
import RoleBadge from "../components/RoleBadge";
import SectionCard from "../components/SectionCard";
import { useAuth } from "../context/AuthContext";
import adminService from "../services/adminService";
import chatbotService from "../services/chatbotService";
import courseService from "../services/courseService";
import dashboardService from "../services/dashboardService";
import materialService from "../services/materialService";
import paymentService from "../services/paymentService";
import reportService from "../services/reportService";
import { extractError } from "../services/api";
import enquiryService from "../services/enquiryService";

const contactHighlights = [
  {
    key: "email",
    label: "Email",
    description: "Reach the AURA support desk for platform, enrollment, or billing help.",
  },
  {
    key: "phone",
    label: "Phone",
    description: "Talk to our team for urgent onboarding, course, or payment assistance.",
  },
  {
    key: "address",
    label: "Address",
    description: "Visit the campus office or use this address for official communication.",
  },
];

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();

  const [activeSection, setActiveSection] = useState("home");
  const [dashboard, setDashboard] = useState(null);
  const [courses, setCourses] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [payments, setPayments] = useState([]);
  const [report, setReport] = useState(null);
  const [adminSummary, setAdminSummary] = useState(null);
  const [users, setUsers] = useState([]);
  const [siteContent, setSiteContent] = useState({});
  const [paymentProvider, setPaymentProvider] = useState("razorpay");
  const [chatHistory, setChatHistory] = useState([]);
  const [chatProvider, setChatProvider] = useState("gemini");
  const [chatTopic, setChatTopic] = useState("coding");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState("");
  const [screenMessage, setScreenMessage] = useState("");
  const [checkoutState, setCheckoutState] = useState(null);
  const [contactForm, setContactForm] = useState({ name: "", phone: "", message: "" });

  const loadWorkspace = useCallback(async () => {
    try {
      const baseRequests = [
        dashboardService.overview(),
        courseService.list(),
        materialService.list(),
        paymentService.history(),
        adminService.getSiteContent(),
        chatbotService.history(),
      ];

      if (user?.role === "admin") {
        baseRequests.push(reportService.summary());
      }

      const responses = await Promise.all(baseRequests);
      const [overviewRes, coursesRes, materialsRes, paymentsRes, siteRes, chatRes, reportRes] = responses;

      setDashboard(overviewRes);
      setCourses(coursesRes.courses || []);
      setMaterials(materialsRes.materials || []);
      setPayments(paymentsRes.payments || []);
      setSiteContent(siteRes.content || {});
      setChatHistory(chatRes.history || []);
      setReport(user?.role === "admin" ? reportRes?.report || null : null);

      if (user.role === "admin") {
        const [adminRes, usersRes] = await Promise.all([adminService.summary(), adminService.users()]);
        setAdminSummary(adminRes.summary);
        setUsers(usersRes.users || []);
      } else {
        setAdminSummary(null);
        setUsers([]);
      }

      setScreenMessage("");
    } catch (error) {
      setScreenMessage(extractError(error));
    }
  }, [user?.role]);

  useEffect(() => {
    if (activeSection === "reports" && user?.role !== "admin") {
      setActiveSection("home");
    }
  }, [activeSection, user?.role]);

  useEffect(() => {
    if (user) {
      loadWorkspace();
    }
  }, [user, loadWorkspace]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleCreateCourse = async (payload) => {
    try {
      await courseService.create(payload);
      setScreenMessage("Course created successfully.");
      await loadWorkspace();
    } catch (error) {
      setScreenMessage(extractError(error));
    }
  };

  const handleCreateMaterial = async (payload) => {
    try {
      await materialService.create(payload);
      setScreenMessage("Material published successfully.");
      await loadWorkspace();
    } catch (error) {
      setScreenMessage(extractError(error));
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      await courseService.enroll(courseId);
      setScreenMessage("Enrollment completed.");
      await loadWorkspace();
    } catch (error) {
      setScreenMessage(extractError(error));
    }
  };

  const handleCheckout = async (courseId) => {
    try {
      const response = await paymentService.checkout(courseId, paymentProvider);
      setCheckoutState(response);
      setScreenMessage("Checkout created. Complete payment from the panel.");
      await loadWorkspace();
    } catch (error) {
      setScreenMessage(extractError(error));
    }
  };

  const handleVerifyDemoPayment = async () => {
    if (!checkoutState?.paymentId) {
      return;
    }

    try {
      await paymentService.verify({
        paymentId: checkoutState.paymentId,
        transactionId: `txn_demo_${Date.now()}`,
        status: "paid",
      });
      setScreenMessage("Payment marked as paid.");
      setCheckoutState(null);
      await loadWorkspace();
    } catch (error) {
      setScreenMessage(extractError(error));
    }
  };

  const handleSendPrompt = async ({ prompt, provider, topic }) => {
    setChatLoading(true);
    setChatError("");

    try {
      await chatbotService.send({ prompt, provider, topic });
      setChatProvider(provider);
      setChatTopic(topic);
      const historyRes = await chatbotService.history();
      setChatHistory(historyRes.history || []);
      return true;
    } catch (error) {
      setChatError(extractError(error));
      return false;
    } finally {
      setChatLoading(false);
    }
  };

  const handleProfileSave = async (payload) => {
    try {
      await updateProfile(payload);
      setScreenMessage("Profile updated.");
    } catch (error) {
      setScreenMessage(extractError(error));
    }
  };

  const handleSiteContentSave = async (payload) => {
    try {
      const response = await adminService.updateSiteContent(payload);
      setSiteContent(response.content);
      setScreenMessage("Homepage content updated.");
    } catch (error) {
      setScreenMessage(extractError(error));
    }
  };

  const handleUserUpdate = async (id, payload) => {
    try {
      await adminService.updateUser(id, payload);
      setScreenMessage("User updated.");
      await loadWorkspace();
    } catch (error) {
      setScreenMessage(extractError(error));
    }
  };

  const handleUserDelete = async (id) => {
    try {
      await adminService.deleteUser(id);
      setScreenMessage("User deleted.");
      await loadWorkspace();
    } catch (error) {
      setScreenMessage(extractError(error));
    }
  };

  const handleEnquirySubmit = async (event) => {
    event.preventDefault();

    try {
      await enquiryService.create(contactForm);
      setScreenMessage("Enquiry submitted successfully.");
      setContactForm({ name: "", phone: "", message: "" });
    } catch (error) {
      setScreenMessage(extractError(error));
    }
  };

  const renderOverview = () => (
    <>
      <section className="glass-panel p-6 md:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-aura-gold">Hybrid premium theme</p>
            <h1 className="mt-3 font-display text-4xl text-white md:text-5xl">
              {dashboard?.overview?.hero?.title || "AURA dashboard"}
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
              {dashboard?.overview?.hero?.subtitle ||
                "Your learning, operations, and growth systems now live in one polished workspace."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <RoleBadge role={user.role} />
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
              {user.email}
            </div>
          </div>
        </div>

        {screenMessage ? (
          <div className="mt-6 rounded-[20px] border border-aura-teal/20 bg-aura-teal/10 px-4 py-3 text-sm text-teal-50">
            {screenMessage}
          </div>
        ) : null}

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {(dashboard?.overview?.metrics || []).map((metric) => (
            <MetricCard key={metric.label} label={metric.label} value={metric.value} />
          ))}
        </div>
      </section>

      {user.role === "admin" && adminSummary ? (
        <SectionCard
          title="Secure Admin Controls"
          eyebrow="Admin"
          description="Keep high-signal visibility on user roles, platform health, and revenue."
        >
          <div className="grid gap-4 xl:grid-cols-[0.7fr_0.7fr_1fr]">
            <MetricCard label="Admins" value={adminSummary.usersByRole.admin} accent="text-aura-coral" />
            <MetricCard label="Students" value={adminSummary.usersByRole.student} accent="text-aura-teal" />
            <MetricCard label="Staff" value={adminSummary.usersByRole.staff} accent="text-aura-sand" />
          </div>
        </SectionCard>
      ) : null}
    </>
  );

  if (!user) {
    return null;
  }

  return (
    <AppShell user={user} onLogout={handleLogout} activeSection={activeSection} onNavigate={setActiveSection}>
      {activeSection === "home" ? (
        <HomeContentPanel
          content={siteContent}
          canEdit={user.role === "admin"}
          onSave={handleSiteContentSave}
        />
      ) : null}

      {activeSection === "dashboard" ? renderOverview() : null}

      {activeSection === "courses" ? (
        <SectionCard
          title="Courses"
          eyebrow="Courses"
          description="Browse premium tracks, enroll, and manage course inventory."
        >
          {user.role === "student" ? (
            <CourseGrid
              courses={courses}
              role={user.role}
              onEnroll={handleEnroll}
              onCheckout={handleCheckout}
              paymentProvider={paymentProvider}
            />
          ) : (
            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <CourseGrid
                courses={courses}
                role={user.role}
                onEnroll={handleEnroll}
                onCheckout={handleCheckout}
                paymentProvider={paymentProvider}
              />
              <CreateCourseForm onCreate={handleCreateCourse} statusMessage={screenMessage} />
            </div>
          )}
        </SectionCard>
      ) : null}

      {activeSection === "materials" ? (
        <SectionCard
          title="Materials"
          eyebrow="Materials"
          description="Videos, uploaded links, documents, and learning assets."
        >
          <MaterialsPanel
            materials={materials}
            courses={courses}
            canManage={user.role !== "student"}
            onCreate={handleCreateMaterial}
            statusMessage={screenMessage}
          />
        </SectionCard>
      ) : null}

      {activeSection === "payments" ? (
        <SectionCard
          title="Payments"
          eyebrow="Billing"
          description="Course checkout, auto receipts, and payment history."
        >
          <PaymentPanel
            payments={payments}
            checkoutState={checkoutState}
            paymentProvider={paymentProvider}
            onProviderChange={setPaymentProvider}
            onVerifyDemo={handleVerifyDemoPayment}
          />
        </SectionCard>
      ) : null}

      {activeSection === "assistant" ? (
        <SectionCard
          title="AURA AI Assistant"
          eyebrow="Assistant"
          description="Answer coding questions, resume tips, interview questions, course guidance, and support FAQs with MongoDB-backed history."
        >
          <ChatPanel
            history={chatHistory}
            onSend={handleSendPrompt}
            loading={chatLoading}
            provider={chatProvider}
            topic={chatTopic}
            onProviderChange={setChatProvider}
            onTopicChange={setChatTopic}
            error={chatError}
          />
        </SectionCard>
      ) : null}

      {activeSection === "reports" && user.role === "admin" ? (
        <SectionCard
          title="Reports"
          eyebrow="Reports"
          description="Generate platform reports and export them to PDF."
        >
          <ReportPanel report={report} />
        </SectionCard>
      ) : null}

      {activeSection === "about" ? (
        <SectionCard title={siteContent.aboutHeadline || "About Us"} eyebrow="About">
          <div className="glass-panel p-6">
            <p className="text-sm leading-8 text-slate-300">{siteContent.aboutText}</p>
          </div>
        </SectionCard>
      ) : null}

      {activeSection === "contact" ? (
        <SectionCard
          title="Contact"
          eyebrow="Contact"
          description="Connect with the AURA team for admissions, support, billing, and campus enquiries."
        >
          <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="grid gap-4">
              {contactHighlights.map((item) => {
                const value =
                  item.key === "email"
                    ? siteContent.contactEmail || "support@aura.dev"
                    : item.key === "phone"
                      ? siteContent.contactPhone || "+91 90000 00000"
                      : siteContent.contactAddress || "AURA Campus, Bengaluru";

                const href =
                  item.key === "email"
                    ? `mailto:${value}`
                    : item.key === "phone"
                      ? `tel:${String(value).replace(/\s+/g, "")}`
                      : null;

                return (
                  <div key={item.key} className="glass-panel p-5 md:p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-aura-gold">{item.label}</p>
                    {href ? (
                      <a
                        href={href}
                        className="mt-4 block break-words font-display text-2xl leading-tight text-white transition hover:text-aura-sand"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="mt-4 break-words font-display text-2xl leading-tight text-white">{value}</p>
                    )}
                    <p className="mt-3 max-w-md text-sm leading-7 text-slate-300">{item.description}</p>
                  </div>
                );
              })}
            </div>
            <form onSubmit={handleEnquirySubmit} className="glass-panel p-6 md:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-aura-gold">Enquiry form</p>
              <h3 className="mt-3 font-display text-3xl text-white">Send enquiry</h3>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                Share what you need and the AURA team can respond on courses, fees, onboarding, or platform support.
              </p>
              <div className="mt-6 space-y-4">
                <input
                  value={contactForm.name}
                  onChange={(event) => setContactForm((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Your name"
                  className="field-shell w-full"
                  required
                />
                <input
                  value={contactForm.phone}
                  onChange={(event) => setContactForm((current) => ({ ...current, phone: event.target.value }))}
                  placeholder="Phone"
                  className="field-shell w-full"
                  required
                />
                <textarea
                  value={contactForm.message}
                  onChange={(event) => setContactForm((current) => ({ ...current, message: event.target.value }))}
                  rows="5"
                  placeholder="Tell us how we can help"
                  className="field-shell w-full"
                  required
                />
                <button type="submit" className="primary-button">
                  Submit enquiry
                </button>
              </div>
            </form>
          </div>
        </SectionCard>
      ) : null}

      {activeSection === "profile" ? (
        <SectionCard title="Profile" eyebrow="Account" description="Upload your profile photo and manage account details.">
          <ProfilePanel user={user} onSave={handleProfileSave} message={screenMessage} />
        </SectionCard>
      ) : null}

      {activeSection === "users" && user.role === "admin" ? (
        <SectionCard title="Users" eyebrow="Admin" description="Manage students and staff directly from the platform database.">
          <AdminUsersPanel users={users} onUpdate={handleUserUpdate} onDelete={handleUserDelete} />
        </SectionCard>
      ) : null}
    </AppShell>
  );
};

export default DashboardPage;
