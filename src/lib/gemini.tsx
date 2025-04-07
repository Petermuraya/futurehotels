import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

// Define a strict schema for validation
const HotelPredictionSchema = z.object({
  prediction: z.string(),
  price: z.number().positive().optional(),
  currency: z.enum(["KSH", "USD"]).optional(),
  confidence: z.enum(["high", "medium", "low"]).optional(),
  seasonality: z.string().optional(),
  bestBookingWindow: z.string().optional(),
});

type HotelPrediction = z.infer<typeof HotelPredictionSchema> & { isError?: boolean };

export async function predictHotelPrice(query: string): Promise<HotelPrediction> {
  try {
    if (!/(hotel|accommodation|booking)/i.test(query)) {
      return {
        prediction: "Invalid query. This system only provides hotel pricing and booking insights.",
        isError: true,
      };
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro-latest",
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1500,
        topP: 0.95,
      },
    });

    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString("default", { month: "long" });

    const prompt = `
    You are an advanced hotel price prediction system specifically trained for Kenya. Your role is to analyze hotel pricing trends, availability, and booking strategies. Ensure your response remains within the domain of hotel pricing and booking.

    QUERY: "${query}"
    CURRENT MONTH: ${currentMonth}

    Respond STRICTLY in this JSON format:
    {
      "prediction": "string",
      "price": number,
      "currency": "KSH/USD",
      "confidence": "high/medium/low",
      "seasonality": "string",
      "bestBookingWindow": "string"
    }
    `;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    try {
      const parsedData = JSON.parse(response);
      const validatedData = HotelPredictionSchema.safeParse(parsedData);

      if (!validatedData.success) {
        console.warn("Validation failed:", validatedData.error.errors);
        throw new Error("Invalid response format");
      }

      return { ...validatedData.data, isError: false };
    } catch {
      return { prediction: `Hotel Insight: ${response}`, isError: false };
    }
  } catch (error) {
    console.error("Prediction Error:", error);
    return {
      prediction: "Our pricing engine is currently unavailable. Please describe your needs and we'll estimate manually.",
      isError: true,
    };
  }
}

export type { HotelPrediction };
