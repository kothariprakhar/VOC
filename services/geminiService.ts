import { GoogleGenAI, Type } from "@google/genai";
import { ProductAnalysis, Review, FeatureSuggestion, Sentiment, Category, Source } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeProduct = async (productName: string, productDescription: string): Promise<ProductAnalysis> => {
  
  const model = "gemini-2.5-flash";
  
  const prompt = `
    Act as a product intelligence engine.
    I have a product named "${productName}".
    Description: "${productDescription}".

    I need you to SIMULATE scraping 20-30 diverse user reviews from sources like Reddit, Twitter, and Product Hunt.
    
    Based on these simulated reviews, perform the following:
    1. Generate the raw reviews with realistic content, user handles, and engagement metrics.
    2. Classify each review by sentiment (Positive, Neutral, Negative) and category (Bug Report, Feature Request, Praise, General Feedback).
    3. Identify top feature requests based on the reviews and prioritize them with Impact vs Effort scores.
    4. Provide a high-level executive summary of the public reception.

    Return the data strictly in the requested JSON schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "Executive summary of public sentiment." },
            reviews: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  source: { type: Type.STRING, enum: ["Reddit", "Twitter", "Product Hunt", "Hacker News"] },
                  author: { type: Type.STRING },
                  content: { type: Type.STRING },
                  sentiment: { type: Type.STRING, enum: ["Positive", "Neutral", "Negative"] },
                  category: { type: Type.STRING, enum: ["Bug Report", "Feature Request", "Praise", "General Feedback"] },
                  likes: { type: Type.INTEGER },
                  date: { type: Type.STRING, description: "ISO date string, relative to now (e.g. '2023-10-25')" }
                },
                required: ["id", "source", "author", "content", "sentiment", "category", "likes", "date"]
              }
            },
            features: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  impactScore: { type: Type.INTEGER, description: "1-10 scale" },
                  effortScore: { type: Type.INTEGER, description: "1-10 scale" },
                  priority: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
                  relatedReviewIds: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["id", "title", "description", "impactScore", "effortScore", "priority", "relatedReviewIds"]
              }
            }
          },
          required: ["summary", "reviews", "features"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");

    // Calculate aggregate stats
    let pos = 0, neu = 0, neg = 0;
    (data.reviews || []).forEach((r: any) => {
      if (r.sentiment === 'Positive') pos++;
      else if (r.sentiment === 'Negative') neg++;
      else neu++;
    });

    return {
      productName,
      summary: data.summary || "No summary available.",
      reviews: data.reviews as Review[],
      features: data.features as FeatureSuggestion[],
      sentimentStats: {
        positive: pos,
        neutral: neu,
        negative: neg
      }
    };

  } catch (error) {
    console.error("GenAI Error:", error);
    throw new Error("Failed to analyze product. Please try again.");
  }
};
