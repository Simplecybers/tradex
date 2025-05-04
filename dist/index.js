var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { Pool as Pool2 } from "pg";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  contents: () => contents,
  insertContentSchema: () => insertContentSchema,
  insertKycSchema: () => insertKycSchema,
  insertPortfolioSchema: () => insertPortfolioSchema,
  insertSettingSchema: () => insertSettingSchema,
  insertTransactionSchema: () => insertTransactionSchema,
  insertUserSchema: () => insertUserSchema,
  insertWalletSchema: () => insertWalletSchema,
  insertWatchlistSchema: () => insertWatchlistSchema,
  kyc: () => kyc,
  portfolio: () => portfolio,
  settings: () => settings,
  transactions: () => transactions,
  users: () => users,
  wallets: () => wallets,
  watchlist: () => watchlist
});
import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  real,
  serial,
  varchar
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import "dotenv/config";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  // Use serial for auto-incrementing primary keys
  username: varchar("username", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  isVerified: boolean("is_verified").default(false).notNull(),
  isEmailVerified: boolean("is_email_verified").default(false).notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  verificationToken: text("verification_token"),
  verificationTokenExpiry: timestamp("verification_token_expiry"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  firstName: true,
  lastName: true
}).extend({
  verificationToken: z.string().optional()
});
var kyc = pgTable("kyc", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  documentType: text("document_type").notNull(),
  documentId: text("document_id").notNull(),
  documentPath: text("document_path"),
  status: text("status").notNull().default("pending"),
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var insertKycSchema = createInsertSchema(kyc).pick({
  userId: true,
  documentType: true,
  documentId: true,
  documentPath: true
});
var wallets = pgTable("wallets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  balance: real("balance").notNull().default(0),
  currency: text("currency").notNull().default("USD"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertWalletSchema = createInsertSchema(wallets).pick({
  userId: true,
  currency: true
});
var transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(),
  // deposit, withdrawal, buy, sell
  amount: real("amount").notNull(),
  currency: text("currency").notNull().default("USD"),
  status: text("status").notNull().default("pending"),
  // pending, completed, rejected
  assetSymbol: text("asset_symbol"),
  assetType: text("asset_type"),
  // stock, crypto, etc.
  leverage: real("leverage"),
  duration: integer("duration").notNull().default(1),
  takeProfit: real("take_profit"),
  stopLoss: real("stop_loss"),
  margin: real("margin"),
  orderType: text("order_type"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertTransactionSchema = createInsertSchema(transactions).pick({
  userId: true,
  type: true,
  amount: true,
  currency: true,
  assetSymbol: true,
  assetType: true,
  leverage: true,
  duration: true,
  takeProfit: true,
  stopLoss: true,
  margin: true,
  orderType: true
});
var portfolio = pgTable("portfolio", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  assetSymbol: text("asset_symbol").notNull(),
  assetType: text("asset_type").notNull(),
  // stock, crypto, etc.
  quantity: real("quantity").notNull(),
  averagePrice: real("average_price").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var insertPortfolioSchema = createInsertSchema(portfolio).pick({
  userId: true,
  assetSymbol: true,
  assetType: true,
  quantity: true,
  averagePrice: true
});
var watchlist = pgTable("watchlist", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  assetSymbol: text("asset_symbol").notNull(),
  assetName: text("asset_name").notNull(),
  assetType: text("asset_type").notNull(),
  // stock, crypto, etc.
  exchange: text("exchange"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertWatchlistSchema = createInsertSchema(watchlist).pick({
  userId: true,
  assetSymbol: true,
  assetName: true,
  assetType: true,
  exchange: true
});
var contents = pgTable("contents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  type: text("type").notNull(),
  // page, post, etc.
  isPublished: boolean("is_published").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var insertContentSchema = createInsertSchema(contents).pick({
  title: true,
  slug: true,
  content: true,
  type: true,
  isPublished: true
});
var settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  type: text("type").notNull(),
  // system, user, etc.
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var insertSettingSchema = createInsertSchema(settings).pick({
  key: true,
  value: true,
  type: true
});

// server/db.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import "dotenv/config";
var pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || "5432"),
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 5e3,
  max: 20,
  idleTimeoutMillis: 3e4,
  keepAlive: true,
  keepAliveInitialDelayMillis: 1e4
});
var db = drizzle(pool, { schema: schema_exports });
console.log("\u2705 Database connection established with schema");

// server/storage.ts
import { eq } from "drizzle-orm";
var pool2 = new Pool2({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 5432
  // Default PostgreSQL port
});
var DatabaseStorage = class {
  async getUser(id) {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user || void 0;
    } catch (error) {
      console.error("Database error:", error);
      return void 0;
    }
  }
  async getUserByUsername(username) {
    try {
      const [user] = await db.select().from(users).where(eq(users.username, username));
      return user || void 0;
    } catch (error) {
      console.error("Database error:", error);
      return void 0;
    }
  }
  async getUserByEmail(email) {
    try {
      const [user] = await db.select().from(users).where(eq(users.email, email));
      return user || void 0;
    } catch (error) {
      console.error("Database error:", error);
      return void 0;
    }
  }
  async createUser(insertUser) {
    try {
      const userData = {
        ...insertUser,
        isVerified: false,
        isEmailVerified: false,
        isAdmin: false,
        createdAt: /* @__PURE__ */ new Date()
      };
      const [user] = await db.insert(users).values(userData).returning();
      return user;
    } catch (error) {
      console.error("Database error:", error);
      throw error;
    }
  }
  async updateUser(id, userData) {
    try {
      const [updatedUser] = await db.update(users).set(userData).where(eq(users.id, id)).returning();
      return updatedUser || void 0;
    } catch (error) {
      console.error("Database error:", error);
      return void 0;
    }
  }
  async updateUserVerification(email, token, expiry) {
    try {
      const [updatedUser] = await db.update(users).set({
        verificationToken: token,
        verificationTokenExpiry: expiry
      }).where(eq(users.email, email)).returning();
      return updatedUser || void 0;
    } catch (error) {
      console.error("Database error:", error);
      return void 0;
    }
  }
  async verifyEmail(token) {
    try {
      const [user] = await db.select().from(users).where(eq(users.verificationToken, token));
      if (!user) {
        return void 0;
      }
      if (user.verificationTokenExpiry && new Date(user.verificationTokenExpiry) < /* @__PURE__ */ new Date()) {
        return void 0;
      }
      const [updatedUser] = await db.update(users).set({
        isEmailVerified: true,
        verificationToken: null,
        verificationTokenExpiry: null
      }).where(eq(users.id, user.id)).returning();
      return updatedUser || void 0;
    } catch (error) {
      console.error("Database error:", error);
      return void 0;
    }
  }
  async getKYCByUserId(userId) {
    try {
      const [kycRecord] = await db.select().from(kyc).where(eq(kyc.userId, userId));
      return kycRecord || void 0;
    } catch (error) {
      console.error("Database error:", error);
      return void 0;
    }
  }
  async createKYC(data) {
    try {
      const [newKYC] = await db.insert(kyc).values(data).returning();
      return newKYC;
    } catch (error) {
      console.error("Database error:", error);
      throw error;
    }
  }
  async getKYC(id) {
    try {
      const [kycRecord] = await db.select().from(kyc).where(eq(kyc.id, id));
      return kycRecord || void 0;
    } catch (error) {
      console.error("Database error:", error);
      return void 0;
    }
  }
  async updateKYC(id, data) {
    try {
      const [updatedKYC] = await db.update(kyc).set(data).where(eq(kyc.id, id)).returning();
      return updatedKYC || void 0;
    } catch (error) {
      console.error("Database error:", error);
      return void 0;
    }
  }
  async getAllPendingKYCs() {
    try {
      return db.select().from(kyc).where(eq(kyc.status, "pending"));
    } catch (error) {
      console.error("Database error:", error);
      return [];
    }
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import bcrypt from "bcryptjs";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import multer from "multer";
import path3 from "path";
import { fileURLToPath as fileURLToPath3 } from "url";
import { dirname as dirname3 } from "path";
import fs2 from "fs";

// server/services/email.ts
import nodemailer from "nodemailer";

// server/vite.ts
import express from "express";
import fs from "fs";
import path2, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(__dirname2, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/services/sendgrid.ts
import { MailService } from "@sendgrid/mail";
var mailService = new MailService();
var sendgridApiKey = process.env.SENDGRID_API_KEY;
var sendgridEnabled = false;
if (sendgridApiKey) {
  mailService.setApiKey(sendgridApiKey);
  sendgridEnabled = true;
  log("SendGrid email service initialized", "email");
} else {
  log("SendGrid API key not found, emails will be logged but not sent", "email");
}
async function sendGridEmail(params) {
  try {
    if (!sendgridEnabled) {
      log(`[SENDGRID MOCK] Email would be sent to: ${params.to}`, "email");
      log(`[SENDGRID MOCK] From: ${params.from}`, "email");
      log(`[SENDGRID MOCK] Subject: ${params.subject}`, "email");
      log(`[SENDGRID MOCK] Content: ${params.text || params.html || ""}`, "email");
      return true;
    }
    await mailService.send({
      to: params.to,
      from: params.from,
      subject: params.subject,
      text: params.text || "",
      html: params.html || ""
    });
    log(`Email sent via SendGrid to: ${params.to}`, "email");
    return true;
  } catch (error) {
    log(`SendGrid error: ${error.message}`, "email");
    log(`[SENDGRID FALLBACK] Email would be sent to: ${params.to}`, "email");
    log(`[SENDGRID FALLBACK] Subject: ${params.subject}`, "email");
    log(`[SENDGRID FALLBACK] Content: ${params.text || params.html || ""}`, "email");
    return true;
  }
}
function isSendGridEnabled() {
  return sendgridEnabled;
}

// server/services/email.ts
var defaultSender = process.env.EMAIL_FROM || "TradeXCapital <noreply@tradexcapital.com>";
var transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER || "noreply@tradexcapital.com",
    pass: process.env.EMAIL_PASSWORD || "password"
  }
});
transporter.verify(function(error) {
  if (error) {
    log(`Nodemailer email service error: ${error.message}`, "email");
    log(
      "Email service will run in development mode (emails will be logged but not sent)",
      "email"
    );
  } else {
    log("Nodemailer email service is ready as fallback", "email");
  }
});
async function sendEmail(options) {
  try {
    if (isSendGridEnabled()) {
      return await sendGridEmail({
        to: options.to,
        from: defaultSender,
        subject: options.subject,
        text: options.text,
        html: options.html
      });
    }
    if (process.env.NODE_ENV !== "development") {
      log(`Email would be sent to: ${options.to}`, "email");
      log(`Subject: ${options.subject}`, "email");
      log(`Content: ${options.text || options.html}`, "email");
      return true;
    }
    const info = await transporter.sendMail({
      from: defaultSender,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html
    });
    log(`Email sent: ${info.messageId}`, "email");
    return true;
  } catch (error) {
    log(`Error sending email: ${error.message}`, "email");
    return false;
  }
}
async function sendVerificationEmail(to, token) {
  const hostUrl = process.env.APP_URL || "http://localhost:5000";
  const verificationUrl = `${hostUrl}/verify-email?token=${token}`;
  console.log("Generated verification URL:", verificationUrl);
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4f46e5;">Verify Your TradeXCapital Account</h2>
      <p>Thank you for registering with TradeXCapital. Please verify your email address by clicking the link below:</p>
      <p style="margin: 20px 0;">
        <a href="${verificationUrl}" style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify My Email</a>
      </p>
      <p>Or copy and paste this URL into your browser:</p>
      <p style="word-break: break-all; color: #4b5563;">${verificationUrl}</p>
      <p>This link will expire in 24 hours.</p>
      <p>If you did not create an account, please ignore this email.</p>
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />
      <p style="font-size: 12px; color: #6b7280;">TradeXCapital, Inc.<br>Do not reply to this email.</p>
    </div>
  `;
  const text2 = `
    Verify Your TradeXCapital Account

    Thank you for registering with TradeXCapital. Please verify your email address by visiting the link below:

    ${verificationUrl}

    This link will expire in 24 hours.

    If you did not create an account, please ignore this email.

    TradeXCapital, Inc.
    Do not reply to this email.
  `;
  return sendEmail({
    to,
    subject: "Verify Your TradeXCapital Account",
    html,
    text: text2
  });
}

// server/services/tokens.ts
import crypto from "crypto";
function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

// server/routes.ts
var __filename3 = fileURLToPath3(import.meta.url);
var __dirname3 = dirname3(__filename3);
var storage_config = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = path3.join(__dirname3, "../uploads");
    if (!fs2.existsSync(uploadDir)) {
      fs2.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path3.extname(file.originalname));
  }
});
var upload = multer({
  storage: storage_config,
  limits: {
    fileSize: 5 * 1024 * 1024
    // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf"
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only JPEG, PNG and PDF files are allowed."
        )
      );
    }
  }
});
async function registerRoutes(app2) {
  app2.use(
    session({
      secret: process.env.SESSION_SECRET || "tradexcapital-secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 24 * 60 * 60 * 1e3
        // 24 hours
      }
    })
  );
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, {
            message: "Incorrect username or password"
          });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return done(null, false, {
            message: "Incorrect username or password"
          });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
  const handleZodErrors = (err, req, res) => {
    if (err instanceof ZodError) {
      const validationError = fromZodError(err);
      return res.status(400).json({
        success: false,
        message: validationError.message,
        errors: err.errors
      });
    }
    return res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error"
    });
  };
  const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({
      success: false,
      message: "Unauthorized - Please login to access this resource"
    });
  };
  const isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user?.isAdmin) {
      return next();
    }
    res.status(403).json({
      success: false,
      message: "Forbidden - Admin access required"
    });
  };
  app2.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Username already exists"
        });
      }
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "Email already exists"
        });
      }
      const verificationToken = generateToken();
      const expiryDate = /* @__PURE__ */ new Date();
      expiryDate.setHours(expiryDate.getHours() + 24);
      userData.verificationToken = verificationToken;
      const user = await storage.createUser(userData);
      await storage.updateUserVerification(user.email, verificationToken, expiryDate);
      console.log("Sending verification email to:", user.email, "with token:", verificationToken);
      await sendVerificationEmail(user.email, verificationToken);
      res.status(201).json({
        success: true,
        message: "User registered successfully. Please verify your email."
      });
    } catch (error) {
      handleZodErrors(error, req, res);
    }
  });
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Incorrect username or password"
        });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Incorrect username or password"
        });
      }
      if (!user.isEmailVerified) {
        return res.status(401).json({
          success: false,
          message: "Please verify your email before logging in"
        });
      }
      const userResponse = { ...user };
      delete userResponse.password;
      delete userResponse.verificationToken;
      req.session.user = userResponse;
      return res.json({
        success: true,
        message: "Login successful",
        user: userResponse
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to login"
      });
    }
  });
  app2.get("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Logout failed"
        });
      }
      res.json({
        success: true,
        message: "Logout successful"
      });
    });
  });
  app2.get("/api/auth/me", isAuthenticated, (req, res) => {
    const userResponse = { ...req.user };
    delete userResponse.password;
    delete userResponse.verificationToken;
    res.json({
      success: true,
      user: userResponse
    });
  });
  app2.post("/api/auth/verify-email", async (req, res) => {
    try {
      const { token } = req.body;
      if (!token) {
        return res.status(400).json({
          success: false,
          message: "Verification token is required"
        });
      }
      console.log("Verifying email with token:", token);
      const user = await storage.verifyEmail(token);
      if (!user) {
        console.log("No user found with token:", token);
        return res.status(400).json({
          success: false,
          message: "Invalid or expired verification token"
        });
      }
      console.log("Email verification successful for user:", user.username);
      res.json({
        success: true,
        message: "Email verification successful"
      });
    } catch (error) {
      console.error("Email verification error:", error);
      res.status(500).json({
        success: false,
        message: "Email verification failed"
      });
    }
  });
  app2.post(
    "/api/kyc",
    isAuthenticated,
    upload.single("document"),
    async (req, res) => {
      try {
        const userId = req.user.id;
        const existingKYC = await storage.getKYCByUserId(userId);
        if (existingKYC) {
          return res.status(400).json({
            success: false,
            message: "KYC already submitted"
          });
        }
        if (!req.file) {
          return res.status(400).json({
            success: false,
            message: "Document file is required"
          });
        }
        const kycData = {
          userId,
          documentType: req.body.documentType,
          documentId: req.body.documentId,
          documentPath: req.file.path
        };
        const kyc2 = await storage.createKYC(kycData);
        res.status(201).json({
          success: true,
          message: "KYC submitted successfully",
          kyc: kyc2
        });
      } catch (error) {
        handleZodErrors(error, req, res);
      }
    }
  );
  app2.get("/api/kyc/status", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const kyc2 = await storage.getKYCByUserId(userId);
      if (!kyc2) {
        return res.status(404).json({
          success: false,
          message: "KYC not found"
        });
      }
      res.json({
        success: true,
        kyc: kyc2
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to get KYC status"
      });
    }
  });
  app2.get("/api/admin/kyc/pending", isAdmin, async (req, res) => {
    try {
      const pendingKYCs = await storage.getAllPendingKYCs();
      res.json({
        success: true,
        kycs: pendingKYCs
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to get pending KYCs"
      });
    }
  });
  app2.put("/api/admin/kyc/:id", isAdmin, async (req, res) => {
    try {
      const kycId = parseInt(req.params.id);
      const { status, rejectionReason } = req.body;
      const kyc2 = await storage.getKYC(kycId);
      if (!kyc2) {
        return res.status(404).json({
          success: false,
          message: "KYC not found"
        });
      }
      const updatedKYC = await storage.updateKYC(kycId, {
        status,
        rejectionReason
      });
      res.json({
        success: true,
        message: `KYC ${status === "approved" ? "approved" : "rejected"} successfully`,
        kyc: updatedKYC
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to update KYC status"
      });
    }
  });
  app2.get("/api/wallet", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const wallet = await storage.getWalletByUserId(userId);
      if (!wallet) {
        return res.status(404).json({
          success: false,
          message: "Wallet not found"
        });
      }
      res.json({
        success: true,
        wallet
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to get wallet"
      });
    }
  });
  app2.post("/api/transactions", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const transactionData = insertTransactionSchema.parse({
        ...req.body,
        userId
      });
      if (transactionData.type === "withdrawal") {
        const user = await storage.getUser(userId);
        if (!user?.isVerified) {
          return res.status(403).json({
            success: false,
            message: "KYC verification required for withdrawals"
          });
        }
        const wallet = await storage.getWalletByUserId(userId);
        if (!wallet || wallet.balance < transactionData.amount) {
          return res.status(400).json({
            success: false,
            message: "Insufficient balance"
          });
        }
      }
      const transaction = await storage.createTransaction(transactionData);
      if (transactionData.type === "deposit") {
        await storage.updateTransaction(transaction.id, {
          status: "completed"
        });
        const wallet = await storage.getWalletByUserId(userId);
        if (wallet) {
          await storage.updateWallet(wallet.id, {
            balance: wallet.balance + transactionData.amount
          });
        }
      }
      res.status(201).json({
        success: true,
        message: "Transaction created successfully",
        transaction
      });
    } catch (error) {
      handleZodErrors(error, req, res);
    }
  });
  app2.get("/api/transactions", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const transactions2 = await storage.getTransactionsByUserId(userId);
      res.json({
        success: true,
        transactions: transactions2
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to get transactions"
      });
    }
  });
  app2.get("/api/admin/transactions/pending", isAdmin, async (req, res) => {
    try {
      const pendingTransactions = await storage.getAllPendingTransactions();
      res.json({
        success: true,
        transactions: pendingTransactions
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to get pending transactions"
      });
    }
  });
  app2.put("/api/admin/transactions/:id", isAdmin, async (req, res) => {
    try {
      const transactionId = parseInt(req.params.id);
      const { status } = req.body;
      const transaction = await storage.getTransaction(transactionId);
      if (!transaction) {
        return res.status(404).json({
          success: false,
          message: "Transaction not found"
        });
      }
      const updatedTransaction = await storage.updateTransaction(
        transactionId,
        { status }
      );
      res.json({
        success: true,
        message: `Transaction ${status === "completed" ? "approved" : "rejected"} successfully`,
        transaction: updatedTransaction
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to update transaction status"
      });
    }
  });
  app2.get("/api/portfolio", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const portfolioItems = await storage.getPortfolioByUserId(userId);
      res.json({
        success: true,
        portfolio: portfolioItems
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to get portfolio"
      });
    }
  });
  app2.post("/api/portfolio", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const portfolioData = insertPortfolioSchema.parse({
        ...req.body,
        userId
      });
      const user = await storage.getUser(userId);
      if (!user?.isVerified) {
        return res.status(403).json({
          success: false,
          message: "KYC verification required for trading"
        });
      }
      const wallet = await storage.getWalletByUserId(userId);
      const totalCost = portfolioData.quantity * portfolioData.averagePrice;
      if (!wallet || wallet.balance < totalCost) {
        return res.status(400).json({
          success: false,
          message: "Insufficient balance"
        });
      }
      const portfolioItem = await storage.createPortfolio(portfolioData);
      await storage.createTransaction({
        userId,
        type: "buy",
        amount: totalCost,
        currency: "USD",
        assetSymbol: portfolioData.assetSymbol,
        assetType: portfolioData.assetType
      });
      await storage.updateWallet(wallet.id, {
        balance: wallet.balance - totalCost
      });
      res.status(201).json({
        success: true,
        message: "Asset purchased successfully",
        portfolio: portfolioItem
      });
    } catch (error) {
      handleZodErrors(error, req, res);
    }
  });
  app2.get("/api/watchlist", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const watchlistItems = await storage.getWatchlistByUserId(userId);
      res.json({
        success: true,
        watchlist: watchlistItems
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to get watchlist"
      });
    }
  });
  app2.post("/api/watchlist", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const watchlistData = insertWatchlistSchema.parse({
        ...req.body,
        userId
      });
      const watchlistItem = await storage.createWatchlist(watchlistData);
      res.status(201).json({
        success: true,
        message: "Asset added to watchlist",
        watchlist: watchlistItem
      });
    } catch (error) {
      handleZodErrors(error, req, res);
    }
  });
  app2.delete("/api/watchlist/:id", isAuthenticated, async (req, res) => {
    try {
      const watchlistId = parseInt(req.params.id);
      await storage.deleteWatchlist(watchlistId);
      res.json({
        success: true,
        message: "Asset removed from watchlist"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to remove asset from watchlist"
      });
    }
  });
  app2.get("/api/admin/users", isAdmin, async (req, res) => {
    try {
      const users2 = await storage.getAllUsers();
      const safeUsers = users2.map((user) => {
        const safeUser = { ...user };
        delete safeUser.password;
        delete safeUser.verificationToken;
        return safeUser;
      });
      res.json({
        success: true,
        users: safeUsers
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to get users"
      });
    }
  });
  app2.post("/api/admin/content", isAdmin, async (req, res) => {
    try {
      const contentData = insertContentSchema.parse(req.body);
      const existingContent = await storage.getContentBySlug(contentData.slug);
      if (existingContent) {
        return res.status(400).json({
          success: false,
          message: "Slug already exists"
        });
      }
      const content = await storage.createContent(contentData);
      res.status(201).json({
        success: true,
        message: "Content created successfully",
        content
      });
    } catch (error) {
      handleZodErrors(error, req, res);
    }
  });
  app2.put("/api/admin/content/:id", isAdmin, async (req, res) => {
    try {
      const contentId = parseInt(req.params.id);
      const content = await storage.getContent(contentId);
      if (!content) {
        return res.status(404).json({
          success: false,
          message: "Content not found"
        });
      }
      const updatedContent = await storage.updateContent(contentId, req.body);
      res.json({
        success: true,
        message: "Content updated successfully",
        content: updatedContent
      });
    } catch (error) {
      handleZodErrors(error, req, res);
    }
  });
  app2.get("/api/admin/content", isAdmin, async (req, res) => {
    try {
      const contents2 = await storage.getAllContents();
      res.json({
        success: true,
        contents: contents2
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to get contents"
      });
    }
  });
  app2.get("/api/content/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const content = await storage.getContentBySlug(slug);
      if (!content || !content.isPublished) {
        return res.status(404).json({
          success: false,
          message: "Content not found"
        });
      }
      res.json({
        success: true,
        content
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to get content"
      });
    }
  });
  app2.post("/api/admin/settings", isAdmin, async (req, res) => {
    try {
      const settingData = insertSettingSchema.parse(req.body);
      const setting = await storage.createOrUpdateSetting(settingData);
      res.status(201).json({
        success: true,
        message: "Setting created/updated successfully",
        setting
      });
    } catch (error) {
      handleZodErrors(error, req, res);
    }
  });
  app2.get("/api/admin/settings", isAdmin, async (req, res) => {
    try {
      const settings2 = await storage.getAllSettings();
      res.json({
        success: true,
        settings: settings2
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to get settings"
      });
    }
  });
  app2.get("/api/settings/:key", async (req, res) => {
    try {
      const { key } = req.params;
      const setting = await storage.getSetting(key);
      if (!setting) {
        return res.status(404).json({
          success: false,
          message: "Setting not found"
        });
      }
      res.json({
        success: true,
        setting
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to get setting"
      });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path4 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path4.startsWith("/api")) {
      let logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "production") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = process.env.PORT || 5e3;
  server.listen(
    {
      port,
      host: "127.0.0.1",
      // Bind to localhost
      reusePort: false
    },
    () => {
      log(`serving on port ${port}`);
    }
  );
})();
