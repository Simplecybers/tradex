import { 
  users, type User, type InsertUser,
  kyc, type KYC, type InsertKYC,
  wallets, type Wallet, type InsertWallet,
  transactions, type Transaction, type InsertTransaction,
  portfolio, type Portfolio, type InsertPortfolio,
  watchlist, type Watchlist, type InsertWatchlist, 
  contents, type Content, type InsertContent,
  settings, type Setting, type InsertSetting
} from "@shared/schema";
import { generateToken } from "./services/tokens";
import bcrypt from "bcryptjs";

import "dotenv/config";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  verifyUserEmail(token: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  
  // KYC operations
  getKYC(id: number): Promise<KYC | undefined>;
  getKYCByUserId(userId: number): Promise<KYC | undefined>;
  createKYC(kyc: InsertKYC): Promise<KYC>;
  updateKYC(id: number, kyc: Partial<KYC>): Promise<KYC | undefined>;
  getAllPendingKYCs(): Promise<KYC[]>;
  
  // Wallet operations
  getWallet(id: number): Promise<Wallet | undefined>;
  getWalletByUserId(userId: number): Promise<Wallet | undefined>;
  createWallet(wallet: InsertWallet): Promise<Wallet>;
  updateWallet(id: number, wallet: Partial<Wallet>): Promise<Wallet | undefined>;
  
  // Transaction operations
  getTransaction(id: number): Promise<Transaction | undefined>;
  getTransactionsByUserId(userId: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: number, transaction: Partial<Transaction>): Promise<Transaction | undefined>;
  getAllPendingTransactions(): Promise<Transaction[]>;
  
  // Portfolio operations
  getPortfolioByUserId(userId: number): Promise<Portfolio[]>;
  createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio>;
  updatePortfolio(id: number, portfolio: Partial<Portfolio>): Promise<Portfolio | undefined>;
  deletePortfolio(id: number): Promise<boolean>;
  
  // Watchlist operations
  getWatchlistByUserId(userId: number): Promise<Watchlist[]>;
  createWatchlist(watchlist: InsertWatchlist): Promise<Watchlist>;
  deleteWatchlist(id: number): Promise<boolean>;
  
  // Content operations
  getContent(id: number): Promise<Content | undefined>;
  getContentBySlug(slug: string): Promise<Content | undefined>;
  getAllContents(): Promise<Content[]>;
  createContent(content: InsertContent): Promise<Content>;
  updateContent(id: number, content: Partial<Content>): Promise<Content | undefined>;
  
  // Settings operations
  getSetting(key: string): Promise<Setting | undefined>;
  getAllSettings(): Promise<Setting[]>;
  createOrUpdateSetting(setting: InsertSetting): Promise<Setting>;
}

export class DatabaseStorage implements IStorage {
  private users: Map<number, User>;
  private kycs: Map<number, KYC>;
  private wallets: Map<number, Wallet>;
  private transactions: Map<number, Transaction>;
  private portfolios: Map<number, Portfolio>;
  private watchlists: Map<number, Watchlist>;
  private contents: Map<number, Content>;
  private settings: Map<number, Setting>;
  
  private currentUserId: number;
  private currentKycId: number;
  private currentWalletId: number;
  private currentTransactionId: number;
  private currentPortfolioId: number;
  private currentWatchlistId: number;
  private currentContentId: number;
  private currentSettingId: number;
  
  constructor() {
    this.users = new Map();
    this.kycs = new Map();
    this.wallets = new Map();
    this.transactions = new Map();
    this.portfolios = new Map();
    this.watchlists = new Map();
    this.contents = new Map();
    this.settings = new Map();
    
    this.currentUserId = 1;
    this.currentKycId = 1;
    this.currentWalletId = 1;
    this.currentTransactionId = 1;
    this.currentPortfolioId = 1;
    this.currentWatchlistId = 1;
    this.currentContentId = 1;
    this.currentSettingId = 1;
    
    // Create admin user
    this.createInitialAdminUser();
  }
  
  private async createInitialAdminUser() {
    const adminUser = {
      username: "admin",
      email: "admin@tradexcapital.com",
      password: await bcrypt.hash("admin123", 10),
      firstName: "Admin",
      lastName: "User",
      isVerified: true,
      isEmailVerified: true,
      isAdmin: true,
      verificationToken: null,
      createdAt: new Date(),
      id: this.currentUserId++
    };
    
    this.users.set(adminUser.id, adminUser);
    
    // Create admin wallet
    const adminWallet = {
      id: this.currentWalletId++,
      userId: adminUser.id,
      balance: 10000,
      currency: "USD",
      createdAt: new Date()
    };
    
    this.wallets.set(adminWallet.id, adminWallet);
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }
  
