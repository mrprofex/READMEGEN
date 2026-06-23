export interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface ProjectData {
  name: string;
  description: string;
  githubUrl: string;
}

export interface ReadmeUserData {
  name: string;
  githubUsername: string;
  tagline: string;
  bio: string;
  location: string;
  
  // socials
  github?: string;
  linkedin?: string;
  instagram?: string;
  twitter?: string;
  portfolio?: string;
  discord?: string;

  // skills & goals
  skills: string[];
  learningGoals: string;
  projects: ProjectData[];

  // Active section configuration
  sections?: {
    headerWave: boolean;
    typingIndicator: boolean;
    developerDashboard: boolean;
    connectWithMe: boolean;
    skillsList: boolean;
    currentJourney: boolean;
    developerActivity: boolean;
    contributionStreak: boolean;
    featuredProjects: boolean;
    spotlightSlider: boolean;
    funFacts: boolean;
    learningRoadmap: boolean;
  };
}

export interface Order {
  id: string;
  userId: string;
  username: string;
  plan: "Pro" | "Premium";
  amount: number;
  status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  cashfreeOrderId: string;
  readmeData: ReadmeUserData;
  generatedReadme?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  orderId: string;
  transactionId: string;
  status: "SUCCESS" | "FAILED";
  amount: number;
  method: string;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalOrders: number;
  paidOrders: number;
  revenue: number;
  recentPayments: Payment[];
  recentOrders: Order[];
  cashfreeStatus: {
    isConfigured: boolean;
    environment: string;
  };
}
