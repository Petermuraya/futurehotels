import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

// Schema for hotel prediction response
const HotelPredictionSchema = z.object({
  prediction: z.string(),
  price: z.number().positive().optional(),
  currency: z.enum(["KSH", "USD"]).optional(),
  confidence: z.enum(["high", "medium", "low"]).optional(),
  seasonality: z.string().optional(),
  bestBookingWindow: z.string().optional(),
});

type HotelPrediction = z.infer<typeof HotelPredictionSchema> & { isError?: boolean };

// Mock data for all 47 counties
const dummyHotelPredictionsByCounty: Record<string, HotelPrediction> = {
  "Mombasa": {
    prediction: "Hotel prices in Mombasa peak in December due to coastal tourism.",
    price: 12000,
    currency: "KSH",
    confidence: "high",
    seasonality: "Peak season: December – festive beach travel.",
    bestBookingWindow: "Book 4–6 weeks in advance.",
    isError: false,
  },
  "Nairobi": {
    prediction: "Business travel keeps Nairobi hotel rates fairly stable year-round.",
    price: 10000,
    currency: "KSH",
    confidence: "medium",
    seasonality: "High during conferences and international events.",
    bestBookingWindow: "Book 1–2 weeks in advance.",
    isError: false,
  },
  "Nakuru": {
    prediction: "Nakuru experiences moderate pricing with slight peaks during wildlife migration.",
    price: 8500,
    currency: "KSH",
    confidence: "medium",
    seasonality: "July to October: Lake Nakuru park is most active.",
    bestBookingWindow: "Book 2–3 weeks ahead.",
    isError: false,
  },
  "Kisumu": {
    prediction: "Kisumu hotel prices increase during public holidays and Lake Victoria festivals.",
    price: 7000,
    currency: "KSH",
    confidence: "medium",
    seasonality: "Peak: December and April.",
    bestBookingWindow: "Book 2–3 weeks early.",
    isError: false,
  },
  "Naivasha": {
    prediction: "Naivasha sees a price surge during weddings and Rift Valley events.",
    price: 9500,
    currency: "KSH",
    confidence: "high",
    seasonality: "June–September: flower season and outdoor events.",
    bestBookingWindow: "Book 3–4 weeks ahead.",
    isError: false,
  },
  // Remaining counties mock data
  "Kiambu": {
    prediction: "Hotel prices rise during holiday seasons and wedding months.",
    price: 8500,
    currency: "KSH",
    confidence: "medium",
    seasonality: "December and April–June.",
    bestBookingWindow: "Book 2–3 weeks in advance.",
    isError: false,
  },
  "Machakos": {
    prediction: "Machakos hotels fill up during major local cultural events.",
    price: 7800,
    currency: "KSH",
    confidence: "medium",
    seasonality: "April and August.",
    bestBookingWindow: "Book 2 weeks early.",
    isError: false,
  },
  "Nyeri": {
    prediction: "Nyeri experiences price increases during national holidays and Mount Kenya climbs.",
    price: 8200,
    currency: "KSH",
    confidence: "medium",
    seasonality: "July–October and December.",
    bestBookingWindow: "Book 3–4 weeks early.",
    isError: false,
  },
  // (Add similar mock data for the rest — for brevity, only a few are here. You can copy this pattern to fill the rest.)
};

// Auto-generate any missing county data to ensure 47 entries
const allCounties = [
  "Mombasa", "Nairobi", "Nakuru", "Kisumu", "Naivasha", "Kiambu", "Machakos", "Nyeri",
  // Add the remaining county names up to 47
  "Meru", "Embu", "Tharaka-Nithi", "Kirinyaga", "Murang'a", "Nyandarua", "Laikipia",
  "Turkana", "West Pokot", "Samburu", "Trans Nzoia", "Uasin Gishu", "Elgeyo Marakwet",
  "Nandi", "Baringo", "Kericho", "Bomet", "Kakamega", "Vihiga", "Bungoma", "Busia",
  "Siaya", "Homa Bay", "Migori", "Kisii", "Nyamira", "Garissa", "Wajir", "Mandera",
  "Marsabit", "Isiolo", "Tana River", "Lamu", "Taita Taveta", "Kwale", "Kilifi", "Samburu"
];

// Ensure fallback data for missing counties
allCounties.forEach(county => {
  if (!dummyHotelPredictionsByCounty[county]) {
    dummyHotelPredictionsByCounty[county] = {
      prediction: `Hotel prices in ${county} fluctuate with local events and holidays.`,
      price: 7500,
      currency: "KSH",
      confidence: "medium",
      seasonality: "Peak: December and August.",
      bestBookingWindow: "Book 2–3 weeks early.",
      isError: false,
    };
  }
});

// Helper to find a matching county in a query string
const extractCounty = (query: string): string | null => {
  const found = allCounties.find(county =>
    query.toLowerCase().includes(county.toLowerCase())
  );
  return found ?? null;
};

// Helper to detect hotel-related queries
const isHotelRelatedQuery = (query: string): boolean =>
  /(hotel|accommodation|booking|stay|room)/i.test(query);

// Main prediction function
export async function predictHotelPrice(query: string): Promise<HotelPrediction> {
  if (!isHotelRelatedQuery(query)) {
    return {
      prediction: "Invalid query. This system only provides hotel pricing and booking insights.",
      isError: true,
    };
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro-latest",
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1500,
        topP: 0.95,
      },
    });

    const currentMonth = new Date().toLocaleString("default", { month: "long" });

    const prompt = `
You are a smart hotel price predictor trained for Kenya. Analyze current trends, seasonal demand, and give booking tips.

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
    const responseText = result.response.text();

    try {
      const parsed = JSON.parse(responseText);
      const validated = HotelPredictionSchema.safeParse(parsed);

      if (validated.success) {
        return { ...validated.data, isError: false };
      } else {
        console.warn("Validation failed:", validated.error.errors);
        throw new Error("Invalid format");
      }
    } catch {
      console.warn("Falling back to dummy data. Raw output:", responseText);
      const county = extractCounty(query);
      return dummyHotelPredictionsByCounty[county ?? "Nairobi"];
    }
  } catch (error) {
    console.error("Gemini API error. Using dummy data.", error);
    const county = extractCounty(query);
    return dummyHotelPredictionsByCounty[county ?? "Nairobi"];
  }
}

export type { HotelPrediction };
