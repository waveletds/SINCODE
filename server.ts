import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import axios from "axios";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

async function startServer() {
  console.log("SINCODE: Initializing Server...");
  const app = express();
  const PORT = 3000;

  // Initialize AI Model inside startServer to avoid top-level issues
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  async function generateContentWithFallback(prompt: string): Promise<string> {
    const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-2.5-pro"];
    const maxRetriesPerModel = 2;

    for (const model of models) {
      for (let attempt = 1; attempt <= maxRetriesPerModel; attempt++) {
        try {
          console.log(`Gemini API Call: model=${model}, attempt=${attempt}`);
          const result = await ai.models.generateContent({
            model,
            contents: prompt,
          });
          if (result && result.text) {
            return result.text;
          }
          throw new Error("Empty response from Gemini API");
        } catch (error: any) {
          const errorMsg = error instanceof Error ? error.message : String(error);
          console.warn(`Gemini API warning [model=${model}, attempt=${attempt}]: ${errorMsg}`);
          
          if (model === models[models.length - 1] && attempt === maxRetriesPerModel) {
            throw error;
          }
          // Exponential backoff delay
          const delay = attempt * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    throw new Error("All Gemini fallback models failed.");
  }

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
        const text = await generateContentWithFallback(prompt);
        
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

    // AI-Powered Recommendation Engine
    app.post("/api/recommendations", async (req, res) => {
      const { viewingHistory, subscriptions, interests, allPosts, allCreators } = req.body;
      
      const safeAllPosts = allPosts || [];
      const safeAllCreators = allCreators || [];

      if (!process.env.GEMINI_API_KEY) {
        // Fallback recommendations if API key is missing
        return res.json({
          recommendedPosts: safeAllPosts.slice(0, 3).map((p: any) => ({
            ...p,
            recommendationReason: "Trending inside the SINCODE community right now."
          })),
          recommendedCreators: safeAllCreators.slice(0, 2).map((c: any) => ({
            ...c,
            recommendationReason: "Highly rated curator in Lagos."
          }))
        });
      }

      try {
        const prompt = `You are the AI recommendation engine of SINCODE, an elite Nigerian Creator Hub.
Your task is to analyze a user's viewing history, subscriptions, and stated interests, and select the most relevant content (posts) and creators from the lists provided.

USER PROFILE:
- Stated Interests: ${JSON.stringify(interests || [])}
- Viewing History: ${JSON.stringify(viewingHistory || [])}
- Subscriptions (followed creators): ${JSON.stringify(subscriptions || [])}

AVAILABLE POSTS TO RECOMMEND:
${JSON.stringify(safeAllPosts.map((p: any) => ({ id: p.id, title: p.title, description: p.description, author: p.author, tags: p.tags })))}

AVAILABLE CREATORS TO RECOMMEND:
${JSON.stringify(safeAllCreators.map((c: any) => ({ username: c.username, name: c.name, category: c.category, bio: c.bio })))}

INSTRUCTIONS:
1. Select up to 3 posts from the "AVAILABLE POSTS TO RECOMMEND" that align best with the user's profile.
2. Select up to 2 creators from the "AVAILABLE CREATORS TO RECOMMEND" that align best with the user's profile.
3. For each selected post and creator, write a personalized, highly compelling "recommendationReason" in exactly 1 brief sentence (e.g., "Because you followed Lillie and are interested in Fashion" or "Based on your interest in Afrobeat & Music Culture").
4. Return JSON only in this exact format:
{
  "recommendedPostIds": ["id1", "id2", ...],
  "recommendedPostReasons": { "id1": "reason1", ... },
  "recommendedCreatorUsernames": ["username1", "username2", ...],
  "recommendedCreatorReasons": { "username1": "reason1", ... }
}
Do not return any markdown code blocks, backticks, or extra text. Just the raw, valid JSON object.`;

        const textRaw = await generateContentWithFallback(prompt);
        let text = textRaw.trim();
        
        // Sanitize output
        if (text.startsWith("```json")) {
          text = text.substring(7);
        }
        if (text.startsWith("```")) {
          text = text.substring(3);
        }
        if (text.endsWith("```")) {
          text = text.substring(0, text.length - 3);
        }
        text = text.trim();

        const data = JSON.parse(text);
        
        // Map back to full objects with custom reasons
        const recommendedPosts = safeAllPosts
          .filter((p: any) => data.recommendedPostIds?.includes(p.id?.toString()))
          .map((p: any) => ({
            ...p,
            recommendationReason: data.recommendedPostReasons?.[p.id?.toString()] || "Based on your active interests."
          }));

        const recommendedCreators = safeAllCreators
          .filter((c: any) => data.recommendedCreatorUsernames?.includes(c.username))
          .map((c: any) => ({
            ...c,
            recommendationReason: data.recommendedCreatorReasons?.[c.username] || "Suggested creator based on your style."
          }));

        // Fillers if empty
        const finalPosts = recommendedPosts.length > 0 ? recommendedPosts : safeAllPosts.slice(0, 3).map((p: any) => ({ ...p, recommendationReason: "Popular content trending in Lagos." }));
        const finalCreators = recommendedCreators.length > 0 ? recommendedCreators : safeAllCreators.slice(0, 2).map((c: any) => ({ ...c, recommendationReason: "A creator we think you'll love!" }));

        res.json({
          recommendedPosts: finalPosts,
          recommendedCreators: finalCreators
        });
      } catch (error) {
        console.error("Recommendations API Error:", error);
        res.json({
          recommendedPosts: safeAllPosts.slice(0, 3).map((p: any) => ({ ...p, recommendationReason: "Recommended for you based on popular trending tags." })),
          recommendedCreators: safeAllCreators.slice(0, 2).map((c: any) => ({ ...c, recommendationReason: "Lagos curator recommended for you." }))
        });
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