  async createUser(userData: InsertUser): Promise<User> {
    const verificationToken = generateToken();
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const user: User = {
      id: this.currentUserId++,
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      isVerified: false,
      isEmailVerified: false,
      isAdmin: false,
      verificationToken: verificationToken,
      createdAt: new Date()
    };
    
    this.users.set(user.id, user);
    
    // Create wallet for new user
    const wallet: Wallet = {
      id: this.currentWalletId++,
      userId: user.id,
      balance: 0,
      currency: "USD",
      createdAt: new Date()
    };
    
    this.wallets.set(wallet.id, wallet);
    
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    
    return updatedUser;
  }
  
  async verifyUserEmail(token: string): Promise<User | undefined> {
    const user = Array.from(this.users.values()).find(
      (user) => user.verificationToken === token
    );
    
    if (!user) return undefined;
    
    const updatedUser = { 
      ...user, 
      isEmailVerified: true, 
      verificationToken: null 
    };
    
    this.users.set(user.id, updatedUser);
    
    return updatedUser;
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  // KYC methods
  async getKYC(id: number): Promise<KYC | undefined> {
    return this.kycs.get(id);
  }
  
  async getKYCByUserId(userId: number): Promise<KYC | undefined> {
    return Array.from(this.kycs.values()).find(
      (kyc) => kyc.userId === userId
    );
  }
  
  async createKYC(kycData: InsertKYC): Promise<KYC> {
    const kyc: KYC = {
      id: this.currentKycId++,
      userId: kycData.userId,
      documentType: kycData.documentType,
      documentId: kycData.documentId,
      documentPath: kycData.documentPath || null,
      status: "pending",
      rejectionReason: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.kycs.set(kyc.id, kyc);
    
    return kyc;
  }
  
  async updateKYC(id: number, kycData: Partial<KYC>): Promise<KYC | undefined> {
    const kyc = this.kycs.get(id);
    if (!kyc) return undefined;
    
    const updatedKYC = { 
      ...kyc, 
      ...kycData, 
      updatedAt: new Date() 
    };
    
    this.kycs.set(id, updatedKYC);
    
    // If KYC is approved, update user verification status
    if (kycData.status === "approved") {
      const user = this.users.get(kyc.userId);
      if (user) {
        this.users.set(user.id, { ...user, isVerified: true });
      }
    }
    
    return updatedKYC;
  }
  
  async getAllPendingKYCs(): Promise<KYC[]> {
    return Array.from(this.kycs.values()).filter(
      (kyc) => kyc.status === "pending"
    );
  }
  
  // Wallet methods
  async getWallet(id: number): Promise<Wallet | undefined> {
    return this.wallets.get(id);
  }
  
  async getWalletByUserId(userId: number): Promise<Wallet | undefined> {
    return Array.from(this.wallets.values()).find(
      (wallet) => wallet.userId === userId
    );
  }
  
  async createWallet(walletData: InsertWallet): Promise<Wallet> {
    const wallet: Wallet = {
      id: this.currentWalletId++,
      userId: walletData.userId,
      balance: 0,
      currency: walletData.currency || "USD",
      createdAt: new Date()
    };
    
    this.wallets.set(wallet.id, wallet);
    
    return wallet;
  }
  
  async updateWallet(id: number, walletData: Partial<Wallet>): Promise<Wallet | undefined> {
    const wallet = this.wallets.get(id);
    if (!wallet) return undefined;
    
    const updatedWallet = { ...wallet, ...walletData };
    this.wallets.set(id, updatedWallet);
    
    return updatedWallet;
  }
  
  // Transaction methods
  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }
  
  async getTransactionsByUserId(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter((transaction) => transaction.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async createTransaction(transactionData: InsertTransaction): Promise<Transaction> {
    const transaction: Transaction = {
      id: this.currentTransactionId++,
      userId: transactionData.userId,
      type: transactionData.type,
      amount: transactionData.amount,
      currency: transactionData.currency || "USD",
      assetSymbol: transactionData.assetSymbol || null,
      assetType: transactionData.assetType || null,
      status: "pending",
      createdAt: new Date(),
      leverage: null,
      duration: 0,
      takeProfit: null,
      stopLoss: null,
      margin: null,
      orderType: null
    };
    
    this.transactions.set(transaction.id, transaction);
    
    return transaction;
  }
  
  async updateTransaction(id: number, transactionData: Partial<Transaction>): Promise<Transaction | undefined> {
    const transaction = this.transactions.get(id);
    if (!transaction) return undefined;
    
    const updatedTransaction = { ...transaction, ...transactionData };
    this.transactions.set(id, updatedTransaction);
    
    // If transaction is completed, update wallet balance
    if (transactionData.status === "completed") {
      const wallet = await this.getWalletByUserId(transaction.userId);
      if (wallet) {
        let newBalance = wallet.balance;
        
        if (transaction.type === "deposit") {
          newBalance += transaction.amount;
        } else if (transaction.type === "withdrawal") {
          newBalance -= transaction.amount;
        }
        
        this.wallets.set(wallet.id, { ...wallet, balance: newBalance });
      }
    }
    
    return updatedTransaction;
  }
  
  async getAllPendingTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter((transaction) => transaction.status === "pending")
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }
  
  // Portfolio methods
  async getPortfolioByUserId(userId: number): Promise<Portfolio[]> {
    return Array.from(this.portfolios.values()).filter(
      (portfolio) => portfolio.userId === userId
    );
  }
  
  async createPortfolio(portfolioData: InsertPortfolio): Promise<Portfolio> {
    const portfolio: Portfolio = {
      id: this.currentPortfolioId++,
      ...portfolioData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.portfolios.set(portfolio.id, portfolio);
    
    return portfolio;
  }
  
  async updatePortfolio(id: number, portfolioData: Partial<Portfolio>): Promise<Portfolio | undefined> {
    const portfolio = this.portfolios.get(id);
    if (!portfolio) return undefined;
    
    const updatedPortfolio = { 
      ...portfolio, 
      ...portfolioData, 
      updatedAt: new Date() 
    };
    
    this.portfolios.set(id, updatedPortfolio);
    
    return updatedPortfolio;
  }
  
  async deletePortfolio(id: number): Promise<boolean> {
    return this.portfolios.delete(id);
  }
  
  // Watchlist methods
  async getWatchlistByUserId(userId: number): Promise<Watchlist[]> {
    return Array.from(this.watchlists.values()).filter(
      (watchlist) => watchlist.userId === userId
    );
  }
  
  async createWatchlist(watchlistData: InsertWatchlist): Promise<Watchlist> {
    const watchlist: Watchlist = {
      id: this.currentWatchlistId++,
      userId: watchlistData.userId,
      assetSymbol: watchlistData.assetSymbol,
      assetType: watchlistData.assetType,
      assetName: watchlistData.assetName,
      exchange: watchlistData.exchange || null,
      createdAt: new Date()
    };
    
    this.watchlists.set(watchlist.id, watchlist);
    
    return watchlist;
  }
  
  async deleteWatchlist(id: number): Promise<boolean> {
    return this.watchlists.delete(id);
  }
  
  // Content methods
  async getContent(id: number): Promise<Content | undefined> {
    return this.contents.get(id);
  }
  
  async getContentBySlug(slug: string): Promise<Content | undefined> {
    return Array.from(this.contents.values()).find(
      (content) => content.slug === slug
    );
  }
  
  async getAllContents(): Promise<Content[]> {
    return Array.from(this.contents.values());
  }
  
  async createContent(contentData: InsertContent): Promise<Content> {
    const content: Content = {
      id: this.currentContentId++,
      title: contentData.title,
      content: contentData.content,
      type: contentData.type,
      slug: contentData.slug,
      isPublished: contentData.isPublished || false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.contents.set(content.id, content);
    
    return content;
  }
  
  async updateContent(id: number, contentData: Partial<Content>): Promise<Content | undefined> {
    const content = this.contents.get(id);
    if (!content) return undefined;
    
    const updatedContent = { 
      ...content, 
      ...contentData, 
      updatedAt: new Date() 
    };
    
    this.contents.set(id, updatedContent);
    
    return updatedContent;
  }
  
  // Settings methods
  async getSetting(key: string): Promise<Setting | undefined> {
    return Array.from(this.settings.values()).find(
      (setting) => setting.key === key
    );
  }
  
  async getAllSettings(): Promise<Setting[]> {
    return Array.from(this.settings.values());
  }
  
  async createOrUpdateSetting(settingData: InsertSetting): Promise<Setting> {
    const existingSetting = await this.getSetting(settingData.key);
    
    if (existingSetting) {
      const updatedSetting = { 
        ...existingSetting, 
        value: settingData.value, 
        updatedAt: new Date() 
      };
      
      this.settings.set(existingSetting.id, updatedSetting);
      
      return updatedSetting;
    }
    
    const newSetting: Setting = {
      id: this.currentSettingId++,
      ...settingData,
      updatedAt: new Date()
    };
    
    this.settings.set(newSetting.id, newSetting);
    
    return newSetting;
  }
}

export const storage = new DatabaseStorage();
