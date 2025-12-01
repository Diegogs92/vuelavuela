export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  role: 'client' | 'agent';
  createdAt: Date;
}

export interface TravelPreferences {
  travelPeriod: {
    startDate: string;
    endDate: string;
    flexible: boolean;
  };
  daysAvailable: number;
  passengers: {
    adults: number;
    children: number;
    babies: number;
  };
  destinations: string[];
  accommodationType: string[];
  activities: string[];
  otherPreferences: string;
}

export interface TravelRequest {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  preferences: TravelPreferences;
  status: 'pending' | 'quoted' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface Quote {
  id: string;
  requestId: string;
  userId: string;
  title: string;
  description: string;
  itinerary: string;
  price: number;
  currency: string;
  validUntil: Date;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}
