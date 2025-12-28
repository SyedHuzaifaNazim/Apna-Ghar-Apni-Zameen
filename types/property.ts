// types/property.ts

export type ListingType = 'For Sale' | 'For Rent' | 'Auction' | 'Short Term Rent';
export type PropertyCategory =
  | 'Residential Flat'
  | 'Residential House'
  | 'Commercial Shop'
  | 'Commercial Office'
  | 'Industrial Plot'
  | 'Farm House'
  | 'Warehouse'
  | 'Penthouse'
  | 'Studio'
  | 'Retail Outlet'
  | 'Showroom'
  | 'Corporate Tower'
  | 'Factory';
export type AreaUnit = 'sqft' | 'sq-yard' | 'acre' | 'kanal' | 'marla';
export type FurnishingType = 'Furnished' | 'Semi-Furnished' | 'Unfurnished';
export type PropertyCondition = 'New' | 'Renovated' | 'Well-Maintained' | 'Old';
export type OwnerType = 'Owner' | 'Agent' | 'Developer';
export type ContactVisibility = 'Public' | 'Verified Users Only';
export type EnergyRating = 'A' | 'B' | 'C' | 'D' | 'E';
export type WaterSupply = 'Available' | 'Not Available';
export type ElectricityBackup = 'None' | 'Partial' | 'Full';

export interface Property {
  id: number;
  title: string;
  listingType: ListingType;
  propertyCategory: PropertyCategory;

  price: number;
  currency: string;
  areaSize: number;
  areaUnit: AreaUnit;
  
  address: {
    city: string;
    area: string;
    line1: string;
    postalCode: string;
    latitude: number;
    longitude: number;
  };

  bedrooms: number;
  bathrooms: number;
  floorLevel: number | null;
  furnishing: FurnishingType;

  yearBuilt: number;
  propertyCondition: PropertyCondition;

  amenities: string[]; 
  features: string[]; 
  tags: string[];

  nearbyLandmarks: {
    name: string;
    distanceKm: number;
  }[];

  ownerType: OwnerType;
  ownerDetails: {
    name: string;
    phone: string;
    email: string;
    agencyName?: string;
  };

  contactVisibility: ContactVisibility;

  videoTour?: string;
  virtual3DTour?: string;

  energyRating?: EnergyRating;
  waterSupply: WaterSupply;
  electricityBackup: ElectricityBackup;
  parkingSpaces: number;

  description: string;
  datePosted: string;
  isFeatured: boolean;

  rating?: number;  
  views: number;
  images: string[];
}