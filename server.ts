import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  console.log("SINCODE: Initializing Server...");
  const app = express();
  const PORT = 3000;

  // Initialize AI Model inside startServer to avoid top-level issues
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy_key");
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  app.use(express.json());

  // Error handling for the whole server initialization
  try {
    // API Routes
    app.get("/api/health", (req, res) => {
      res.json({ status: "ok", message: "SINCODE API is running", node_env: process.env.NODE_ENV || 'development' });
    });

    // Monnify Auth Helper
    async function getMonnifyAccessToken() {
      const apiKey = process.env.MONNIFY_API_KEY;
      const secretKey = process.env.MONNIFY_SECRET_KEY;
      const baseUrl = process.env.MONNIFY_BASE_URL;
      
      const missing = [];
      if (!apiKey) missing.push("MONNIFY_API_KEY");
      if (!secretKey) missing.push("MONNIFY_SECRET_KEY");
      if (!baseUrl) missing.push("MONNIFY_BASE_URL");

      if (missing.length > 0) {
        throw new Error(`Monnify credentials missing: ${missing.join(", ")}`);
      }

      const authString = Buffer.from(`${apiKey}:${secretKey}`).toString("base64");

      try {
        const response = await axios.post(`${baseUrl}/api/v1/auth/login`, {}, {
          headers: {
            Authorization: `Basic ${authString}`,
          },
        });

        if (!response.data.requestSuccessful) {
          throw new Error(response.data.responseMessage || "Monnify auth failed");
        }
        return response.data.responseBody.accessToken;
      } catch (error: any) {
        console.error("Monnify Auth Error:", error.response?.data || error.message);
        throw new Error("Failed to authenticate with Monnify");
      }
    }

    // Monnify Initialization
    app.post("/api/monnify/initialize", async (req, res) => {
      const { amount, customerName, customerEmail, paymentDescription, paymentReference } = req.body;
      
      try {
        const accessToken = await getMonnifyAccessToken();
        const baseUrl = process.env.MONNIFY_BASE_URL;

        const response = await axios.post(`${baseUrl}/api/v1/merchant/transactions/init-transaction`, {
          amount,
          customerName,
          customerEmail,
          paymentReference: paymentReference || `SC-${Date.now()}`,
          paymentDescription: paymentDescription || "SINCODE Subscription",
          currencyCode: "NGN",
          contractCode: process.env.MONNIFY_CONTRACT_CODE,
          redirectUrl: `${process.env.APP_URL}/payment/verify`,
          paymentMethods: ["CARD", "ACCOUNT_TRANSFER"],
        }, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        res.json(response.data);
      } catch (error: any) {
        const errorData = error.response?.data;
        console.error("Monnify Init Error:", JSON.stringify(errorData || error.message, null, 2));
        res.status(error.response?.status || 500).json({ 
          requestSuccessful: false,
          responseMessage: errorData?.responseMessage || errorData?.message || error.message || "Failed to initialize payment",
          error: errorData || error.message
        });
      }
    });

    // Monnify Webhook
    app.post("/api/monnify/webhook", (req, res) => {
      console.log("Monnify Webhook received:", req.body);
      res.sendStatus(200);
    });

    // Monnify: Get Banks
    app.get("/api/monnify/banks", async (req, res) => {
      try {
        const accessToken = await getMonnifyAccessToken();
        const baseUrl = process.env.MONNIFY_BASE_URL;

        const response = await axios.get(`${baseUrl}/api/v1/banks`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        res.json(response.data);
      } catch (error: any) {
        const errorData = error.response?.data;
        console.error("Monnify Banks Error:", JSON.stringify(errorData || error.message, null, 2));
        res.status(error.response?.status || 500).json({ 
          requestSuccessful: false,
          responseMessage: errorData?.responseMessage || errorData?.message || error.message || "Failed to fetch banks",
          error: errorData || error.message
        });
      }
    });

    // Monnify: Validate Account
    app.get("/api/monnify/validate-account", async (req, res) => {
      const { accountNumber, bankCode } = req.query;
      try {
        const accessToken = await getMonnifyAccessToken();
        const baseUrl = process.env.MONNIFY_BASE_URL;

        const response = await axios.get(
          `${baseUrl}/api/v1/disbursements/account/validate?accountNumber=${accountNumber}&bankCode=${bankCode}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        res.json(response.data);
      } catch (error: any) {
        const errorData = error.response?.data;
        console.error("Monnify Validate Error:", JSON.stringify(errorData || error.message, null, 2));
        res.status(error.response?.status || 500).json({ 
          requestSuccessful: false,
          responseMessage: errorData?.responseMessage || errorData?.message || error.message || "Failed to validate account",
          error: errorData || error.message
        });
      }
    });

    // Monnify: Initiate Transfer (Payout)
    app.post("/api/monnify/transfer", async (req, res) => {
      const { amount, reference, narration, destinationBankCode, destinationAccountNumber } = req.body;
      try {
        const accessToken = await getMonnifyAccessToken();
        const baseUrl = process.env.MONNIFY_BASE_URL;

        const response = await axios.post(`${baseUrl}/api/v1/disbursements/single`, {
          amount,
          reference: reference || `WDL-${Date.now()}`,
          narration: narration || "SINCODE Payout",
          destinationBankCode,
          destinationAccountNumber,
          currency: "NGN",
          sourceAccountNumber: process.env.MONNIFY_SOURCE_ACCOUNT,
        }, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        res.json(response.data);
      } catch (error: any) {
        const errorData = error.response?.data;
        console.error("Monnify Transfer Error:", JSON.stringify(errorData || error.message, null, 2));
        res.status(error.response?.status || 500).json({ 
          requestSuccessful: false,
          responseMessage: errorData?.responseMessage || errorData?.message || error.message || "Failed to initiate transfer",
          error: errorData || error.message
        });
      }
    });

    // Monnify: Create Reserved Account (DAN)
    app.post("/api/monnify/reserved-accounts", async (req, res) => {
      const { accountReference, accountName, customerEmail, customerName } = req.body;
      try {
        const accessToken = await getMonnifyAccessToken();
        const baseUrl = process.env.MONNIFY_BASE_URL;

        const response = await axios.post(`${baseUrl}/api/v1/bank-transfer/reserved-accounts`, {
          accountReference: accountReference || `DAN-${Date.now()}`,
          accountName,
          currencyCode: "NGN",
          contractCode: process.env.MONNIFY_CONTRACT_CODE,
          customerEmail,
          customerName,
          getAllAvailableBanks: true
        }, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        res.json(response.data);
      } catch (error: any) {
        const errorData = error.response?.data;
        console.error("Monnify DAN Error:", JSON.stringify(errorData || error.message, null, 2));
        res.status(error.response?.status || 500).json({ 
          requestSuccessful: false,
          responseMessage: errorData?.responseMessage || errorData?.message || error.message || "Failed to create reserved account",
          error: errorData || error.message
        });
      }
    });

    // AI Moderation with Gemini
    app.post("/api/moderate", async (req, res) => {
      const { content } = req.body;
      if (!process.env.GEMINI_API_KEY) {
        return res.json({ flagged: false, confidence: 1, reason: "Bypassed (API key missing)" });
      }

      try {
        const prompt = `Analyze the following social media post for harmful, illegal, or extremely violent content according to Nigerian community standards. Return JSON only: { "flagged": boolean, "reason": string }.\n\nContent: "${content}"`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        const jsonStart = text.indexOf('{');
        const jsonEnd = text.lastIndexOf('}') + 1;
        const jsonStr = text.substring(jsonStart, jsonEnd);
        const moderation = JSON.parse(jsonStr);
        res.json(moderation);
      } catch (error) {
        console.error("Moderation Error:", error);
        res.status(500).json({ error: "Moderation failed" });
      }
    });

    // Vite middleware for development
    if (process.env.NODE_ENV !== "production") {
      console.log("Starting server in DEVELOPMENT mode");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } else {
      console.log("Starting server in PRODUCTION mode");
      const distPath = path.join(process.cwd(), "dist");
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`SINCODE Server running on http://0.0.0.0:${PORT}`);
    });
  } catch (err) {
    console.error("Fatal Server Startup Error:", err);
    process.exit(1);
  }
}

startServer().catch(err => {
  console.error("Unhandle startServer error:", err);
  process.exit(1);
});
