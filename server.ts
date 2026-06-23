import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { DatabaseService, User, Order } from "./server/db.js";
import { generateReadmeAi } from "./server/gemini.js";

const app = express();
const PORT = 3000;

// Shared active simulated sessions (simulates simple robust session storage)
let activeSession: User | null = null;

app.use(express.json());

// API: Check current session
app.get("/api/session", (req, res) => {
  res.json({ user: activeSession });
});

// API: Simulates complete Github Auth
app.post("/api/auth/github/simulate", async (req, res) => {
  const { username, displayName, email, password } = req.body;
  if (!username) {
    res.status(400).json({ error: "Username is required" });
    return;
  }

  const db = DatabaseService.getInstance();
  const userId = "github_" + username.toLowerCase().replace(/[^a-z0-9]/g, "");
  
  // Set default email or generate nicely
  const targetEmail = (email || `${username}@github.com`).trim().toLowerCase();
  const isTargetAdmin = targetEmail === "vivekkumarpatar2007@gmail.com";

  if (isTargetAdmin) {
    if (password !== "7250011238a@vivek@a") {
      res.status(401).json({ error: "Access Denied: Administrative password is incorrect or missing." });
      return;
    }
  }

  const userObj: User = {
    id: userId,
    username,
    displayName: displayName || username,
    avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
    email: targetEmail,
    isAdmin: isTargetAdmin,
    createdAt: new Date().toISOString(),
  };

  await db.saveUser(userObj);
  activeSession = userObj;

  res.json({ success: true, user: userObj });
});

app.post("/api/auth/logout", (req, res) => {
  activeSession = null;
  res.json({ success: true });
});

// API: Get user orders
app.get("/api/orders", async (req, res) => {
  if (!activeSession) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  const db = DatabaseService.getInstance();
  const orders = await db.getOrders(activeSession.id);
  res.json(orders);
});

// API: Create new order (Form step)
app.post("/api/orders/create", async (req, res) => {
  const { userData, plan, theme } = req.body;
  if (!userData || !plan || !theme) {
    res.status(400).json({ error: "Missing required order metadata (userData, plan, theme)" });
    return;
  }

  const db = DatabaseService.getInstance();
  const orderId = "order_" + Math.random().toString(36).substring(2, 10);
  const amount = 0;

  // Retrieve user id and metadata from session or guest details
  const userId = activeSession ? activeSession.id : "guest_" + (userData.githubUsername || "user").toLowerCase();
  const username = activeSession ? activeSession.username : (userData.githubUsername || "guest_user");
  const customerName = activeSession ? activeSession.displayName : (userData.name || "Guest Developer");
  const customerEmail = activeSession ? activeSession.email : "guest@readmeforge.com";

  let orderObj: Order = {
    id: orderId,
    userId,
    username,
    plan,
    amount,
    status: "PAID",
    cashfreeOrderId: "",
    readmeData: userData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Generate README immediately (no payment required)
  try {
    const markdown = await generateReadmeAi(userData, theme || "Minimal", plan || "Premium");
    orderObj.generatedReadme = markdown;
    await db.saveOrder(orderObj);

    res.json({
      success: true,
      order: orderObj,
      paymentLink: "",
      isMock: false
    });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to generate README: " + err.message });
  }
});

// API: Verify particular order (Redirect handle)
app.post("/api/orders/verify", async (req, res) => {
  const { orderId } = req.body;
  if (!orderId) {
    res.status(400).json({ error: "Order ID is required" });
    return;
  }

  const db = DatabaseService.getInstance();
  const orderObj = await db.getOrder(orderId);
  if (!orderObj) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  // No payment verification needed - order is always paid
  res.json({ success: true, order: orderObj });
});

// API: Instant Pro Local preview for instant live feedback!
app.post("/api/readme/generate-preview", async (req, res) => {
  const { userData, theme, plan } = req.body;
  if (!userData) {
    res.status(400).json({ error: "userData is required" });
    return;
  }

  try {
    const backupMarkdown = await generateReadmeAi(userData, theme || "Minimal", plan || "Pro");
    res.json({ markdown: backupMarkdown });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to compile visual markdown preview: " + err.message });
  }
});

// API: Admin authentication login with password
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;
  if (password === "7250011238a@vivek@a") {
    const userObj: User = {
      id: "github_vivekkumarpatar",
      username: "vivekkumarpatar",
      displayName: "Vivek Kumar",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=vivekkumarpatar",
      email: "vivekkumarpatar2007@gmail.com",
      isAdmin: true,
      createdAt: new Date().toISOString(),
    };
    activeSession = userObj;
    res.json({ success: true, user: userObj });
  } else {
    res.status(401).json({ error: "Access Denied: Incorrect administrative password." });
  }
});

// API: Admin Panel dashboard endpoint
app.get("/api/admin/stats", async (req, res) => {
  if (!activeSession || !activeSession.isAdmin) {
    res.status(403).json({ error: "Admin privilege required" });
    return;
  }

  const db = DatabaseService.getInstance();
  const users = await db.getUsers();
  const orders = await db.getOrders();
  const payments = await db.getPayments();

  // Calculations
  const totalUsers = users.length;
  const totalOrders = orders.length;
  const paidOrders = orders.filter(o => o.status === "PAID").length;
  
  const revenueObj = payments.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  res.json({
    totalUsers,
    totalOrders,
    paidOrders,
    revenue: revenueObj,
    recentPayments: payments.slice(-15).reverse(),
    recentOrders: orders.slice(-15).reverse(),
    cashfreeStatus: "disabled",
  });
});

// Admin API: Refund management simulator
app.post("/api/admin/refund", async (req, res) => {
  if (!activeSession || !activeSession.isAdmin) {
    res.status(403).json({ error: "Admin privilege required" });
    return;
  }

  const { orderId } = req.body;
  if (!orderId) {
    res.status(400).json({ error: "orderId is required" });
    return;
  }

  const db = DatabaseService.getInstance();
  const orderObj = await db.getOrder(orderId);
  if (!orderObj) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  orderObj.status = "REFUNDED";
  orderObj.updatedAt = new Date().toISOString();
  await db.saveOrder(orderObj);

  res.json({ success: true, order: orderObj });
});

// Setup dev and production express router middleware serving
async function startServer() {
  // Proactively run database schema initialization on startup
  try {
    const db = DatabaseService.getInstance();
    await db.ensureInitialized();
    console.log("🚀 Database tables generated/verified on startup successfully!");
  } catch (dbError) {
    console.error("❌ Pre-startup database initialization failed:", dbError);
  }

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`READMEForge ready and listening at http://0.0.0.0:${PORT}`);
  });
}

startServer();
