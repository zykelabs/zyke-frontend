// utils/api.ts

export interface ShortTrend {
    trend: string;
    shortDescription: string;
  }
  
  export interface DetailedTrend {
    Trend: string;
    "Short Description": string;
    "Long Description": string;
  }
  
  export async function fetchShortTrends(): Promise<ShortTrend[]> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/trending`);
    if (!response.ok) {
      throw new Error("Failed to fetch short trends.");
    }
    const data: ShortTrend[] = await response.json();
    return data;
  }
  
  export async function fetchDetailedTrend(trend: string): Promise<DetailedTrend> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/trend_details?trend=${encodeURIComponent(trend)}`);
    if (!response.ok) {
      throw new Error("Failed to fetch detailed trend.");
    }
    const data: DetailedTrend = await response.json();
    return data;
  }
  