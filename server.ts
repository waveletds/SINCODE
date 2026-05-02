import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "SINCODE API is running" });
  });

  // Monnify Auth Helper
  async function getMonnifyAccessToken() {
    const apiKey = process.env.MONNIFY_API_KEY;
    const secretKey = process.env.MONNIFY_SECRET_KEY;
    const baseUrl = process.env.MONNIFY_BASE_URL;
    const authString = Buffer.from(`${apiKey}:${secretKey}`).toString("base64");

    const response = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${authString}`,
      },
    });

    const data = await response.json();
    if (!data.requestSuccessful) {
      throw new Error(data.responseMessage || "Monnify auth failed");
    }
    return data.responseBody.accessToken;
  }

  // Monnify Initialization
  app.post("/api/monnify/initialize", async (req, res) => {
    const { amount, customerName, customerEmail, paymentDescription, paymentReference } = req.body;
    
    try {
      const accessToken = await getMonnifyAccessToken();
      const baseUrl = process.env.MONNIFY_BASE_URL;

      const response = await fetch(`${baseUrl}/api/v1/merchant/transactions/init-transaction`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          customerName,
          customerEmail,
          paymentReference: paymentReference || `SC-${Date.now()}`,
          paymentDescription: paymentDescription || "SINCODE Subscription",
          currencyCode: "NGN",
          contractCode: process.env.MONNIFY_CONTRACT_CODE,
          redirectUrl: `${process.env.APP_URL}/payment/verify`,
          paymentMethods: ["CARD", "ACCOUNT_TRANSFER"],
        }),
      });

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Monnify Init Error:", error);
      res.status(500).json({ error: "Failed to initialize payment via Monnify" });
    }
  });

  // Monnify Webhook
  app.post("/api/monnify/webhook", (req, res) => {
    // TODO: Verify hash and update database
    console.log("Monnify Webhook received:", req.body);
    res.sendStatus(200);
  });

  // Monnify: Get Banks
  app.get("/api/monnify/banks", async (req, res) => {
    try {
      const accessToken = await getMonnifyAccessToken();
      const baseUrl = process.env.MONNIFY_BASE_URL;

      const response = await fetch(`${baseUrl}/api/v1/banks`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch banks" });
    }
  });

  // Monnify: Validate Account
  app.get("/api/monnify/validate-account", async (req, res) => {
    const { accountNumber, bankCode } = req.query;
    try {
      const accessToken = await getMonnifyAccessToken();
      const baseUrl = process.env.MONNIFY_BASE_URL;

      const response = await fetch(
        `${baseUrl}/api/v1/disbursements/account/validate?accountNumber=${accountNumber}&bankCode=${bankCode}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to validate account" });
    }
  });

  // Monnify: Initiate Transfer (Payout)
  app.post("/api/monnify/transfer", async (req, res) => {
    const { amount, reference, narration, destinationBankCode, destinationAccountNumber } = req.body;
    try {
      const accessToken = await getMonnifyAccessToken();
      const baseUrl = process.env.MONNIFY_BASE_URL;

      const response = await fetch(`${baseUrl}/api/v1/disbursements/single`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          reference: reference || `WDL-${Date.now()}`,
          narration: narration || "SINCODE Payout",
          destinationBankCode,
          destinationAccountNumber,
          currency: "NGN",
          sourceAccountNumber: process.env.MONNIFY_SOURCE_ACCOUNT, // Your wallet account
        }),
      });

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Transfer Error:", error);
      res.status(500).json({ error: "Failed to initiate transfer" });
    }
  });

  // AI Moderation with Gemini
  app.post("/api/moderate", async (req, res) => {
    const { content } = req.body;
    try {
      // Placeholder for Gemini moderation logic
      // In a real app, we'd use the @google/genai SDK here
      res.json({ flagged: false, confidence: 0.99 });
    } catch (error) {
      res.status(500).json({ error: "Moderation failed" });
    }
  });

  // Vite middleware for development
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
    console.log(`SINCODE Server running on http://localhost:${PORT}`);
  });
}

startServer();
