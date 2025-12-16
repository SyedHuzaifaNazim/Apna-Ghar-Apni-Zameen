// ===============================================================
// TYPE DEFINITIONS
// ===============================================================
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

// ===============================================================
// MOCK DATA (COMBINED CHUNKS)
// ===============================================================
export const MOCK_PROPERTIES: Property[] = [
  {
    id: 2001,
    title: "Modern 3-Bed Apartment with Park View",
    listingType: "For Sale",
    propertyCategory: "Residential Flat",
    price: 14500000,
    currency: "PKR",
    areaSize: 1650,
    areaUnit: "sqft",
    address: {
      city: "Karachi",
      area: "Gulshan-e-Iqbal Block 2",
      line1: "Park View Residency, 7th Floor",
      postalCode: "75300",
      latitude: 24.9201,
      longitude: 67.0922
    },
    bedrooms: 3,
    bathrooms: 3,
    floorLevel: 7,
    furnishing: "Semi-Furnished",
    yearBuilt: 2020,
    propertyCondition: "Well-Maintained",
    amenities: ["Lift", "Parking", "Security", "Standby Generator"],
    features: ["Corner Unit", "Park-Facing Balcony", "Imported Kitchen"],
    tags: ["Family", "Prime Location", "Near University Road"],
    nearbyLandmarks: [
      { name: "Aladin Park", distanceKm: 1.2 },
      { name: "Karachi University", distanceKm: 2.5 }
    ],
    ownerType: "Owner",
    ownerDetails: {
      name: "Faisal Ahmed",
      phone: "+92-300-1234567",
      email: "faisal.owner@example.com"
    },
    contactVisibility: "Public",
    videoTour: "https://videos.example.com/apt2001.mp4",
    virtual3DTour: "https://vr.example.com/tour2001",
    energyRating: "B",
    waterSupply: "Available",
    electricityBackup: "Full",
    parkingSpaces: 1,
    description:
      "A beautifully maintained apartment overlooking a lush green park. Spacious layout, modern fittings, dedicated parking, and uninterrupted utilities.",
    datePosted: "2025-01-03T10:05:00Z",
    isFeatured: true,
    rating: 4.8,
    views: 512,
    images: [
      "https://images.unsplash.com/photo-1560185008-b033106af41d?w=800",
      "https://images.unsplash.com/photo-1586105251261-72a756497a12?w=800"
    ]
  },

  {
    id: 2002,
    title: "Luxury Bungalow with Swimming Pool",
    listingType: "For Sale",
    propertyCategory: "Residential House",
    price: 98000000,
    currency: "PKR",
    areaSize: 600,
    areaUnit: "sq-yard",
    address: {
      city: "Lahore",
      area: "DHA Phase 6",
      line1: "Street 12, Sector G",
      postalCode: "54000",
      latitude: 31.4891,
      longitude: 74.4042
    },
    bedrooms: 5,
    bathrooms: 6,
    floorLevel: null,
    furnishing: "Furnished",
    yearBuilt: 2023,
    propertyCondition: "New",
    amenities: ["Swimming Pool", "Gym", "Basement", "Solar Panels"],
    features: [
      "Home Theater",
      "Imported Flooring",
      "Smart Home System",
      "Landscaped Garden"
    ],
    tags: ["Luxury", "High-End", "New Construction"],
    nearbyLandmarks: [
      { name: "DHA Raya Golf Club", distanceKm: 1.1 },
      { name: "Lahore Ring Road", distanceKm: 2.7 }
    ],
    ownerType: "Agent",
    ownerDetails: {
      name: "Zain Malik",
      phone: "+92-322-4455566",
      email: "zain.realtor@example.com",
      agencyName: "Skyline Realtors"
    },
    contactVisibility: "Verified Users Only",
    videoTour: "https://videos.example.com/house2002.mp4",
    virtual3DTour: "https://vr.example.com/tour2002",
    energyRating: "A",
    waterSupply: "Available",
    electricityBackup: "Full",
    parkingSpaces: 4,
    description:
      "A state-of-the-art bungalow featuring luxury interiors, imported fittings, and a private pool. A rare opportunity to own a premium residence in DHA.",
    datePosted: "2025-01-03T11:30:00Z",
    isFeatured: true,
    rating: 4.9,
    views: 904,
    images: [
      "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800",
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800"
    ]
  },

  {
    id: 2003,
    title: "Commercial Office Space in Blue Area",
    listingType: "For Rent",
    propertyCategory: "Commercial Office",
    price: 350000,
    currency: "PKR",
    areaSize: 4200,
    areaUnit: "sqft",
    address: {
      city: "Islamabad",
      area: "Blue Area",
      line1: "Jinnah Avenue Tower, 9th Floor",
      postalCode: "44000",
      latitude: 33.7081,
      longitude: 73.0652
    },
    bedrooms: 0,
    bathrooms: 4,
    floorLevel: 9,
    furnishing: "Semi-Furnished",
    yearBuilt: 2018,
    propertyCondition: "Well-Maintained",
    amenities: [
      "High-Speed Elevators",
      "Fire Safety System",
      "Underground Parking",
      "Backup Power"
    ],
    features: ["Glass Partitioning", "Server Room", "Conference Hall"],
    tags: ["Corporate", "Prime Location", "Commercial Hub"],
    nearbyLandmarks: [
      { name: "Centaurus Mall", distanceKm: 1.8 },
      { name: "Metro Bus Station", distanceKm: 0.4 }
    ],
    ownerType: "Developer",
    ownerDetails: {
      name: "Capital Developers",
      phone: "+92-51-8899001",
      email: "info@capitaldev.pk",
      agencyName: "Capital Developers Pvt Ltd"
    },
    contactVisibility: "Public",
    videoTour: "https://videos.example.com/office2003.mp4",
    virtual3DTour: "https://vr.example.com/office2003",
    energyRating: "A",
    waterSupply: "Available",
    electricityBackup: "Full",
    parkingSpaces: 6,
    description:
      "Premium office space ideal for corporate setups. Excellent visibility, secure building, and uninterrupted utilities.",
    datePosted: "2025-01-04T09:25:00Z",
    isFeatured: false,
    rating: 4.7,
    views: 389,
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
      "https://images.unsplash.com/photo-1507209696998-3c532be9b2b6?w=800"
    ]
  },

  {
    id: 2004,
    title: "Warehouse Space with Loading Dock",
    listingType: "For Rent",
    propertyCategory: "Warehouse",
    price: 180000,
    currency: "PKR",
    areaSize: 18000,
    areaUnit: "sqft",
    address: {
      city: "Faisalabad",
      area: "Industrial Estate",
      line1: "Plot 92, Main Industrial Road",
      postalCode: "38000",
      latitude: 31.4181,
      longitude: 73.0790
    },
    bedrooms: 0,
    bathrooms: 2,
    floorLevel: null,
    furnishing: "Unfurnished",
    yearBuilt: 2015,
    propertyCondition: "Well-Maintained",
    amenities: ["Security", "Wide Entrance", "Truck Parking", "Water Line"],
    features: ["High Ceilings", "Ventilation System", "Loading Dock"],
    tags: ["Warehouse", "Industry", "Logistics"],
    nearbyLandmarks: [
      { name: "M3 Industrial Zone", distanceKm: 3.2 },
      { name: "Dry Port", distanceKm: 5.1 }
    ],
    ownerType: "Owner",
    ownerDetails: {
      name: "Bilal Traders",
      phone: "+92-300-8899221",
      email: "bilal.traders@example.com"
    },
    contactVisibility: "Public",
    waterSupply: "Available",
    electricityBackup: "Partial",
    parkingSpaces: 10,
    description:
      "Spacious warehouse ideal for storage, logistics, or manufacturing. Easy truck access with ample parking.",
    datePosted: "2025-01-04T13:50:00Z",
    isFeatured: false,
    rating: 4.5,
    views: 243,
    images: [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800",
      "https://images.unsplash.com/photo-1553413077-190b305b2ea7?w=800"
    ]
  },

  {
    id: 2005,
    title: "Contemporary 1-Bed Studio Apartment",
    listingType: "For Rent",
    propertyCategory: "Studio",
    price: 38000,
    currency: "PKR",
    areaSize: 525,
    areaUnit: "sqft",
    address: {
      city: "Islamabad",
      area: "Bahria Town Phase 4",
      line1: "Civic Center, Block A",
      postalCode: "46220",
      latitude: 33.5684,
      longitude: 73.1231
    },
    bedrooms: 1,
    bathrooms: 1,
    floorLevel: 3,
    furnishing: "Furnished",
    yearBuilt: 2022,
    propertyCondition: "New",
    amenities: ["Lift", "CCTV", "Generator", "Reception Desk"],
    features: ["Wooden Flooring", "Balcony", "Modern Kitchen"],
    tags: ["Students", "Small Family", "Budget-Friendly"],
    nearbyLandmarks: [
      { name: "Civic Center Park", distanceKm: 0.3 },
      { name: "Safari Club", distanceKm: 1.8 }
    ],
    ownerType: "Owner",
    ownerDetails: {
      name: "Noman Shah",
      phone: "+92-312-7891122",
      email: "noman.apartments@example.com"
    },
    contactVisibility: "Public",
    videoTour: "https://videos.example.com/studio2005.mp4",
    virtual3DTour: "https://vr.example.com/studio2005",
    energyRating: "A",
    waterSupply: "Available",
    electricityBackup: "Full",
    parkingSpaces: 1,
    description:
      "A modern studio apartment ideal for individuals looking for comfort and convenience. Located in one of Bahria Town's most accessible neighborhoods.",
    datePosted: "2025-01-05T09:50:00Z",
    isFeatured: true,
    rating: 4.9,
    views: 654,
    images: [
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20e?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"
    ]
  },
  {
    id: 2006,
    title: "Spacious 4-Bed Duplex Apartment with City Skyline View",
    listingType: "For Sale",
    propertyCategory: "Residential Flat",
    price: 26500000,
    currency: "PKR",
    areaSize: 2450,
    areaUnit: "sqft",
    address: {
      city: "Karachi",
      area: "Clifton Block 4",
      line1: "Skyline Residency, Tower B, 12th Floor",
      postalCode: "75600",
      latitude: 24.8134,
      longitude: 67.0323
    },
    bedrooms: 4,
    bathrooms: 5,
    floorLevel: 12,
    furnishing: "Semi-Furnished",
    yearBuilt: 2021,
    propertyCondition: "Well-Maintained",
    amenities: [
      "Swimming Pool",
      "Gym",
      "Covered Parking",
      "24/7 Security",
      "Reception Lobby"
    ],
    features: [
      "Duplex Layout",
      "Panoramic Windows",
      "Imported Fittings",
      "Private Maid Room"
    ],
    tags: ["Sea View", "Prime Area", "Luxury Living"],
    nearbyLandmarks: [
      { name: "Sea View Beach", distanceKm: 0.7 },
      { name: "Dolmen Mall", distanceKm: 1.3 }
    ],
    ownerType: "Owner",
    ownerDetails: {
      name: "Maria Khan",
      phone: "+92-300-9988776",
      email: "maria.property@example.com"
    },
    contactVisibility: "Public",
    videoTour: "https://videos.example.com/duplex2006.mp4",
    virtual3DTour: "https://vr.example.com/duplex2006",
    energyRating: "B",
    waterSupply: "Available",
    electricityBackup: "Full",
    parkingSpaces: 2,
    description:
      "A luxurious duplex apartment offering breathtaking views of the city skyline. Perfect for families who desire comfort, security, and modern amenities.",
    datePosted: "2025-01-06T14:15:00Z",
    isFeatured: true,
    rating: 4.8,
    views: 762,
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"
    ]
  },

  {
    id: 2007,
    title: "Industrial Factory Unit with Heavy Power Load",
    listingType: "For Sale",
    propertyCategory: "Factory",
    price: 68000000,
    currency: "PKR",
    areaSize: 32000,
    areaUnit: "sqft",
    address: {
      city: "Sialkot",
      area: "Industrial Zone",
      line1: "Plot 55, Export Manufacturing Road",
      postalCode: "51040",
      latitude: 32.4451,
      longitude: 74.5662
    },
    bedrooms: 0,
    bathrooms: 4,
    floorLevel: null,
    furnishing: "Unfurnished",
    yearBuilt: 2012,
    propertyCondition: "Well-Maintained",
    amenities: ["Heavy Electricity Load", "Truck Access", "Security Gate"],
    features: [
      "Production Hall",
      "Warehouse Storage",
      "Admin Block",
      "Ventilated Roof"
    ],
    tags: ["Manufacturing", "Industrial", "Export Zone"],
    nearbyLandmarks: [
      { name: "Sialkot Dry Port", distanceKm: 4.5 },
      { name: "Airport Link Road", distanceKm: 3.1 }
    ],
    ownerType: "Developer",
    ownerDetails: {
      name: "Industrial Group Pvt Ltd",
      phone: "+92-52-4422109",
      email: "info@igpl.com",
      agencyName: "Industrial Group Pvt Ltd"
    },
    contactVisibility: "Verified Users Only",
    energyRating: "C",
    waterSupply: "Available",
    electricityBackup: "Partial",
    parkingSpaces: 15,
    description:
      "A fully operational factory unit suitable for manufacturing and large-scale production. Equipped with high-power electric load and a spacious production hall.",
    datePosted: "2025-01-06T10:50:00Z",
    isFeatured: false,
    rating: 4.6,
    views: 503,
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800"
    ]
  },

  {
    id: 2008,
    title: "Corporate Tower Floor for Multinational Companies",
    listingType: "For Rent",
    propertyCategory: "Corporate Tower",
    price: 900000,
    currency: "PKR",
    areaSize: 7500,
    areaUnit: "sqft",
    address: {
      city: "Karachi",
      area: "I.I. Chundrigar Road",
      line1: "Axis Tower, 14th Floor",
      postalCode: "74000",
      latitude: 24.8502,
      longitude: 67.0092
    },
    bedrooms: 0,
    bathrooms: 6,
    floorLevel: 14,
    furnishing: "Semi-Furnished",
    yearBuilt: 2019,
    propertyCondition: "New",
    amenities: [
      "Centrally Air Conditioned",
      "Backup Generator",
      "Fire Control System",
      "Underground Parking"
    ],
    features: ["CEO Cabin", "Board Room", "Server Area", "Pantry"],
    tags: ["Corporate", "Multinational", "Prime Commercial"],
    nearbyLandmarks: [
      { name: "State Bank of Pakistan", distanceKm: 0.4 },
      { name: "Karachi Stock Exchange", distanceKm: 0.2 }
    ],
    ownerType: "Agent",
    ownerDetails: {
      name: "Ahmed Ali",
      phone: "+92-322-8899441",
      email: "ahmed.agent@example.com",
      agencyName: "Metro Corporate Realtors"
    },
    contactVisibility: "Public",
    videoTour: "https://videos.example.com/tower2008.mp4",
    virtual3DTour: "https://vr.example.com/tower2008",
    energyRating: "A",
    waterSupply: "Available",
    electricityBackup: "Full",
    parkingSpaces: 8,
    description:
      "A full-floor corporate space suitable for multinational firms seeking a modern, secure, fully equipped commercial environment.",
    datePosted: "2025-01-07T11:00:00Z",
    isFeatured: true,
    rating: 4.9,
    views: 819,
    images: [
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800"
    ]
  },

  {
    id: 2009,
    title: "Cozy 2-Bed Cottage in a Gated Community",
    listingType: "For Sale",
    propertyCategory: "Residential House",
    price: 9500000,
    currency: "PKR",
    areaSize: 1500,
    areaUnit: "sqft",
    address: {
      city: "Murree",
      area: "Patriata Hills",
      line1: "Hilltop Cottages Lane 5",
      postalCode: "47150",
      latitude: 33.9071,
      longitude: 73.3901
    },
    bedrooms: 2,
    bathrooms: 2,
    floorLevel: null,
    furnishing: "Furnished",
    yearBuilt: 2021,
    propertyCondition: "New",
    amenities: ["Mountain View", "Solar Backup", "Parking"],
    features: ["Wooden Interior", "Fireplace", "Private Lawn"],
    tags: ["Vacation Home", "Scenic View", "Cool Climate"],
    nearbyLandmarks: [
      { name: "Patriata Chairlift", distanceKm: 2.3 },
      { name: "Murree Expressway", distanceKm: 5.7 }
    ],
    ownerType: "Owner",
    ownerDetails: {
      name: "Shayan Raza",
      phone: "+92-344-1122334",
      email: "shayan.cottage@example.com"
    },
    contactVisibility: "Public",
    videoTour: "https://videos.example.com/cottage2009.mp4",
    energyRating: "A",
    waterSupply: "Available",
    electricityBackup: "Full",
    parkingSpaces: 2,
    description:
      "A charming cottage perfect for vacation getaways. Surrounded by greenery and offering breathtaking mountain views.",
    datePosted: "2025-01-07T13:40:00Z",
    isFeatured: true,
    rating: 4.7,
    views: 943,
    images: [
      "https://images.unsplash.com/photo-1505692794403-34d4982d2c71?w=800",
      "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800"
    ]
  },

  {
    id: 2010,
    title: "Penthouse with Private Rooftop Garden",
    listingType: "For Sale",
    propertyCategory: "Penthouse",
    price: 38500000,
    currency: "PKR",
    areaSize: 3000,
    areaUnit: "sqft",
    address: {
      city: "Islamabad",
      area: "F-11 Markaz",
      line1: "Elite Residency Tower",
      postalCode: "44000",
      latitude: 33.6955,
      longitude: 73.0153
    },
    bedrooms: 3,
    bathrooms: 4,
    floorLevel: 10,
    furnishing: "Furnished",
    yearBuilt: 2023,
    propertyCondition: "New",
    amenities: [
      "Rooftop Garden",
      "Sky Lounge",
      "Indoor Pool",
      "Private Elevator"
    ],
    features: [
      "Marble Flooring",
      "Glass Balcony",
      "Smart Home Automation"
    ],
    tags: ["Luxury Penthouse", "High-Rise Living", "Elite Area"],
    nearbyLandmarks: [
      { name: "F-11 Park", distanceKm: 0.9 },
      { name: "Margalla Road", distanceKm: 1.5 }
    ],
    ownerType: "Agent",
    ownerDetails: {
      name: "Raza Estate Consultants",
      phone: "+92-300-7711224",
      email: "contact@razaestate.com",
      agencyName: "Raza Estate Consultants"
    },
    contactVisibility: "Verified Users Only",
    videoTour: "https://videos.example.com/penthouse2010.mp4",
    virtual3DTour: "https://vr.example.com/penthouse2010",
    energyRating: "A",
    waterSupply: "Available",
    electricityBackup: "Full",
    parkingSpaces: 3,
    description:
      "A premium penthouse offering exclusive luxury living with a private rooftop garden and breathtaking views of the Margalla Hills.",
    datePosted: "2025-01-07T17:20:00Z",
    isFeatured: true,
    rating: 4.9,
    views: 1182,
    images: [
      "https://images.unsplash.com/photo-1502673530728-f79b4cab31b1?w=800",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800"
    ]
  },
  {
    id: 2011,
    title: "Modern 2-Bed Apartment in Bahria Town Highrise",
    listingType: "For Rent",
    propertyCategory: "Residential Flat",
    price: 65000,
    currency: "PKR",
    areaSize: 1100,
    areaUnit: "sqft",
    address: {
      city: "Rawalpindi",
      area: "Bahria Town Phase 7",
      line1: "Apex Heights Tower 2, 6th Floor",
      postalCode: "46620",
      latitude: 33.5373,
      longitude: 73.1181
    },
    bedrooms: 2,
    bathrooms: 2,
    floorLevel: 6,
    furnishing: "Furnished",
    yearBuilt: 2022,
    propertyCondition: "New",
    amenities: ["Lift", "Gym", "Generator Backup", "CCTV", "Gated Entrance"],
    features: ["Balcony", "Modern Kitchen", "Built-in Wardrobes"],
    tags: ["Family", "New Construction", "Highrise Living"],
    nearbyLandmarks: [
      { name: "Bahria Theme Park", distanceKm: 1.4 },
      { name: "Clock Tower Commercial", distanceKm: 2.2 }
    ],
    ownerType: "Owner",
    ownerDetails: {
      name: "Hassan Mir",
      phone: "+92-331-8890012",
      email: "hassan.mir@example.com"
    },
    contactVisibility: "Public",
    videoTour: "https://videos.example.com/apt2011.mp4",
    virtual3DTour: "https://vr.example.com/apt2011",
    energyRating: "A",
    waterSupply: "Available",
    electricityBackup: "Full",
    parkingSpaces: 1,
    description:
      "A newly constructed luxury 2-bedroom apartment featuring premium finishing, modern layout, and excellent building amenities.",
    datePosted: "2025-01-08T09:35:00Z",
    isFeatured: false,
    rating: 4.6,
    views: 431,
    images: [
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20e?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"
    ]
  },

  {
    id: 2012,
    title: "Commercial Showroom on Main University Road",
    listingType: "For Rent",
    propertyCategory: "Showroom",
    price: 285000,
    currency: "PKR",
    areaSize: 2600,
    areaUnit: "sqft",
    address: {
      city: "Karachi",
      area: "Gulshan-e-Iqbal Block 3",
      line1: "Business Point Plaza, Ground Floor",
      postalCode: "75300",
      latitude: 24.9152,
      longitude: 67.0867
    },
    bedrooms: 0,
    bathrooms: 1,
    floorLevel: 0,
    furnishing: "Semi-Furnished",
    yearBuilt: 2016,
    propertyCondition: "Renovated",
    amenities: ["Parking", "Glass Front", "Central AC", "Security Staff"],
    features: ["Prime Frontage", "Signage Space", "High Footfall"],
    tags: ["Retail", "Brand Outlet", "Main Road"],
    nearbyLandmarks: [
      { name: "NED University", distanceKm: 0.8 },
      { name: "Aladin Mall", distanceKm: 1.6 }
    ],
    ownerType: "Agent",
    ownerDetails: {
      name: "MetroBiz Consultants",
      phone: "+92-321-8809980",
      email: "contact@metrobiz.pk",
      agencyName: "MetroBiz Consultants"
    },
    contactVisibility: "Verified Users Only",
    videoTour: "https://videos.example.com/showroom2012.mp4",
    energyRating: "B",
    waterSupply: "Available",
    electricityBackup: "Partial",
    parkingSpaces: 3,
    description:
      "A spacious commercial showroom ideal for branded outlets, electronics, furniture, and high-volume retail operations.",
    datePosted: "2025-01-08T12:50:00Z",
    isFeatured: true,
    rating: 4.8,
    views: 778,
    images: [
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800",
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800"
    ]
  },

  {
    id: 2013,
    title: "Lake-View Farm House with Swimming Pool",
    listingType: "For Rent",
    propertyCategory: "Farm House",
    price: 160000,
    currency: "PKR",
    areaSize: 2,
    areaUnit: "acre",
    address: {
      city: "Islamabad",
      area: "Chak Shahzad",
      line1: "Lakeview Farms, Street 4",
      postalCode: "44000",
      latitude: 33.6731,
      longitude: 73.1578
    },
    bedrooms: 3,
    bathrooms: 4,
    floorLevel: null,
    furnishing: "Furnished",
    yearBuilt: 2019,
    propertyCondition: "Well-Maintained",
    amenities: ["Swimming Pool", "Lawn", "Farm Space", "Generator"],
    features: [
      "Lake View",
      "Outdoor Seating",
      "BBQ Area",
      "Guest Cottage"
    ],
    tags: ["Events", "Vacation", "Private"],
    nearbyLandmarks: [
      { name: "National Agricultural Research Center", distanceKm: 3.9 },
      { name: "Park View City Entrance", distanceKm: 5.2 }
    ],
    ownerType: "Owner",
    ownerDetails: {
      name: "Kamran Siddiqui",
      phone: "+92-345-1122339",
      email: "ksfarmhouses@example.com"
    },
    contactVisibility: "Public",
    videoTour: "https://videos.example.com/farm2013.mp4",
    virtual3DTour: "https://vr.example.com/farm2013",
    energyRating: "C",
    waterSupply: "Available",
    electricityBackup: "Full",
    parkingSpaces: 8,
    description:
      "A luxurious farm house perfect for weekend stays, small gatherings, or year-long rental. Featuring a large pool and scenic lake view.",
    datePosted: "2025-01-09T09:15:00Z",
    isFeatured: true,
    rating: 4.8,
    views: 902,
    images: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800",
      "https://images.unsplash.com/photo-1502673530728-f79b4cab31b1?w=800"
    ]
  },

  {
    id: 2014,
    title: "Brand New 5-Bed Luxury House in Bahria Orchard",
    listingType: "For Sale",
    propertyCategory: "Residential House",
    price: 32500000,
    currency: "PKR",
    areaSize: 10,
    areaUnit: "marla",
    address: {
      city: "Lahore",
      area: "Bahria Orchard Phase 2",
      line1: "Block G2, House 127",
      postalCode: "54000",
      latitude: 31.3371,
      longitude: 74.2022
    },
    bedrooms: 5,
    bathrooms: 6,
    floorLevel: null,
    furnishing: "Semi-Furnished",
    yearBuilt: 2024,
    propertyCondition: "New",
    amenities: ["Gated Community", "Mosque Nearby", "School Nearby"],
    features: [
      "Double Height Lobby",
      "Imported Tiles",
      "Servant Quarter",
      "Designer Kitchen"
    ],
    tags: ["Luxury", "Brand New", "Family Home"],
    nearbyLandmarks: [
      { name: "Bahria Hospital", distanceKm: 1.7 },
      { name: "Orchard Mall", distanceKm: 2.4 }
    ],
    ownerType: "Agent",
    ownerDetails: {
      name: "Property Hub",
      phone: "+92-301-4455113",
      email: "info@propertyhub.pk",
      agencyName: "Property Hub Lahore"
    },
    contactVisibility: "Verified Users Only",
    videoTour: "https://videos.example.com/house2014.mp4",
    energyRating: "A",
    waterSupply: "Available",
    electricityBackup: "Partial",
    parkingSpaces: 2,
    description:
      "A beautifully designed 5-bedroom luxury house located in a secure and premium community with modern amenities.",
    datePosted: "2025-01-09T11:35:00Z",
    isFeatured: true,
    rating: 5.0,
    views: 1103,
    images: [
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800",
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800"
    ]
  },

  {
    id: 2015,
    title: "Corporate Office Floor with 40 Workstations",
    listingType: "For Rent",
    propertyCategory: "Commercial Office",
    price: 420000,
    currency: "PKR",
    areaSize: 3900,
    areaUnit: "sqft",
    address: {
      city: "Karachi",
      area: "Shahrah-e-Faisal",
      line1: "Business Avenue Tower, 5th Floor",
      postalCode: "75200",
      latitude: 24.8661,
      longitude: 67.0789
    },
    bedrooms: 0,
    bathrooms: 3,
    floorLevel: 5,
    furnishing: "Furnished",
    yearBuilt: 2017,
    propertyCondition: "Renovated",
    amenities: [
      "High-Speed Elevators",
      "Security",
      "Generator",
      "Visitor Parking"
    ],
    features: [
      "Workstations Setup",
      "Glass Partitions",
      "Meeting Room",
      "Reception Area"
    ],
    tags: ["Corporate", "Ready to Move", "Prime Business Road"],
    nearbyLandmarks: [
      { name: "PF Museum", distanceKm: 1.6 },
      { name: "Nursery Market", distanceKm: 0.9 }
    ],
    ownerType: "Owner",
    ownerDetails: {
      name: "Ahsan Traders",
      phone: "+92-321-5577110",
      email: "ahsan.offices@example.com"
    },
    contactVisibility: "Public",
    energyRating: "B",
    waterSupply: "Available",
    electricityBackup: "Full",
    parkingSpaces: 4,
    description:
      "Fully furnished office floor ideal for IT, call centers, or corporate companies. Includes 40 ready-to-use workstations.",
    datePosted: "2025-01-09T16:20:00Z",
    isFeatured: false,
    rating: 4.7,
    views: 674,
    images: [
      "https://images.unsplash.com/photo-1507209696998-3c532be9b2b6?w=800",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800"
    ]
  },
  {
    id: 2016,
    title: "Furnished 2-Bed Apartment near Civic Center",
    listingType: "For Rent",
    propertyCategory: "Residential Flat",
    price: 42000,
    currency: "PKR",
    areaSize: 1150,
    areaUnit: "sqft",
    address: {
      city: "Karachi",
      area: "Gulshan-e-Iqbal",
      line1: "Civic Center Road, Block 14",
      postalCode: "75300",
      latitude: 24.9185,
      longitude: 67.0972
    },
    bedrooms: 2,
    bathrooms: 2,
    floorLevel: 3,
    furnishing: "Furnished",
    yearBuilt: 2018,
    propertyCondition: "Well-Maintained",
    amenities: ["Lift", "Security", "Parking"],
    features: ["Balcony", "Open Kitchen", "CCTV Cameras"],
    tags: ["Family", "Furnished"],
    nearbyLandmarks: [
      { name: "Expo Center", distanceKm: 1.2 },
      { name: "NED University", distanceKm: 2.0 }
    ],
    ownerType: "Owner",
    ownerDetails: {
      name: "Muhammad Imran",
      phone: "0300-4455667",
      email: "imran.owner@example.com"
    },
    contactVisibility: "Public",
    videoTour: undefined,
    virtual3DTour: undefined,
    energyRating: "C",
    waterSupply: "Available",
    electricityBackup: "Partial",
    parkingSpaces: 1,
    description: "A beautifully furnished apartment ideal for small families, with easy access to major educational and commercial areas.",
    datePosted: "2025-01-18T09:30:00Z",
    isFeatured: false,
    rating: 4.3,
    views: 150,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800"
    ]
  },

  {
    id: 2017,
    title: "Brand New 5-Marla House in Bahria Town Precinct 12",
    listingType: "For Sale",
    propertyCategory: "Residential House",
    price: 16500000,
    currency: "PKR",
    areaSize: 5,
    areaUnit: "marla",
    address: {
      city: "Karachi",
      area: "Bahria Town",
      line1: "Precinct 12, Ali Block",
      postalCode: "75340",
      latitude: 24.8741,
      longitude: 67.2574
    },
    bedrooms: 3,
    bathrooms: 4,
    floorLevel: null,
    furnishing: "Unfurnished",
    yearBuilt: 2024,
    propertyCondition: "New",
    amenities: ["Security", "Mosque", "Park"],
    features: ["Terrace", "Wide Car Porch"],
    tags: ["Brand New", "Corner House"],
    nearbyLandmarks: [
      { name: "Bahria Theme Park", distanceKm: 2.5 }
    ],
    ownerType: "Developer",
    ownerDetails: {
      name: "BTK Developers",
      phone: "0300-8882211",
      email: "sales@btk.com",
      agencyName: "BTK Developers"
    },
    contactVisibility: "Verified Users Only",
    energyRating: "B",
    waterSupply: "Available",
    electricityBackup: "Full",
    parkingSpaces: 2,
    description: "A newly built house in Ali Block offering peaceful surroundings and modern architecture.",
    datePosted: "2025-01-17T14:00:00Z",
    isFeatured: true,
    rating: 4.8,
    views: 322,
    images: [
      "https://images.unsplash.com/photo-1572120360623-9d0e4ccdbf9a?w=800",
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800"
    ]
  },

  {
    id: 2018,
    title: "High-Rise Office Floor in I.I. Chundrigar Road",
    listingType: "For Rent",
    propertyCategory: "Commercial Office",
    price: 180000,
    currency: "PKR",
    areaSize: 4500,
    areaUnit: "sqft",
    address: {
      city: "Karachi",
      area: "I.I. Chundrigar",
      line1: "Business Tower, 14th Floor",
      postalCode: "74000",
      latitude: 24.8527,
      longitude: 67.0096
    },
    bedrooms: 0,
    bathrooms: 3,
    floorLevel: 14,
    furnishing: "Semi-Furnished",
    yearBuilt: 2015,
    propertyCondition: "Renovated",
    amenities: ["High-Speed Elevators", "Backup Generator", "Security"],
    features: ["Server Room", "Conference Hall"],
    tags: ["Corporate", "Prime Location"],
    nearbyLandmarks: [
      { name: "State Bank", distanceKm: 0.5 }
    ],
    ownerType: "Agent",
    ownerDetails: {
      name: "Saad Realtors",
      phone: "0312-2201199",
      email: "contact@saadrealtors.com",
      agencyName: "Saad Realtors"
    },
    contactVisibility: "Public",
    energyRating: "C",
    electricityBackup: "Full",
    waterSupply: "Available",
    parkingSpaces: 4,
    description: "Ideal corporate workspace with panoramic city views and essential commercial facilities.",
    datePosted: "2025-01-16T11:15:00Z",
    isFeatured: false,
    rating: 4.1,
    views: 210,
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800"
    ]
  },

  {
    id: 2019,
    title: "Luxury Penthouse with Rooftop Pool in Clifton Block 5",
    listingType: "For Sale",
    propertyCategory: "Penthouse",
    price: 85000000,
    currency: "PKR",
    areaSize: 5000,
    areaUnit: "sqft",
    address: {
      city: "Karachi",
      area: "Clifton",
      line1: "Block 5, Beach Avenue Tower",
      postalCode: "75600",
      latitude: 24.8185,
      longitude: 67.0301
    },
    bedrooms: 4,
    bathrooms: 5,
    floorLevel: 18,
    furnishing: "Furnished",
    yearBuilt: 2023,
    propertyCondition: "New",
    amenities: ["Gym", "Infinity Pool", "Sauna", "24/7 Security"],
    features: ["Rooftop Pool", "Sea View", "Smart Home Automation"],
    tags: ["Luxury", "Sea Facing"],
    nearbyLandmarks: [
      { name: "Dolmen Mall", distanceKm: 1.8 }
    ],
    ownerType: "Owner",
    ownerDetails: {
      name: "Naveed Ali",
      phone: "0300-9997766",
      email: "naveed.penthouse@example.com"
    },
    contactVisibility: "Public",
    energyRating: "A",
    electricityBackup: "Full",
    waterSupply: "Available",
    parkingSpaces: 3,
    description: "A one-of-a-kind luxury penthouse offering world-class amenities and breathtaking uninterrupted sea views.",
    datePosted: "2025-01-15T16:45:00Z",
    isFeatured: true,
    rating: 4.9,
    views: 520,
    images: [
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?w=800",
      "https://images.unsplash.com/photo-1582407947304-7e3bd4b42a4a?w=800"
    ]
  },

  {
    id: 2020,
    title: "Standalone Warehouse near Port Qasim",
    listingType: "For Rent",
    propertyCategory: "Warehouse",
    price: 260000,
    currency: "PKR",
    areaSize: 20000,
    areaUnit: "sqft",
    address: {
      city: "Karachi",
      area: "Port Qasim",
      line1: "Eastern Industrial District",
      postalCode: "75030",
      latitude: 24.7811,
      longitude: 67.3396
    },
    bedrooms: 0,
    bathrooms: 1,
    floorLevel: null,
    furnishing: "Unfurnished",
    yearBuilt: 2014,
    propertyCondition: "Well-Maintained",
    amenities: ["Cargo Access", "Security", "Parking"],
    features: ["Docking Area", "High Ceilings"],
    tags: ["Industrial", "Logistics"],
    nearbyLandmarks: [
      { name: "Port Qasim Gate", distanceKm: 3.2 }
    ],
    ownerType: "Owner",
    ownerDetails: {
      name: "Zahid Logistics",
      phone: "0300-5577991",
      email: "contact@zahidlogistics.com"
    },
    contactVisibility: "Verified Users Only",
    energyRating: "D",
    electricityBackup: "Partial",
    waterSupply: "Available",
    parkingSpaces: 12,
    description: "A spacious warehouse perfect for distribution and industrial storage with easy access to port facilities.",
    datePosted: "2025-01-14T12:00:00Z",
    isFeatured: false,
    rating: 4.0,
    views: 198,
    images: [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800",
      "https://images.unsplash.com/photo-1553413077-190b305b2ea7?w=800"
    ]
  },

  {
    id: 2021,
    title: "Studio Apartment for Students in Gulistan-e-Johar Block 2",
    listingType: "For Rent",
    propertyCategory: "Studio",
    price: 18000,
    currency: "PKR",
    areaSize: 450,
    areaUnit: "sqft",
    address: {
      city: "Karachi",
      area: "Gulistan-e-Johar",
      line1: "Block 2, University Road",
      postalCode: "75290",
      latitude: 24.9189,
      longitude: 67.1300
    },
    bedrooms: 1,
    bathrooms: 1,
    floorLevel: 2,
    furnishing: "Semi-Furnished",
    yearBuilt: 2010,
    propertyCondition: "Well-Maintained",
    amenities: ["Security", "Lift"],
    features: ["Balcony"],
    tags: ["Student", "Affordable"],
    nearbyLandmarks: [
      { name: "Habib University", distanceKm: 1.1 }
    ],
    ownerType: "Owner",
    ownerDetails: {
      name: "Sohail Khan",
      phone: "0315-7788221",
      email: "sohail.rental@example.com"
    },
    contactVisibility: "Public",
    energyRating: "E",
    electricityBackup: "None",
    waterSupply: "Available",
    parkingSpaces: 0,
    description: "Affordable studio apartment ideal for students with basic furnishing, lift access, and close proximity to major universities.",
    datePosted: "2025-01-13T10:10:00Z",
    isFeatured: false,
    rating: 3.9,
    views: 140,
    images: [
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800",
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800"
    ]
  },
  
  {
    id: 2022,
    title: "Retail Outlet in Tariq Road Fashion District",
    listingType: "For Sale",
    propertyCategory: "Retail Outlet",
    price: 35000000,
    currency: "PKR",
    areaSize: 1300,
    areaUnit: "sqft",
    address: {
      city: "Karachi",
      area: "Tariq Road",
      line1: "Fashion Market Lane",
      postalCode: "75400",
      latitude: 24.8829,
      longitude: 67.0648
    },
    bedrooms: 0,
    bathrooms: 1,
    floorLevel: 1,
    furnishing: "Semi-Furnished",
    yearBuilt: 2017,
    propertyCondition: "Well-Maintained",
    amenities: ["Parking", "Security"],
    features: ["Glass Front", "Display Shelves"],
    tags: ["Retail", "Commercial Hotspot"],
    nearbyLandmarks: [
      { name: "Dolmen Mall Tariq Road", distanceKm: 0.9 }
    ],
    ownerType: "Owner",
    ownerDetails: {
      name: "Maria Traders",
      phone: "0300-4455221",
      email: "maria@traders.com"
    },
    contactVisibility: "Verified Users Only",
    energyRating: "B",
    electricityBackup: "Partial",
    waterSupply: "Available",
    parkingSpaces: 2,
    description: "Prime retail outlet ideal for clothing, footwear, or electronics in Karachi’s busiest shopping zone.",
    datePosted: "2025-01-12T09:00:00Z",
    isFeatured: true,
    rating: 4.5,
    views: 389,
    images: [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800"
    ]
  },

  {
    id: 2023,
    title: "Farm House with Swimming Pool on Northern Bypass",
    listingType: "For Rent",
    propertyCategory: "Farm House",
    price: 125000,
    currency: "PKR",
    areaSize: 22000,
    areaUnit: "sqft",
    address: {
      city: "Karachi",
      area: "Northern Bypass",
      line1: "Green Avenue Farms",
      postalCode: "75850",
      latitude: 25.0000,
      longitude: 67.2001
    },
    bedrooms: 3,
    bathrooms: 4,
    floorLevel: null,
    furnishing: "Furnished",
    yearBuilt: 2019,
    propertyCondition: "Well-Maintained",
    amenities: ["Swimming Pool", "Garden", "BBQ Area"],
    features: ["Event Space", "Play Area"],
    tags: ["Farm House", "Event Friendly"],
    nearbyLandmarks: [
      { name: "Northern Bypass Toll Plaza", distanceKm: 4.5 }
    ],
    ownerType: "Owner",
    ownerDetails: {
      name: "FarmStay Pvt. Ltd.",
      phone: "0321-1113344",
      email: "info@farmstay.com"
    },
    contactVisibility: "Public",
    energyRating: "C",
    electricityBackup: "Full",
    waterSupply: "Available",
    parkingSpaces: 10,
    description: "A relaxing farm house perfect for events and weekend stays with large open garden and private swimming pool.",
    datePosted: "2025-01-11T14:20:00Z",
    isFeatured: true,
    rating: 4.7,
    views: 502,
    images: [
      "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800",
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800"
    ]
  },

  {
    id: 2024,
    title: "4-Bed Large Bungalow in DHA Phase 7 Extension",
    listingType: "For Sale",
    propertyCategory: "Residential House",
    price: 56500000,
    currency: "PKR",
    areaSize: 5000,
    areaUnit: "sqft",
    address: {
      city: "Karachi",
      area: "DHA Phase 7 Ext",
      line1: "Khayaban-e-Shaheen",
      postalCode: "75500",
      latitude: 24.8045,
      longitude: 67.0780
    },
    bedrooms: 4,
    bathrooms: 6,
    floorLevel: null,
    furnishing: "Unfurnished",
    yearBuilt: 2020,
    propertyCondition: "Well-Maintained",
    amenities: ["Servant Quarter", "Garage", "Garden"],
    features: ["Wide Frontage", "Solar Backup"],
    tags: ["Luxury", "DHA"],
    nearbyLandmarks: [
      { name: "Creek Vista", distanceKm: 2.3 }
    ],
    ownerType: "Owner",
    ownerDetails: {
      name: "Ahmed Estate Holdings",
      phone: "0310-2233445",
      email: "contact@ahmedholdings.com"
    },
    contactVisibility: "Verified Users Only",
    energyRating: "B",
    electricityBackup: "Partial",
    waterSupply: "Available",
    parkingSpaces: 4,
    description: "Spacious luxury bungalow with wide frontage, generous rooms, and high-end finishing in DHA’s premium locality.",
    datePosted: "2025-01-10T16:00:00Z",
    isFeatured: true,
    rating: 4.6,
    views: 350,
    images: [
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"
    ]
  },

  {
    id: 2025,
    title: "Corner Commercial Shop in Saddar Empress Market Zone",
    listingType: "For Rent",
    propertyCategory: "Commercial Shop",
    price: 90000,
    currency: "PKR",
    areaSize: 900,
    areaUnit: "sqft",
    address: {
      city: "Karachi",
      area: "Saddar",
      line1: "Empress Market Road",
      postalCode: "74400",
      latitude: 24.8521,
      longitude: 67.0169
    },
    bedrooms: 0,
    bathrooms: 1,
    floorLevel: 0,
    furnishing: "Unfurnished",
    yearBuilt: 2012,
    propertyCondition: "Renovated",
    amenities: ["Security", "Parking"],
    features: ["Glass Front", "Corner Frontage"],
    tags: ["High Footfall", "Retail"],
    nearbyLandmarks: [
      { name: "Empress Market", distanceKm: 0.1 }
    ],
    ownerType: "Agent",
    ownerDetails: {
      name: "Karachi Commercial Deals",
      phone: "0300-1122334",
      email: "info@kcd.com",
      agencyName: "KCD Pvt. Ltd."
    },
    contactVisibility: "Public",
    energyRating: "E",
    electricityBackup: "None",
    waterSupply: "Available",
    parkingSpaces: 1,
    description: "A highly visible corner shop with newly renovated interior suitable for retail, cosmetics, and small electronics.",
    datePosted: "2025-01-09T13:45:00Z",
    isFeatured: false,
    rating: 4.2,
    views: 265,
    images: [
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800",
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800"
    ]
  },

  {
    id: 2026,
    title: "Modern Studio Apartment in PECHS Block 2",
    listingType: "For Rent",
    propertyCategory: "Studio",
    price: 25000,
    currency: "PKR",
    areaSize: 600,
    areaUnit: "sqft",
    address: {
      city: "Karachi",
      area: "PECHS",
      line1: "Block 2 - Main Shahrah-e-Faisal",
      postalCode: "75400",
      latitude: 24.8708,
      longitude: 67.0637
    },
    bedrooms: 1,
    bathrooms: 1,
    floorLevel: 4,
    furnishing: "Semi-Furnished",
    yearBuilt: 2016,
    propertyCondition: "Well-Maintained",
    amenities: ["Lift", "CCTV"],
    features: ["Open Kitchen"],
    tags: ["Corporate Rental", "Student Friendly"],
    nearbyLandmarks: [
      { name: "Nursery Market", distanceKm: 0.9 }
    ],
    ownerType: "Owner",
    ownerDetails: {
      name: "Rashid Ali",
      phone: "0305-9988112",
      email: "rashid.studio@example.com"
    },
    contactVisibility: "Public",
    energyRating: "D",
    electricityBackup: "Partial",
    waterSupply: "Available",
    parkingSpaces: 0,
    description: "A neat and modern studio ideal for individuals or students looking for central location access.",
    datePosted: "2025-01-08T10:20:00Z",
    isFeatured: false,
    rating: 4.0,
    views: 198,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800"
    ]
  },

  {
    id: 2027,
    title: "Corporate Tower Floor for Rent in Shahrah-e-Faisal",
    listingType: "For Rent",
    propertyCategory: "Corporate Tower",
    price: 350000,
    currency: "PKR",
    areaSize: 7000,
    areaUnit: "sqft",
    address: {
      city: "Karachi",
      area: "Shahrah-e-Faisal",
      line1: "Business Square Tower",
      postalCode: "75430",
      latitude: 24.8607,
      longitude: 67.0711
    },
    bedrooms: 0,
    bathrooms: 4,
    floorLevel: 8,
    furnishing: "Unfurnished",
    yearBuilt: 2021,
    propertyCondition: "New",
    amenities: [
      "High-Speed Elevators",
      "Fire Safety System",
      "Parking",
      "Security"
    ],
    features: ["Glass Partition Ready", "Corporate Lobby"],
    tags: ["Corporate", "Prime Commercial"],
    nearbyLandmarks: [
      { name: "FTC Building", distanceKm: 0.5 }
    ],
    ownerType: "Owner",
    ownerDetails: {
      name: "Faisal Business Group",
      phone: "021-33445566",
      email: "sales@fbg.com"
    },
    contactVisibility: "Verified Users Only",
    energyRating: "A",
    electricityBackup: "Full",
    waterSupply: "Available",
    parkingSpaces: 10,
    description: "A prestigious corporate tower floor ideal for multinational companies with premium facilities.",
    datePosted: "2025-01-07T09:40:00Z",
    isFeatured: true,
    rating: 4.8,
    views: 601,
    images: [
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800",
      "https://images.unsplash.com/photo-1554050857-c84a8abdb5e2?w=800"
    ]
  },

  {
    id: 2028,
    title: "Factory Unit in Korangi Industrial Area Sector 18",
    listingType: "For Sale",
    propertyCategory: "Factory",
    price: 48000000,
    currency: "PKR",
    areaSize: 16000,
    areaUnit: "sqft",
    address: {
      city: "Karachi",
      area: "Korangi",
      line1: "Industrial Area Sector 18",
      postalCode: "74900",
      latitude: 24.8271,
      longitude: 67.1325
    },
    bedrooms: 0,
    bathrooms: 2,
    floorLevel: null,
    furnishing: "Unfurnished",
    yearBuilt: 2008,
    propertyCondition: "Renovated",
    amenities: ["Security", "Parking"],
    features: ["Loading Ramp", "Power Room"],
    tags: ["Industrial", "Manufacturing"],
    nearbyLandmarks: [
      { name: "Korangi Fire Station", distanceKm: 1.8 }
    ],
    ownerType: "Agent",
    ownerDetails: {
      name: "Industrial Brokers Ltd.",
      phone: "0300-8899223",
      email: "sales@ibl.com",
      agencyName: "IBL"
    },
    contactVisibility: "Public",
    energyRating: "D",
    electricityBackup: "Full",
    waterSupply: "Available",
    parkingSpaces: 15,
    description: "A large renovated factory unit perfect for manufacturing, packaging, or warehousing operations.",
    datePosted: "2025-01-06T12:30:00Z",
    isFeatured: false,
    rating: 4.1,
    views: 255,
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800"
    ]
  },

  {
    id: 2029,
    title: "Luxury 3-Bed Apartment in Navy Housing Scheme Karsaz",
    listingType: "For Sale",
    propertyCategory: "Residential Flat",
    price: 26500000,
    currency: "PKR",
    areaSize: 2100,
    areaUnit: "sqft",
    address: {
      city: "Karachi",
      area: "Karsaz",
      line1: "NHS Phase 4",
      postalCode: "75530",
      latitude: 24.8986,
      longitude: 67.0644
    },
    bedrooms: 3,
    bathrooms: 4,
    floorLevel: 7,
    furnishing: "Furnished",
    yearBuilt: 2022,
    propertyCondition: "New",
    amenities: ["Gym", "Community Hall", "Security"],
    features: ["Maid Room", "Corner Unit"],
    tags: ["Luxury", "Secure Community"],
    nearbyLandmarks: [
      { name: "Karsaz Flyover", distanceKm: 1.3 }
    ],
    ownerType: "Owner",
    ownerDetails: {
      name: "Hassan Ali",
      phone: "0302-8811222",
      email: "hassan.nhs@example.com"
    },
    contactVisibility: "Public",
    energyRating: "A",
    electricityBackup: "Full",
    waterSupply: "Available",
    parkingSpaces: 2,
    description: "A modern luxury flat located in a highly secure naval community with premium finishing.",
    datePosted: "2025-01-05T11:00:00Z",
    isFeatured: true,
    rating: 4.7,
    views: 340,
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"
    ]
  },

  {
    id: 2030,
    title: "Showroom Space on Main Rashid Minhas Road",
    listingType: "For Rent",
    propertyCategory: "Showroom",
    price: 140000,
    currency: "PKR",
    areaSize: 2600,
    areaUnit: "sqft",
    address: {
      city: "Karachi",
      area: "Rashid Minhas",
      line1: "Main Road Opposite Millennium Mall",
      postalCode: "75350",
      latitude: 24.9200,
      longitude: 67.1200
    },
    bedrooms: 0,
    bathrooms: 1,
    floorLevel: 0,
    furnishing: "Unfurnished",
    yearBuilt: 2013,
    propertyCondition: "Well-Maintained",
    amenities: ["Parking", "Security"],
    features: ["Wide Front", "Double Height Ceiling"],
    tags: ["Showroom", "High Visibility"],
    nearbyLandmarks: [
      { name: "Millennium Mall", distanceKm: 0.2 }
    ],
    ownerType: "Agent",
    ownerDetails: {
      name: "MM Commercial Deals",
      phone: "0301-5577221",
      email: "info@mmdeals.com",
      agencyName: "MM Deals"
    },
    contactVisibility: "Public",
    energyRating: "C",
    electricityBackup: "Partial",
    waterSupply: "Available",
    parkingSpaces: 4,
    description: "A prime showroom location suitable for branded outlets with excellent visibility.",
    datePosted: "2025-01-04T08:55:00Z",
    isFeatured: false,
    rating: 4.4,
    views: 278,
    images: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800"
    ]
  },

  {
    id: 2031,
    title: "3-Bed Stylish Apartment in Gulberg Renovated Tower",
    listingType: "For Rent",
    propertyCategory: "Residential Flat",
    price: 55000,
    currency: "PKR",
    areaSize: 1700,
    areaUnit: "sqft",
    address: {
      city: "Karachi",
      area: "Gulberg",
      line1: "Block 13, Renovated Tower",
      postalCode: "75330",
      latitude: 24.9400,
      longitude: 67.0850
    },
    bedrooms: 3,
    bathrooms: 3,
    floorLevel: 5,
    furnishing: "Semi-Furnished",
    yearBuilt: 2011,
    propertyCondition: "Renovated",
    amenities: ["Lift", "Security"],
    features: ["Balcony", "Wardrobes"],
    tags: ["Renovated", "Family"],
    nearbyLandmarks: [
      { name: "Gulberg Park", distanceKm: 1.1 }
    ],
    ownerType: "Owner",
    ownerDetails: {
      name: "Sadia Irfan",
      phone: "0312-8811334",
      email: "sadia.properties@example.com"
    },
    contactVisibility: "Public",
    energyRating: "D",
    electricityBackup: "None",
    waterSupply: "Available",
    parkingSpaces: 1,
    description: "A spacious and renovated flat perfect for families, located in a peaceful and central society.",
    datePosted: "2025-01-03T12:10:00Z",
    isFeatured: false,
    rating: 4.2,
    views: 180,
    images: [
      "https://images.unsplash.com/photo-1582407947304-7e3bd4b42a4a?w=800",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"
    ]
  },

  {
    id: 2032,
    title: "Industrial Plot for Sale in SITE Super Highway",
    listingType: "For Sale",
    propertyCategory: "Industrial Plot",
    price: 32000000,
    currency: "PKR",
    areaSize: 18000,
    areaUnit: "sqft",
    address: {
      city: "Karachi",
      area: "SITE",
      line1: "Super Highway Industrial Estate",
      postalCode: "75380",
      latitude: 24.9600,
      longitude: 67.1700
    },
    bedrooms: 0,
    bathrooms: 0,
    floorLevel: null,
    furnishing: "Unfurnished",
    yearBuilt: 0,
    propertyCondition: "New",
    amenities: ["Security"],
    features: ["Main Road Facing"],
    tags: ["Industrial", "Investment"],
    nearbyLandmarks: [
      { name: "SITE Police Station", distanceKm: 1.9 }
    ],
    ownerType: "Owner",
    ownerDetails: {
      name: "Faisal Industries",
      phone: "0306-1122112",
      email: "faisal.industries@example.com"
    },
    contactVisibility: "Public",
    energyRating: "E",
    electricityBackup: "None",
    waterSupply: "Not Available",
    parkingSpaces: 10,
    description: "A commercial industrial plot with excellent access to Super Highway, ideal for factories and warehouses.",
    datePosted: "2025-01-02T14:00:00Z",
    isFeatured: false,
    rating: 4.0,
    views: 220,
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800"
    ]
  },

  {
    id: 2033,
    title: "2-Bed Furnished Flat in Clifton Pearl Residency",
    listingType: "For Rent",
    propertyCategory: "Residential Flat",
    price: 65000,
    currency: "PKR",
    areaSize: 1450,
    areaUnit: "sqft",
    address: {
      city: "Karachi",
      area: "Clifton",
      line1: "Block 7 Pearl Residency",
      postalCode: "75600",
      latitude: 24.8201,
      longitude: 67.0377
    },
    bedrooms: 2,
    bathrooms: 2,
    floorLevel: 6,
    furnishing: "Furnished",
    yearBuilt: 2018,
    propertyCondition: "Well-Maintained",
    amenities: ["Lift", "Parking", "Gym"],
    features: ["Sea Breeze", "Modern Kitchen"],
    tags: ["Furnished", "Family"],
    nearbyLandmarks: [
      { name: "Boat Basin", distanceKm: 1.4 }
    ],
    ownerType: "Owner",
    ownerDetails: {
      name: "Farah Ahmed",
      phone: "0309-4455991",
      email: "farah.clifton@example.com"
    },
    contactVisibility: "Public",
    energyRating: "C",
    electricityBackup: "Full",
    waterSupply: "Available",
    parkingSpaces: 1,
    description: "A fully furnished tasteful apartment located in a peaceful and premium Clifton neighborhood.",
    datePosted: "2025-01-01T15:05:00Z",
    isFeatured: false,
    rating: 4.3,
    views: 230,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800"
    ]
  },

  {
    id: 2034,
    title: "5-Marla Modern House for Sale in North Karachi Sector 11-A",
    listingType: "For Sale",
    propertyCategory: "Residential House",
    price: 11800000,
    currency: "PKR",
    areaSize: 5,
    areaUnit: "marla",
    address: {
      city: "Karachi",
      area: "North Karachi",
      line1: "Sector 11-A",
      postalCode: "75870",
      latitude: 24.9700,
      longitude: 67.0600
    },
    bedrooms: 3,
    bathrooms: 4,
    floorLevel: null,
    furnishing: "Unfurnished",
    yearBuilt: 2014,
    propertyCondition: "Well-Maintained",
    amenities: ["Parking", "Security"],
    features: ["Terrace", "Tile Flooring"],
    tags: ["Budget", "Family"],
    nearbyLandmarks: [
      { name: "UP Mor", distanceKm: 2.1 }
    ],
    ownerType: "Owner",
    ownerDetails: {
      name: "Noman Khan",
      phone: "0341-2277880",
      email: "noman.house@example.com"
    },
    contactVisibility: "Public",
    energyRating: "D",
    electricityBackup: "None",
    waterSupply: "Available",
    parkingSpaces: 1,
    description: "A well-maintained family house located in a peaceful neighborhood with wide streets and secure surroundings.",
    datePosted: "2024-12-30T14:30:00Z",
    isFeatured: false,
    rating: 4.1,
    views: 178,
    images: [
      "https://images.unsplash.com/photo-1572120360623-9d0e4ccdbf9a?w=800",
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800"
    ]
  },

  {
    id: 2035,
    title: "Corner Showroom Facing Main Nazimabad No. 7",
    listingType: "For Rent",
    propertyCategory: "Showroom",
    price: 110000,
    currency: "PKR",
    areaSize: 2000,
    areaUnit: "sqft",
    address: {
      city: "Karachi",
      area: "Nazimabad",
      line1: "Main Road, No. 7 Stop",
      postalCode: "74600",
      latitude: 24.9351,
      longitude: 67.0260
    },
    bedrooms: 0,
    bathrooms: 1,
    floorLevel: 0,
    furnishing: "Unfurnished",
    yearBuilt: 2010,
    propertyCondition: "Well-Maintained",
    amenities: ["Parking", "Security"],
    features: ["Corner Location", "Glass Windows"],
    tags: ["Commercial", "High Footfall"],
    nearbyLandmarks: [
      { name: "Nazimabad Eidgah", distanceKm: 0.7 }
    ],
    ownerType: "Agent",
    ownerDetails: {
      name: "Nazimabad Property Hub",
      phone: "0342-5566778",
      email: "contact@nph.com",
      agencyName: "NPH Real Estate"
    },
    contactVisibility: "Public",
    energyRating: "E",
    electricityBackup: "None",
    waterSupply: "Available",
    parkingSpaces: 3,
    description: "A well-located commercial showroom ideal for furniture, electronics, or accessories.",
    datePosted: "2024-12-29T11:40:00Z",
    isFeatured: false,
    rating: 4.2,
    views: 202,
    images: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800"
    ]
  },
];
// ---------------------------------------------------------------
// ---------------------------------------------------------------
// ---------------------------------------------------------------


// export interface Property {
//   id: number;
//   title: string;
//   listingType: 'For Sale' | 'For Rent' | 'Auction' | 'Short Term Rent';
//   propertyCategory:
//     | 'Residential Flat'
//     | 'Residential House'
//     | 'Commercial Shop'
//     | 'Commercial Office'
//     | 'Industrial Plot'
//     | 'Farm House'
//     | 'Warehouse'
//     | 'Penthouse'
//     | 'Studio'
//     | 'Retail Outlet'
//     | 'Showroom'
//     | 'Corporate Tower'
//     | 'Factory';

//   price: number;
//   currency: string;
//   areaSize: number;
//   areaUnit: 'sqft' | 'sq-yard' | 'acre' | 'kanal' | 'marla';
  
//   address: {
//     city: string;
//     area: string;
//     line1: string;
//     postalCode: string;
//     latitude: number;
//     longitude: number;
//   };

//   bedrooms: number;
//   bathrooms: number;
//   floorLevel: number | null;
//   furnishing: 'Furnished' | 'Semi-Furnished' | 'Unfurnished';

//   yearBuilt: number;
//   propertyCondition: 'New' | 'Renovated' | 'Well-Maintained' | 'Old';

//   amenities: string[]; 
//   features: string[]; 
//   tags: string[];

//   nearbyLandmarks: {
//     name: string;
//     distanceKm: number;
//   }[];

//   ownerType: 'Owner' | 'Agent' | 'Developer';
//   ownerDetails: {
//     name: string;
//     phone: string;
//     email: string;
//     agencyName?: string;
//   };

//   contactVisibility: 'Public' | 'Verified Users Only';

//   videoTour?: string;
//   virtual3DTour?: string;

//   energyRating?: 'A' | 'B' | 'C' | 'D' | 'E';
//   waterSupply: 'Available' | 'Not Available';
//   electricityBackup: 'None' | 'Partial' | 'Full';
//   parkingSpaces: number;

//   description: string;
//   datePosted: string;
//   isFeatured: boolean;

//   rating?: number;  
//   views: number;
//   images: string[];
// }
// export const PROPERTIES_CHUNK_1: Property[] = [
//   {
//     id: 2001,
//     title: "Modern 3-Bed Apartment with Park View",
//     listingType: "For Sale",
//     propertyCategory: "Residential Flat",
//     price: 14500000,
//     currency: "PKR",
//     areaSize: 1650,
//     areaUnit: "sqft",
//     address: {
//       city: "Karachi",
//       area: "Gulshan-e-Iqbal Block 2",
//       line1: "Park View Residency, 7th Floor",
//       postalCode: "75300",
//       latitude: 24.9201,
//       longitude: 67.0922
//     },
//     bedrooms: 3,
//     bathrooms: 3,
//     floorLevel: 7,
//     furnishing: "Semi-Furnished",
//     yearBuilt: 2020,
//     propertyCondition: "Well-Maintained",
//     amenities: ["Lift", "Parking", "Security", "Standby Generator"],
//     features: ["Corner Unit", "Park-Facing Balcony", "Imported Kitchen"],
//     tags: ["Family", "Prime Location", "Near University Road"],
//     nearbyLandmarks: [
//       { name: "Aladin Park", distanceKm: 1.2 },
//       { name: "Karachi University", distanceKm: 2.5 }
//     ],
//     ownerType: "Owner",
//     ownerDetails: {
//       name: "Faisal Ahmed",
//       phone: "+92-300-1234567",
//       email: "faisal.owner@example.com"
//     },
//     contactVisibility: "Public",
//     videoTour: "https://videos.example.com/apt2001.mp4",
//     virtual3DTour: "https://vr.example.com/tour2001",
//     energyRating: "B",
//     waterSupply: "Available",
//     electricityBackup: "Full",
//     parkingSpaces: 1,
//     description:
//       "A beautifully maintained apartment overlooking a lush green park. Spacious layout, modern fittings, dedicated parking, and uninterrupted utilities.",
//     datePosted: "2025-01-03T10:05:00Z",
//     isFeatured: true,
//     rating: 4.8,
//     views: 512,
//     images: [
//       "https://images.unsplash.com/photo-1560185008-b033106af41d?w=800",
//       "https://images.unsplash.com/photo-1586105251261-72a756497a12?w=800"
//     ]
//   },

//   {
//     id: 2002,
//     title: "Luxury Bungalow with Swimming Pool",
//     listingType: "For Sale",
//     propertyCategory: "Residential House",
//     price: 98000000,
//     currency: "PKR",
//     areaSize: 600,
//     areaUnit: "sq-yard",
//     address: {
//       city: "Lahore",
//       area: "DHA Phase 6",
//       line1: "Street 12, Sector G",
//       postalCode: "54000",
//       latitude: 31.4891,
//       longitude: 74.4042
//     },
//     bedrooms: 5,
//     bathrooms: 6,
//     floorLevel: null,
//     furnishing: "Furnished",
//     yearBuilt: 2023,
//     propertyCondition: "New",
//     amenities: ["Swimming Pool", "Gym", "Basement", "Solar Panels"],
//     features: [
//       "Home Theater",
//       "Imported Flooring",
//       "Smart Home System",
//       "Landscaped Garden"
//     ],
//     tags: ["Luxury", "High-End", "New Construction"],
//     nearbyLandmarks: [
//       { name: "DHA Raya Golf Club", distanceKm: 1.1 },
//       { name: "Lahore Ring Road", distanceKm: 2.7 }
//     ],
//     ownerType: "Agent",
//     ownerDetails: {
//       name: "Zain Malik",
//       phone: "+92-322-4455566",
//       email: "zain.realtor@example.com",
//       agencyName: "Skyline Realtors"
//     },
//     contactVisibility: "Verified Users Only",
//     videoTour: "https://videos.example.com/house2002.mp4",
//     virtual3DTour: "https://vr.example.com/tour2002",
//     energyRating: "A",
//     waterSupply: "Available",
//     electricityBackup: "Full",
//     parkingSpaces: 4,
//     description:
//       "A state-of-the-art bungalow featuring luxury interiors, imported fittings, and a private pool. A rare opportunity to own a premium residence in DHA.",
//     datePosted: "2025-01-03T11:30:00Z",
//     isFeatured: true,
//     rating: 4.9,
//     views: 904,
//     images: [
//       "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800",
//       "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800"
//     ]
//   },

//   {
//     id: 2003,
//     title: "Commercial Office Space in Blue Area",
//     listingType: "For Rent",
//     propertyCategory: "Commercial Office",
//     price: 350000,
//     currency: "PKR",
//     areaSize: 4200,
//     areaUnit: "sqft",
//     address: {
//       city: "Islamabad",
//       area: "Blue Area",
//       line1: "Jinnah Avenue Tower, 9th Floor",
//       postalCode: "44000",
//       latitude: 33.7081,
//       longitude: 73.0652
//     },
//     bedrooms: 0,
//     bathrooms: 4,
//     floorLevel: 9,
//     furnishing: "Semi-Furnished",
//     yearBuilt: 2018,
//     propertyCondition: "Well-Maintained",
//     amenities: [
//       "High-Speed Elevators",
//       "Fire Safety System",
//       "Underground Parking",
//       "Backup Power"
//     ],
//     features: ["Glass Partitioning", "Server Room", "Conference Hall"],
//     tags: ["Corporate", "Prime Location", "Commercial Hub"],
//     nearbyLandmarks: [
//       { name: "Centaurus Mall", distanceKm: 1.8 },
//       { name: "Metro Bus Station", distanceKm: 0.4 }
//     ],
//     ownerType: "Developer",
//     ownerDetails: {
//       name: "Capital Developers",
//       phone: "+92-51-8899001",
//       email: "info@capitaldev.pk",
//       agencyName: "Capital Developers Pvt Ltd"
//     },
//     contactVisibility: "Public",
//     videoTour: "https://videos.example.com/office2003.mp4",
//     virtual3DTour: "https://vr.example.com/office2003",
//     energyRating: "A",
//     waterSupply: "Available",
//     electricityBackup: "Full",
//     parkingSpaces: 6,
//     description:
//       "Premium office space ideal for corporate setups. Excellent visibility, secure building, and uninterrupted utilities.",
//     datePosted: "2025-01-04T09:25:00Z",
//     isFeatured: false,
//     rating: 4.7,
//     views: 389,
//     images: [
//       "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
//       "https://images.unsplash.com/photo-1507209696998-3c532be9b2b6?w=800"
//     ]
//   },

//   {
//     id: 2004,
//     title: "Warehouse Space with Loading Dock",
//     listingType: "For Rent",
//     propertyCategory: "Warehouse",
//     price: 180000,
//     currency: "PKR",
//     areaSize: 18000,
//     areaUnit: "sqft",
//     address: {
//       city: "Faisalabad",
//       area: "Industrial Estate",
//       line1: "Plot 92, Main Industrial Road",
//       postalCode: "38000",
//       latitude: 31.4181,
//       longitude: 73.0790
//     },
//     bedrooms: 0,
//     bathrooms: 2,
//     floorLevel: null,
//     furnishing: "Unfurnished",
//     yearBuilt: 2015,
//     propertyCondition: "Well-Maintained",
//     amenities: ["Security", "Wide Entrance", "Truck Parking", "Water Line"],
//     features: ["High Ceilings", "Ventilation System", "Loading Dock"],
//     tags: ["Warehouse", "Industry", "Logistics"],
//     nearbyLandmarks: [
//       { name: "M3 Industrial Zone", distanceKm: 3.2 },
//       { name: "Dry Port", distanceKm: 5.1 }
//     ],
//     ownerType: "Owner",
//     ownerDetails: {
//       name: "Bilal Traders",
//       phone: "+92-300-8899221",
//       email: "bilal.traders@example.com"
//     },
//     contactVisibility: "Public",
//     waterSupply: "Available",
//     electricityBackup: "Partial",
//     parkingSpaces: 10,
//     description:
//       "Spacious warehouse ideal for storage, logistics, or manufacturing. Easy truck access with ample parking.",
//     datePosted: "2025-01-04T13:50:00Z",
//     isFeatured: false,
//     rating: 4.5,
//     views: 243,
//     images: [
//       "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800",
//       "https://images.unsplash.com/photo-1553413077-190b305b2ea7?w=800"
//     ]
//   },

//   {
//     id: 2005,
//     title: "Contemporary 1-Bed Studio Apartment",
//     listingType: "For Rent",
//     propertyCategory: "Studio",
//     price: 38000,
//     currency: "PKR",
//     areaSize: 525,
//     areaUnit: "sqft",
//     address: {
//       city: "Islamabad",
//       area: "Bahria Town Phase 4",
//       line1: "Civic Center, Block A",
//       postalCode: "46220",
//       latitude: 33.5684,
//       longitude: 73.1231
//     },
//     bedrooms: 1,
//     bathrooms: 1,
//     floorLevel: 3,
//     furnishing: "Furnished",
//     yearBuilt: 2022,
//     propertyCondition: "New",
//     amenities: ["Lift", "CCTV", "Generator", "Reception Desk"],
//     features: ["Wooden Flooring", "Balcony", "Modern Kitchen"],
//     tags: ["Students", "Small Family", "Budget-Friendly"],
//     nearbyLandmarks: [
//       { name: "Civic Center Park", distanceKm: 0.3 },
//       { name: "Safari Club", distanceKm: 1.8 }
//     ],
//     ownerType: "Owner",
//     ownerDetails: {
//       name: "Noman Shah",
//       phone: "+92-312-7891122",
//       email: "noman.apartments@example.com"
//     },
//     contactVisibility: "Public",
//     videoTour: "https://videos.example.com/studio2005.mp4",
//     virtual3DTour: "https://vr.example.com/studio2005",
//     energyRating: "A",
//     waterSupply: "Available",
//     electricityBackup: "Full",
//     parkingSpaces: 1,
//     description:
//       "A modern studio apartment ideal for individuals looking for comfort and convenience. Located in one of Bahria Town's most accessible neighborhoods.",
//     datePosted: "2025-01-05T09:50:00Z",
//     isFeatured: true,
//     rating: 4.9,
//     views: 654,
//     images: [
//       "https://images.unsplash.com/photo-1598928506311-c55ded91a20e?w=800",
//       "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"
//     ]
//   }
// ];
// export const PROPERTIES_CHUNK_2: Property[] = [
//   {
//     id: 2006,
//     title: "Spacious 4-Bed Duplex Apartment with City Skyline View",
//     listingType: "For Sale",
//     propertyCategory: "Residential Flat",
//     price: 26500000,
//     currency: "PKR",
//     areaSize: 2450,
//     areaUnit: "sqft",
//     address: {
//       city: "Karachi",
//       area: "Clifton Block 4",
//       line1: "Skyline Residency, Tower B, 12th Floor",
//       postalCode: "75600",
//       latitude: 24.8134,
//       longitude: 67.0323
//     },
//     bedrooms: 4,
//     bathrooms: 5,
//     floorLevel: 12,
//     furnishing: "Semi-Furnished",
//     yearBuilt: 2021,
//     propertyCondition: "Well-Maintained",
//     amenities: [
//       "Swimming Pool",
//       "Gym",
//       "Covered Parking",
//       "24/7 Security",
//       "Reception Lobby"
//     ],
//     features: [
//       "Duplex Layout",
//       "Panoramic Windows",
//       "Imported Fittings",
//       "Private Maid Room"
//     ],
//     tags: ["Sea View", "Prime Area", "Luxury Living"],
//     nearbyLandmarks: [
//       { name: "Sea View Beach", distanceKm: 0.7 },
//       { name: "Dolmen Mall", distanceKm: 1.3 }
//     ],
//     ownerType: "Owner",
//     ownerDetails: {
//       name: "Maria Khan",
//       phone: "+92-300-9988776",
//       email: "maria.property@example.com"
//     },
//     contactVisibility: "Public",
//     videoTour: "https://videos.example.com/duplex2006.mp4",
//     virtual3DTour: "https://vr.example.com/duplex2006",
//     energyRating: "B",
//     waterSupply: "Available",
//     electricityBackup: "Full",
//     parkingSpaces: 2,
//     description:
//       "A luxurious duplex apartment offering breathtaking views of the city skyline. Perfect for families who desire comfort, security, and modern amenities.",
//     datePosted: "2025-01-06T14:15:00Z",
//     isFeatured: true,
//     rating: 4.8,
//     views: 762,
//     images: [
//       "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
//       "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"
//     ]
//   },

//   {
//     id: 2007,
//     title: "Industrial Factory Unit with Heavy Power Load",
//     listingType: "For Sale",
//     propertyCategory: "Factory",
//     price: 68000000,
//     currency: "PKR",
//     areaSize: 32000,
//     areaUnit: "sqft",
//     address: {
//       city: "Sialkot",
//       area: "Industrial Zone",
//       line1: "Plot 55, Export Manufacturing Road",
//       postalCode: "51040",
//       latitude: 32.4451,
//       longitude: 74.5662
//     },
//     bedrooms: 0,
//     bathrooms: 4,
//     floorLevel: null,
//     furnishing: "Unfurnished",
//     yearBuilt: 2012,
//     propertyCondition: "Well-Maintained",
//     amenities: ["Heavy Electricity Load", "Truck Access", "Security Gate"],
//     features: [
//       "Production Hall",
//       "Warehouse Storage",
//       "Admin Block",
//       "Ventilated Roof"
//     ],
//     tags: ["Manufacturing", "Industrial", "Export Zone"],
//     nearbyLandmarks: [
//       { name: "Sialkot Dry Port", distanceKm: 4.5 },
//       { name: "Airport Link Road", distanceKm: 3.1 }
//     ],
//     ownerType: "Developer",
//     ownerDetails: {
//       name: "Industrial Group Pvt Ltd",
//       phone: "+92-52-4422109",
//       email: "info@igpl.com",
//       agencyName: "Industrial Group Pvt Ltd"
//     },
//     contactVisibility: "Verified Users Only",
//     energyRating: "C",
//     waterSupply: "Available",
//     electricityBackup: "Partial",
//     parkingSpaces: 15,
//     description:
//       "A fully operational factory unit suitable for manufacturing and large-scale production. Equipped with high-power electric load and a spacious production hall.",
//     datePosted: "2025-01-06T10:50:00Z",
//     isFeatured: false,
//     rating: 4.6,
//     views: 503,
//     images: [
//       "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
//       "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800"
//     ]
//   },

//   {
//     id: 2008,
//     title: "Corporate Tower Floor for Multinational Companies",
//     listingType: "For Rent",
//     propertyCategory: "Corporate Tower",
//     price: 900000,
//     currency: "PKR",
//     areaSize: 7500,
//     areaUnit: "sqft",
//     address: {
//       city: "Karachi",
//       area: "I.I. Chundrigar Road",
//       line1: "Axis Tower, 14th Floor",
//       postalCode: "74000",
//       latitude: 24.8502,
//       longitude: 67.0092
//     },
//     bedrooms: 0,
//     bathrooms: 6,
//     floorLevel: 14,
//     furnishing: "Semi-Furnished",
//     yearBuilt: 2019,
//     propertyCondition: "New",
//     amenities: [
//       "Centrally Air Conditioned",
//       "Backup Generator",
//       "Fire Control System",
//       "Underground Parking"
//     ],
//     features: ["CEO Cabin", "Board Room", "Server Area", "Pantry"],
//     tags: ["Corporate", "Multinational", "Prime Commercial"],
//     nearbyLandmarks: [
//       { name: "State Bank of Pakistan", distanceKm: 0.4 },
//       { name: "Karachi Stock Exchange", distanceKm: 0.2 }
//     ],
//     ownerType: "Agent",
//     ownerDetails: {
//       name: "Ahmed Ali",
//       phone: "+92-322-8899441",
//       email: "ahmed.agent@example.com",
//       agencyName: "Metro Corporate Realtors"
//     },
//     contactVisibility: "Public",
//     videoTour: "https://videos.example.com/tower2008.mp4",
//     virtual3DTour: "https://vr.example.com/tower2008",
//     energyRating: "A",
//     waterSupply: "Available",
//     electricityBackup: "Full",
//     parkingSpaces: 8,
//     description:
//       "A full-floor corporate space suitable for multinational firms seeking a modern, secure, fully equipped commercial environment.",
//     datePosted: "2025-01-07T11:00:00Z",
//     isFeatured: true,
//     rating: 4.9,
//     views: 819,
//     images: [
//       "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800",
//       "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800"
//     ]
//   },

//   {
//     id: 2009,
//     title: "Cozy 2-Bed Cottage in a Gated Community",
//     listingType: "For Sale",
//     propertyCategory: "Residential House",
//     price: 9500000,
//     currency: "PKR",
//     areaSize: 1500,
//     areaUnit: "sqft",
//     address: {
//       city: "Murree",
//       area: "Patriata Hills",
//       line1: "Hilltop Cottages Lane 5",
//       postalCode: "47150",
//       latitude: 33.9071,
//       longitude: 73.3901
//     },
//     bedrooms: 2,
//     bathrooms: 2,
//     floorLevel: null,
//     furnishing: "Furnished",
//     yearBuilt: 2021,
//     propertyCondition: "New",
//     amenities: ["Mountain View", "Solar Backup", "Parking"],
//     features: ["Wooden Interior", "Fireplace", "Private Lawn"],
//     tags: ["Vacation Home", "Scenic View", "Cool Climate"],
//     nearbyLandmarks: [
//       { name: "Patriata Chairlift", distanceKm: 2.3 },
//       { name: "Murree Expressway", distanceKm: 5.7 }
//     ],
//     ownerType: "Owner",
//     ownerDetails: {
//       name: "Shayan Raza",
//       phone: "+92-344-1122334",
//       email: "shayan.cottage@example.com"
//     },
//     contactVisibility: "Public",
//     videoTour: "https://videos.example.com/cottage2009.mp4",
//     energyRating: "A",
//     waterSupply: "Available",
//     electricityBackup: "Full",
//     parkingSpaces: 2,
//     description:
//       "A charming cottage perfect for vacation getaways. Surrounded by greenery and offering breathtaking mountain views.",
//     datePosted: "2025-01-07T13:40:00Z",
//     isFeatured: true,
//     rating: 4.7,
//     views: 943,
//     images: [
//       "https://images.unsplash.com/photo-1505692794403-34d4982d2c71?w=800",
//       "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800"
//     ]
//   },

//   {
//     id: 2010,
//     title: "Penthouse with Private Rooftop Garden",
//     listingType: "For Sale",
//     propertyCategory: "Penthouse",
//     price: 38500000,
//     currency: "PKR",
//     areaSize: 3000,
//     areaUnit: "sqft",
//     address: {
//       city: "Islamabad",
//       area: "F-11 Markaz",
//       line1: "Elite Residency Tower",
//       postalCode: "44000",
//       latitude: 33.6955,
//       longitude: 73.0153
//     },
//     bedrooms: 3,
//     bathrooms: 4,
//     floorLevel: 10,
//     furnishing: "Furnished",
//     yearBuilt: 2023,
//     propertyCondition: "New",
//     amenities: [
//       "Rooftop Garden",
//       "Sky Lounge",
//       "Indoor Pool",
//       "Private Elevator"
//     ],
//     features: [
//       "Marble Flooring",
//       "Glass Balcony",
//       "Smart Home Automation"
//     ],
//     tags: ["Luxury Penthouse", "High-Rise Living", "Elite Area"],
//     nearbyLandmarks: [
//       { name: "F-11 Park", distanceKm: 0.9 },
//       { name: "Margalla Road", distanceKm: 1.5 }
//     ],
//     ownerType: "Agent",
//     ownerDetails: {
//       name: "Raza Estate Consultants",
//       phone: "+92-300-7711224",
//       email: "contact@razaestate.com",
//       agencyName: "Raza Estate Consultants"
//     },
//     contactVisibility: "Verified Users Only",
//     videoTour: "https://videos.example.com/penthouse2010.mp4",
//     virtual3DTour: "https://vr.example.com/penthouse2010",
//     energyRating: "A",
//     waterSupply: "Available",
//     electricityBackup: "Full",
//     parkingSpaces: 3,
//     description:
//       "A premium penthouse offering exclusive luxury living with a private rooftop garden and breathtaking views of the Margalla Hills.",
//     datePosted: "2025-01-07T17:20:00Z",
//     isFeatured: true,
//     rating: 4.9,
//     views: 1182,
//     images: [
//       "https://images.unsplash.com/photo-1502673530728-f79b4cab31b1?w=800",
//       "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800"
//     ]
//   }
// ];
// export const PROPERTIES_CHUNK_3: Property[] = [
//   {
//     id: 2011,
//     title: "Modern 2-Bed Apartment in Bahria Town Highrise",
//     listingType: "For Rent",
//     propertyCategory: "Residential Flat",
//     price: 65000,
//     currency: "PKR",
//     areaSize: 1100,
//     areaUnit: "sqft",
//     address: {
//       city: "Rawalpindi",
//       area: "Bahria Town Phase 7",
//       line1: "Apex Heights Tower 2, 6th Floor",
//       postalCode: "46620",
//       latitude: 33.5373,
//       longitude: 73.1181
//     },
//     bedrooms: 2,
//     bathrooms: 2,
//     floorLevel: 6,
//     furnishing: "Furnished",
//     yearBuilt: 2022,
//     propertyCondition: "New",
//     amenities: ["Lift", "Gym", "Generator Backup", "CCTV", "Gated Entrance"],
//     features: ["Balcony", "Modern Kitchen", "Built-in Wardrobes"],
//     tags: ["Family", "New Construction", "Highrise Living"],
//     nearbyLandmarks: [
//       { name: "Bahria Theme Park", distanceKm: 1.4 },
//       { name: "Clock Tower Commercial", distanceKm: 2.2 }
//     ],
//     ownerType: "Owner",
//     ownerDetails: {
//       name: "Hassan Mir",
//       phone: "+92-331-8890012",
//       email: "hassan.mir@example.com"
//     },
//     contactVisibility: "Public",
//     videoTour: "https://videos.example.com/apt2011.mp4",
//     virtual3DTour: "https://vr.example.com/apt2011",
//     energyRating: "A",
//     waterSupply: "Available",
//     electricityBackup: "Full",
//     parkingSpaces: 1,
//     description:
//       "A newly constructed luxury 2-bedroom apartment featuring premium finishing, modern layout, and excellent building amenities.",
//     datePosted: "2025-01-08T09:35:00Z",
//     isFeatured: false,
//     rating: 4.6,
//     views: 431,
//     images: [
//       "https://images.unsplash.com/photo-1598928506311-c55ded91a20e?w=800",
//       "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"
//     ]
//   },

//   {
//     id: 2012,
//     title: "Commercial Showroom on Main University Road",
//     listingType: "For Rent",
//     propertyCategory: "Showroom",
//     price: 285000,
//     currency: "PKR",
//     areaSize: 2600,
//     areaUnit: "sqft",
//     address: {
//       city: "Karachi",
//       area: "Gulshan-e-Iqbal Block 3",
//       line1: "Business Point Plaza, Ground Floor",
//       postalCode: "75300",
//       latitude: 24.9152,
//       longitude: 67.0867
//     },
//     bedrooms: 0,
//     bathrooms: 1,
//     floorLevel: 0,
//     furnishing: "Semi-Furnished",
//     yearBuilt: 2016,
//     propertyCondition: "Renovated",
//     amenities: ["Parking", "Glass Front", "Central AC", "Security Staff"],
//     features: ["Prime Frontage", "Signage Space", "High Footfall"],
//     tags: ["Retail", "Brand Outlet", "Main Road"],
//     nearbyLandmarks: [
//       { name: "NED University", distanceKm: 0.8 },
//       { name: "Aladin Mall", distanceKm: 1.6 }
//     ],
//     ownerType: "Agent",
//     ownerDetails: {
//       name: "MetroBiz Consultants",
//       phone: "+92-321-8809980",
//       email: "contact@metrobiz.pk",
//       agencyName: "MetroBiz Consultants"
//     },
//     contactVisibility: "Verified Users Only",
//     videoTour: "https://videos.example.com/showroom2012.mp4",
//     energyRating: "B",
//     waterSupply: "Available",
//     electricityBackup: "Partial",
//     parkingSpaces: 3,
//     description:
//       "A spacious commercial showroom ideal for branded outlets, electronics, furniture, and high-volume retail operations.",
//     datePosted: "2025-01-08T12:50:00Z",
//     isFeatured: true,
//     rating: 4.8,
//     views: 778,
//     images: [
//       "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800",
//       "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800"
//     ]
//   },

//   {
//     id: 2013,
//     title: "Lake-View Farm House with Swimming Pool",
//     listingType: "For Rent",
//     propertyCategory: "Farm House",
//     price: 160000,
//     currency: "PKR",
//     areaSize: 2,
//     areaUnit: "acre",
//     address: {
//       city: "Islamabad",
//       area: "Chak Shahzad",
//       line1: "Lakeview Farms, Street 4",
//       postalCode: "44000",
//       latitude: 33.6731,
//       longitude: 73.1578
//     },
//     bedrooms: 3,
//     bathrooms: 4,
//     floorLevel: null,
//     furnishing: "Furnished",
//     yearBuilt: 2019,
//     propertyCondition: "Well-Maintained",
//     amenities: ["Swimming Pool", "Lawn", "Farm Space", "Generator"],
//     features: [
//       "Lake View",
//       "Outdoor Seating",
//       "BBQ Area",
//       "Guest Cottage"
//     ],
//     tags: ["Events", "Vacation", "Private"],
//     nearbyLandmarks: [
//       { name: "National Agricultural Research Center", distanceKm: 3.9 },
//       { name: "Park View City Entrance", distanceKm: 5.2 }
//     ],
//     ownerType: "Owner",
//     ownerDetails: {
//       name: "Kamran Siddiqui",
//       phone: "+92-345-1122339",
//       email: "ksfarmhouses@example.com"
//     },
//     contactVisibility: "Public",
//     videoTour: "https://videos.example.com/farm2013.mp4",
//     virtual3DTour: "https://vr.example.com/farm2013",
//     energyRating: "C",
//     waterSupply: "Available",
//     electricityBackup: "Full",
//     parkingSpaces: 8,
//     description:
//       "A luxurious farm house perfect for weekend stays, small gatherings, or year-long rental. Featuring a large pool and scenic lake view.",
//     datePosted: "2025-01-09T09:15:00Z",
//     isFeatured: true,
//     rating: 4.8,
//     views: 902,
//     images: [
//       "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800",
//       "https://images.unsplash.com/photo-1502673530728-f79b4cab31b1?w=800"
//     ]
//   },

//   {
//     id: 2014,
//     title: "Brand New 5-Bed Luxury House in Bahria Orchard",
//     listingType: "For Sale",
//     propertyCategory: "Residential House",
//     price: 32500000,
//     currency: "PKR",
//     areaSize: 10,
//     areaUnit: "marla",
//     address: {
//       city: "Lahore",
//       area: "Bahria Orchard Phase 2",
//       line1: "Block G2, House 127",
//       postalCode: "54000",
//       latitude: 31.3371,
//       longitude: 74.2022
//     },
//     bedrooms: 5,
//     bathrooms: 6,
//     floorLevel: null,
//     furnishing: "Semi-Furnished",
//     yearBuilt: 2024,
//     propertyCondition: "New",
//     amenities: ["Gated Community", "Mosque Nearby", "School Nearby"],
//     features: [
//       "Double Height Lobby",
//       "Imported Tiles",
//       "Servant Quarter",
//       "Designer Kitchen"
//     ],
//     tags: ["Luxury", "Brand New", "Family Home"],
//     nearbyLandmarks: [
//       { name: "Bahria Hospital", distanceKm: 1.7 },
//       { name: "Orchard Mall", distanceKm: 2.4 }
//     ],
//     ownerType: "Agent",
//     ownerDetails: {
//       name: "Property Hub",
//       phone: "+92-301-4455113",
//       email: "info@propertyhub.pk",
//       agencyName: "Property Hub Lahore"
//     },
//     contactVisibility: "Verified Users Only",
//     videoTour: "https://videos.example.com/house2014.mp4",
//     energyRating: "A",
//     waterSupply: "Available",
//     electricityBackup: "Partial",
//     parkingSpaces: 2,
//     description:
//       "A beautifully designed 5-bedroom luxury house located in a secure and premium community with modern amenities.",
//     datePosted: "2025-01-09T11:35:00Z",
//     isFeatured: true,
//     rating: 5.0,
//     views: 1103,
//     images: [
//       "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800",
//       "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800"
//     ]
//   },

//   {
//     id: 2015,
//     title: "Corporate Office Floor with 40 Workstations",
//     listingType: "For Rent",
//     propertyCategory: "Commercial Office",
//     price: 420000,
//     currency: "PKR",
//     areaSize: 3900,
//     areaUnit: "sqft",
//     address: {
//       city: "Karachi",
//       area: "Shahrah-e-Faisal",
//       line1: "Business Avenue Tower, 5th Floor",
//       postalCode: "75200",
//       latitude: 24.8661,
//       longitude: 67.0789
//     },
//     bedrooms: 0,
//     bathrooms: 3,
//     floorLevel: 5,
//     furnishing: "Furnished",
//     yearBuilt: 2017,
//     propertyCondition: "Renovated",
//     amenities: [
//       "High-Speed Elevators",
//       "Security",
//       "Generator",
//       "Visitor Parking"
//     ],
//     features: [
//       "Workstations Setup",
//       "Glass Partitions",
//       "Meeting Room",
//       "Reception Area"
//     ],
//     tags: ["Corporate", "Ready to Move", "Prime Business Road"],
//     nearbyLandmarks: [
//       { name: "PF Museum", distanceKm: 1.6 },
//       { name: "Nursery Market", distanceKm: 0.9 }
//     ],
//     ownerType: "Owner",
//     ownerDetails: {
//       name: "Ahsan Traders",
//       phone: "+92-321-5577110",
//       email: "ahsan.offices@example.com"
//     },
//     contactVisibility: "Public",
//     energyRating: "B",
//     waterSupply: "Available",
//     electricityBackup: "Full",
//     parkingSpaces: 4,
//     description:
//       "Fully furnished office floor ideal for IT, call centers, or corporate companies. Includes 40 ready-to-use workstations.",
//     datePosted: "2025-01-09T16:20:00Z",
//     isFeatured: false,
//     rating: 4.7,
//     views: 674,
//     images: [
//       "https://images.unsplash.com/photo-1507209696998-3c532be9b2b6?w=800",
//       "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800"
//     ]
//   }
// ];
// [
//   {
//     id: 2016,
//     title: "Furnished 2-Bed Apartment near Civic Center",
//     listingType: "For Rent",
//     propertyCategory: "Residential Flat",
//     price: 42000,
//     currency: "PKR",
//     areaSize: 1150,
//     areaUnit: "sqft",
//     address: {
//       city: "Karachi",
//       area: "Gulshan-e-Iqbal",
//       line1: "Civic Center Road, Block 14",
//       postalCode: "75300",
//       latitude: 24.9185,
//       longitude: 67.0972
//     },
//     bedrooms: 2,
//     bathrooms: 2,
//     floorLevel: 3,
//     furnishing: "Furnished",
//     yearBuilt: 2018,
//     propertyCondition: "Well-Maintained",
//     amenities: ["Lift", "Security", "Parking"],
//     features: ["Balcony", "Open Kitchen", "CCTV Cameras"],
//     tags: ["Family", "Furnished"],
//     nearbyLandmarks: [
//       { name: "Expo Center", distanceKm: 1.2 },
//       { name: "NED University", distanceKm: 2.0 }
//     ],
//     ownerType: "Owner",
//     ownerDetails: {
//       name: "Muhammad Imran",
//       phone: "0300-4455667",
//       email: "imran.owner@example.com"
//     },
//     contactVisibility: "Public",
//     videoTour: null,
//     virtual3DTour: null,
//     energyRating: "C",
//     waterSupply: "Available",
//     electricityBackup: "Partial",
//     parkingSpaces: 1,
//     description: "A beautifully furnished apartment ideal for small families, with easy access to major educational and commercial areas.",
//     datePosted: "2025-01-18T09:30:00Z",
//     isFeatured: false,
//     rating: 4.3,
//     views: 150,
//     images: [
//       "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
//       "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800"
//     ]
//   },

//   {
//     id: 2017,
//     title: "Brand New 5-Marla House in Bahria Town Precinct 12",
//     listingType: "For Sale",
//     propertyCategory: "Residential House",
//     price: 16500000,
//     currency: "PKR",
//     areaSize: 1125,
//     areaUnit: "sqft",
//     address: {
//       city: "Karachi",
//       area: "Bahria Town",
//       line1: "Precinct 12, Ali Block",
//       postalCode: "75340",
//       latitude: 24.8741,
//       longitude: 67.2574
//     },
//     bedrooms: 3,
//     bathrooms: 4,
//     floorLevel: null,
//     furnishing: "Unfurnished",
//     yearBuilt: 2024,
//     propertyCondition: "New",
//     amenities: ["Security", "Mosque", "Park"],
//     features: ["Terrace", "Wide Car Porch"],
//     tags: ["Brand New", "Corner House"],
//     nearbyLandmarks: [
//       { name: "Bahria Theme Park", distanceKm: 2.5 }
//     ],
//     ownerType: "Developer",
//     ownerDetails: {
//       name: "BTK Developers",
//       phone: "0300-8882211",
//       email: "sales@btk.com"
//     },
//     contactVisibility: "Verified Users Only",
//     energyRating: "B",
//     waterSupply: "Available",
//     electricityBackup: "Full",
//     parkingSpaces: 2,
//     description: "A newly built house in Ali Block offering peaceful surroundings and modern architecture.",
//     datePosted: "2025-01-17T14:00:00Z",
//     isFeatured: true,
//     rating: 4.8,
//     views: 322,
//     images: [
//       "https://images.unsplash.com/photo-1572120360623-9d0e4ccdbf9a?w=800",
//       "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800"
//     ]
//   },

//   {
//     id: 2018,
//     title: "High-Rise Office Floor in I.I. Chundrigar Road",
//     listingType: "For Rent",
//     propertyCategory: "Commercial Office",
//     price: 180000,
//     currency: "PKR",
//     areaSize: 4500,
//     areaUnit: "sqft",
//     address: {
//       city: "Karachi",
//       area: "I.I. Chundrigar",
//       line1: "Business Tower, 14th Floor",
//       postalCode: "74000",
//       latitude: 24.8527,
//       longitude: 67.0096
//     },
//     bedrooms: 0,
//     bathrooms: 3,
//     floorLevel: 14,
//     furnishing: "Semi-Furnished",
//     yearBuilt: 2015,
//     propertyCondition: "Renovated",
//     amenities: ["High-Speed Elevators", "Backup Generator", "Security"],
//     features: ["Server Room", "Conference Hall"],
//     tags: ["Corporate", "Prime Location"],
//     nearbyLandmarks: [
//       { name: "State Bank", distanceKm: 0.5 }
//     ],
//     ownerType: "Agent",
//     ownerDetails: {
//       name: "Saad Realtors",
//       phone: "0312-2201199",
//       email: "contact@saadrealtors.com",
//       agencyName: "Saad Realtors"
//     },
//     contactVisibility: "Public",
//     electricityBackup: "Full",
//     waterSupply: "Available",
//     parkingSpaces: 4,
//     description: "Ideal corporate workspace with panoramic city views and essential commercial facilities.",
//     datePosted: "2025-01-16T11:15:00Z",
//     isFeatured: false,
//     rating: 4.1,
//     views: 210,
//     images: [
//       "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
//       "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800"
//     ]
//   },

//   {
//     id: 2019,
//     title: "Luxury Penthouse with Rooftop Pool in Clifton Block 5",
//     listingType: "For Sale",
//     propertyCategory: "Penthouse",
//     price: 85000000,
//     currency: "PKR",
//     areaSize: 5000,
//     areaUnit: "sqft",
//     address: {
//       city: "Karachi",
//       area: "Clifton",
//       line1: "Block 5, Beach Avenue Tower",
//       postalCode: "75600",
//       latitude: 24.8185,
//       longitude: 67.0301
//     },
//     bedrooms: 4,
//     bathrooms: 5,
//     floorLevel: 18,
//     furnishing: "Furnished",
//     yearBuilt: 2023,
//     propertyCondition: "New",
//     amenities: ["Gym", "Infinity Pool", "Sauna", "24/7 Security"],
//     features: ["Rooftop Pool", "Sea View", "Smart Home Automation"],
//     tags: ["Luxury", "Sea Facing"],
//     nearbyLandmarks: [
//       { name: "Dolmen Mall", distanceKm: 1.8 }
//     ],
//     ownerType: "Owner",
//     ownerDetails: {
//       name: "Naveed Ali",
//       phone: "0300-9997766",
//       email: "naveed.penthouse@example.com"
//     },
//     contactVisibility: "Public",
//     electricityBackup: "Full",
//     waterSupply: "Available",
//     parkingSpaces: 3,
//     description: "A one-of-a-kind luxury penthouse offering world-class amenities and breathtaking uninterrupted sea views.",
//     datePosted: "2025-01-15T16:45:00Z",
//     isFeatured: true,
//     rating: 4.9,
//     views: 520,
//     images: [
//       "https://images.unsplash.com/photo-1501183638710-841dd1904471?w=800",
//       "https://images.unsplash.com/photo-1582407947304-7e3bd4b42a4a?w=800"
//     ]
//   },

//   {
//     id: 2020,
//     title: "Standalone Warehouse near Port Qasim",
//     listingType: "For Rent",
//     propertyCategory: "Warehouse",
//     price: 260000,
//     currency: "PKR",
//     areaSize: 20000,
//     areaUnit: "sqft",
//     address: {
//       city: "Karachi",
//       area: "Port Qasim",
//       line1: "Eastern Industrial District",
//       postalCode: "75030",
//       latitude: 24.7811,
//       longitude: 67.3396
//     },
//     bedrooms: 0,
//     bathrooms: 1,
//     floorLevel: null,
//     furnishing: "Unfurnished",
//     yearBuilt: 2014,
//     propertyCondition: "Well-Maintained",
//     amenities: ["Cargo Access", "Security", "Parking"],
//     features: ["Docking Area", "High Ceilings"],
//     tags: ["Industrial", "Logistics"],
//     nearbyLandmarks: [
//       { name: "Port Qasim Gate", distanceKm: 3.2 }
//     ],
//     ownerType: "Owner",
//     ownerDetails: {
//       name: "Zahid Logistics",
//       phone: "0300-5577991",
//       email: "contact@zahidlogistics.com"
//     },
//     contactVisibility: "Verified Users Only",
//     electricityBackup: "Partial",
//     waterSupply: "Available",
//     parkingSpaces: 12,
//     description: "A spacious warehouse perfect for distribution and industrial storage with easy access to port facilities.",
//     datePosted: "2025-01-14T12:00:00Z",
//     isFeatured: false,
//     rating: 4.0,
//     views: 198,
//     images: [
//       "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800",
//       "https://images.unsplash.com/photo-1553413077-190b305b2ea7?w=800"
//     ]
//   },

//   {
//     id: 2021,
//     title: "Studio Apartment for Students in Gulistan-e-Johar Block 2",
//     listingType: "For Rent",
//     propertyCategory: "Studio",
//     price: 18000,
//     currency: "PKR",
//     areaSize: 450,
//     areaUnit: "sqft",
//     address: {
//       city: "Karachi",
//       area: "Gulistan-e-Johar",
//       line1: "Block 2, University Road",
//       postalCode: "75290",
//       latitude: 24.9189,
//       longitude: 67.1300
//     },
//     bedrooms: 1,
//     bathrooms: 1,
//     floorLevel: 2,
//     furnishing: "Semi-Furnished",
//     yearBuilt: 2010,
//     propertyCondition: "Well-Maintained",
//     amenities: ["Security", "Lift"],
//     features: ["Balcony"],
//     tags: ["Student", "Affordable"],
//     nearbyLandmarks: [
//       { name: "Habib University", distanceKm: 1.1 }
//     ],
//     ownerType: "Owner",
//     ownerDetails: {
//       name: "Sohail Khan",
//       phone: "0315-7788221",
//       email: "sohail.rental@example.com"
//     },
//     contactVisibility: "Public",
//     electricityBackup: "None",
//     waterSupply: "Available",
//     parkingSpaces: 0,
//     description: "Affordable studio apartment ideal for students with basic furnishing, lift access, and close proximity to major universities.",
//     datePosted: "2025-01-13T10:10:00Z",
//     isFeatured: false,
//     rating: 3.9,
//     views: 140,
//     images: [
//       "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800",
//       "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800"
//     ]
//   },
  
//   {
//     id: 2022,
//     title: "Retail Outlet in Tariq Road Fashion District",
//     listingType: "For Sale",
//     propertyCategory: "Retail Outlet",
//     price: 35000000,
//     currency: "PKR",
//     areaSize: 1300,
//     areaUnit: "sqft",
//     address: {
//       city: "Karachi",
//       area: "Tariq Road",
//       line1: "Fashion Market Lane",
//       postalCode: "75400",
//       latitude: 24.8829,
//       longitude: 67.0648
//     },
//     bedrooms: 0,
//     bathrooms: 1,
//     floorLevel: 1,
//     furnishing: "Semi-Furnished",
//     yearBuilt: 2017,
//     propertyCondition: "Well-Maintained",
//     amenities: ["Parking", "Security"],
//     features: ["Glass Front", "Display Shelves"],
//     tags: ["Retail", "Commercial Hotspot"],
//     nearbyLandmarks: [
//       { name: "Dolmen Mall Tariq Road", distanceKm: 0.9 }
//     ],
//     ownerType: "Owner",
//     ownerDetails: {
//       name: "Maria Traders",
//       phone: "0300-4455221",
//       email: "maria@traders.com"
//     },
//     contactVisibility: "Verified Users Only",
//     electricityBackup: "Partial",
//     waterSupply: "Available",
//     parkingSpaces: 2,
//     description: "Prime retail outlet ideal for clothing, footwear, or electronics in Karachi’s busiest shopping zone.",
//     datePosted: "2025-01-12T09:00:00Z",
//     isFeatured: true,
//     rating: 4.5,
//     views: 389,
//     images: [
//       "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
//       "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800"
//     ]
//   },

//   {
//     id: 2023,
//     title: "Farm House with Swimming Pool on Northern Bypass",
//     listingType: "For Rent",
//     propertyCategory: "Farm House",
//     price: 125000,
//     currency: "PKR",
//     areaSize: 22000,
//     areaUnit: "sqft",
//     address: {
//       city: "Karachi",
//       area: "Northern Bypass",
//       line1: "Green Avenue Farms",
//       postalCode: "75850",
//       latitude: 25.0000,
//       longitude: 67.2001
//     },
//     bedrooms: 3,
//     bathrooms: 4,
//     floorLevel: null,
//     furnishing: "Furnished",
//     yearBuilt: 2019,
//     propertyCondition: "Well-Maintained",
//     amenities: ["Swimming Pool", "Garden", "BBQ Area"],
//     features: ["Event Space", "Play Area"],
//     tags: ["Farm House", "Event Friendly"],
//     nearbyLandmarks: [
//       { name: "Northern Bypass Toll Plaza", distanceKm: 4.5 }
//     ],
//     ownerType: "Owner",
//     ownerDetails: {
//       name: "FarmStay Pvt. Ltd.",
//       phone: "0321-1113344",
//       email: "info@farmstay.com"
//     },
//     contactVisibility: "Public",
//     electricityBackup: "Full",
//     waterSupply: "Available",
//     parkingSpaces: 10,
//     description: "A relaxing farm house perfect for events and weekend stays with large open garden and private swimming pool.",
//     datePosted: "2025-01-11T14:20:00Z",
//     isFeatured: true,
//     rating: 4.7,
//     views: 502,
//     images: [
//       "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800",
//       "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800"
//     ]
//   },

//   {
//     id: 2024,
//     title: "4-Bed Large Bungalow in DHA Phase 7 Extension",
//     listingType: "For Sale",
//     propertyCategory: "Residential House",
//     price: 56500000,
//     currency: "PKR",
//     areaSize: 5000,
//     areaUnit: "sqft",
//     address: {
//       city: "Karachi",
//       area: "DHA Phase 7 Ext",
//       line1: "Khayaban-e-Shaheen",
//       postalCode: "75500",
//       latitude: 24.8045,
//       longitude: 67.0780
//     },
//     bedrooms: 4,
//     bathrooms: 6,
//     floorLevel: null,
//     furnishing: "Unfurnished",
//     yearBuilt: 2020,
//     propertyCondition: "Well-Maintained",
//     amenities: ["Servant Quarter", "Garage", "Garden"],
//     features: ["Wide Frontage", "Solar Backup"],
//     tags: ["Luxury", "DHA"],
//     nearbyLandmarks: [
//       { name: "Creek Vista", distanceKm: 2.3 }
//     ],
//     ownerType: "Owner",
//     ownerDetails: {
//       name: "Ahmed Estate Holdings",
//       phone: "0310-2233445",
//       email: "contact@ahmedholdings.com"
//     },
//     contactVisibility: "Verified Users Only",
//     electricityBackup: "Partial",
//     waterSupply: "Available",
//     parkingSpaces: 4,
//     description: "Spacious luxury bungalow with wide frontage, generous rooms, and high-end finishing in DHA’s premium locality.",
//     datePosted: "2025-01-10T16:00:00Z",
//     isFeatured: true,
//     rating: 4.6,
//     views: 350,
//     images: [
//       "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800",
//       "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"
//     ]
//   },

//   {
//     id: 2025,
//     title: "Corner Commercial Shop in Saddar Empress Market Zone",
//     listingType: "For Rent",
//     propertyCategory: "Commercial Shop",
//     price: 90000,
//     currency: "PKR",
//     areaSize: 900,
//     areaUnit: "sqft",
//     address: {
//       city: "Karachi",
//       area: "Saddar",
//       line1: "Empress Market Road",
//       postalCode: "74400",
//       latitude: 24.8521,
//       longitude: 67.0169
//     },
//     bedrooms: 0,
//     bathrooms: 1,
//     floorLevel: 0,
//     furnishing: "Unfurnished",
//     yearBuilt: 2012,
//     propertyCondition: "Renovated",
//     amenities: ["Security", "Parking"],
//     features: ["Glass Front", "Corner Frontage"],
//     tags: ["High Footfall", "Retail"],
//     nearbyLandmarks: [
//       { name: "Empress Market", distanceKm: 0.1 }
//     ],
//     ownerType: "Agent",
//     ownerDetails: {
//       name: "Karachi Commercial Deals",
//       phone: "0300-1122334",
//       email: "info@kcd.com",
//       agencyName: "KCD Pvt. Ltd."
//     },
//     contactVisibility: "Public",
//     electricityBackup: "None",
//     waterSupply: "Available",
//     parkingSpaces: 1,
//     description: "A highly visible corner shop with newly renovated interior suitable for retail, cosmetics, and small electronics.",
//     datePosted: "2025-01-09T13:45:00Z",
//     isFeatured: false,
//     rating: 4.2,
//     views: 265,
//     images: [
//       "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800",
//       "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800"
//     ]
//   },

//   {
//     id: 2026,
//     title: "Modern Studio Apartment in PECHS Block 2",
//     listingType: "For Rent",
//     propertyCategory: "Studio",
//     price: 25000,
//     currency: "PKR",
//     areaSize: 600,
//     areaUnit: "sqft",
//     address: {
//       city: "Karachi",
//       area: "PECHS",
//       line1: "Block 2 - Main Shahrah-e-Faisal",
//       postalCode: "75400",
//       latitude: 24.8708,
//       longitude: 67.0637
//     },
//     bedrooms: 1,
//     bathrooms: 1,
//     floorLevel: 4,
//     furnishing: "Semi-Furnished",
//     yearBuilt: 2016,
//     propertyCondition: "Well-Maintained",
//     amenities: ["Lift", "CCTV"],
//     features: ["Open Kitchen"],
//     tags: ["Corporate Rental", "Student Friendly"],
//     nearbyLandmarks: [
//       { name: "Nursery Market", distanceKm: 0.9 }
//     ],
//     ownerType: "Owner",
//     ownerDetails: {
//       name: "Rashid Ali",
//       phone: "0305-9988112",
//       email: "rashid.studio@example.com"
//     },
//     contactVisibility: "Public",
//     electricityBackup: "Partial",
//     waterSupply: "Available",
//     parkingSpaces: 0,
//     description: "A neat and modern studio ideal for individuals or students looking for central location access.",
//     datePosted: "2025-01-08T10:20:00Z",
//     isFeatured: false,
//     rating: 4.0,
//     views: 198,
//     images: [
//       "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
//       "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800"
//     ]
//   },

//   {
//     id: 2027,
//     title: "Corporate Tower Floor for Rent in Shahrah-e-Faisal",
//     listingType: "For Rent",
//     propertyCategory: "Corporate Tower",
//     price: 350000,
//     currency: "PKR",
//     areaSize: 7000,
//     areaUnit: "sqft",
//     address: {
//       city: "Karachi",
//       area: "Shahrah-e-Faisal",
//       line1: "Business Square Tower",
//       postalCode: "75430",
//       latitude: 24.8607,
//       longitude: 67.0711
//     },
//     bedrooms: 0,
//     bathrooms: 4,
//     floorLevel: 8,
//     furnishing: "Unfurnished",
//     yearBuilt: 2021,
//     propertyCondition: "New",
//     amenities: [
//       "High-Speed Elevators",
//       "Fire Safety System",
//       "Parking",
//       "Security"
//     ],
//     features: ["Glass Partition Ready", "Corporate Lobby"],
//     tags: ["Corporate", "Prime Commercial"],
//     nearbyLandmarks: [
//       { name: "FTC Building", distanceKm: 0.5 }
//     ],
//     ownerType: "Owner",
//     ownerDetails: {
//       name: "Faisal Business Group",
//       phone: "021-33445566",
//       email: "sales@fbg.com"
//     },
//     contactVisibility: "Verified Users Only",
//     electricityBackup: "Full",
//     waterSupply: "Available",
//     parkingSpaces: 10,
//     description: "A prestigious corporate tower floor ideal for multinational companies with premium facilities.",
//     datePosted: "2025-01-07T09:40:00Z",
//     isFeatured: true,
//     rating: 4.8,
//     views: 601,
//     images: [
//       "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800",
//       "https://images.unsplash.com/photo-1554050857-c84a8abdb5e2?w=800"
//     ]
//   },

//   {
//     id: 2028,
//     title: "Factory Unit in Korangi Industrial Area Sector 18",
//     listingType: "For Sale",
//     propertyCategory: "Factory",
//     price: 48000000,
//     currency: "PKR",
//     areaSize: 16000,
//     areaUnit: "sqft",
//     address: {
//       city: "Karachi",
//       area: "Korangi",
//       line1: "Industrial Area Sector 18",
//       postalCode: "74900",
//       latitude: 24.8271,
//       longitude: 67.1325
//     },
//     bedrooms: 0,
//     bathrooms: 2,
//     floorLevel: null,
//     furnishing: "Unfurnished",
//     yearBuilt: 2008,
//     propertyCondition: "Renovated",
//     amenities: ["Security", "Parking"],
//     features: ["Loading Ramp", "Power Room"],
//     tags: ["Industrial", "Manufacturing"],
//     nearbyLandmarks: [
//       { name: "Korangi Fire Station", distanceKm: 1.8 }
//     ],
//     ownerType: "Agent",
//     ownerDetails: {
//       name: "Industrial Brokers Ltd.",
//       phone: "0300-8899223",
//       email: "sales@ibl.com",
//       agencyName: "IBL"
//     },
//     contactVisibility: "Public",
//     electricityBackup: "Full",
//     waterSupply: "Available",
//     parkingSpaces: 15,
//     description: "A large renovated factory unit perfect for manufacturing, packaging, or warehousing operations.",
//     datePosted: "2025-01-06T12:30:00Z",
//     isFeatured: false,
//     rating: 4.1,
//     views: 255,
//     images: [
//       "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
//       "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800"
//     ]
//   },

//   {
//     id: 2029,
//     title: "Luxury 3-Bed Apartment in Navy Housing Scheme Karsaz",
//     listingType: "For Sale",
//     propertyCategory: "Residential Flat",
//     price: 26500000,
//     currency: "PKR",
//     areaSize: 2100,
//     areaUnit: "sqft",
//     address: {
//       city: "Karachi",
//       area: "Karsaz",
//       line1: "NHS Phase 4",
//       postalCode: "75530",
//       latitude: 24.8986,
//       longitude: 67.0644
//     },
//     bedrooms: 3,
//     bathrooms: 4,
//     floorLevel: 7,
//     furnishing: "Furnished",
//     yearBuilt: 2022,
//     propertyCondition: "New",
//     amenities: ["Gym", "Community Hall", "Security"],
//     features: ["Maid Room", "Corner Unit"],
//     tags: ["Luxury", "Secure Community"],
//     nearbyLandmarks: [
//       { name: "Karsaz Flyover", distanceKm: 1.3 }
//     ],
//     ownerType: "Owner",
//     ownerDetails: {
//       name: "Hassan Ali",
//       phone: "0302-8811222",
//       email: "hassan.nhs@example.com"
//     },
//     contactVisibility: "Public",
//     electricityBackup: "Full",
//     waterSupply: "Available",
//     parkingSpaces: 2,
//     description: "A modern luxury flat located in a highly secure naval community with premium finishing.",
//     datePosted: "2025-01-05T11:00:00Z",
//     isFeatured: true,
//     rating: 4.7,
//     views: 340,
//     images: [
//       "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
//       "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"
//     ]
//   },

//   {
//     id: 2030,
//     title: "Showroom Space on Main Rashid Minhas Road",
//     listingType: "For Rent",
//     propertyCategory: "Showroom",
//     price: 140000,
//     currency: "PKR",
//     areaSize: 2600,
//     areaUnit: "sqft",
//     address: {
//       city: "Karachi",
//       area: "Rashid Minhas",
//       line1: "Main Road Opposite Millennium Mall",
//       postalCode: "75350",
//       latitude: 24.9200,
//       longitude: 67.1200
//     },
//     bedrooms: 0,
//     bathrooms: 1,
//     floorLevel: 0,
//     furnishing: "Unfurnished",
//     yearBuilt: 2013,
//     propertyCondition: "Well-Maintained",
//     amenities: ["Parking", "Security"],
//     features: ["Wide Front", "Double Height Ceiling"],
//     tags: ["Showroom", "High Visibility"],
//     nearbyLandmarks: [
//       { name: "Millennium Mall", distanceKm: 0.2 }
//     ],
//     ownerType: "Agent",
//     ownerDetails: {
//       name: "MM Commercial Deals",
//       phone: "0301-5577221",
//       email: "info@mmdeals.com",
//       agencyName: "MM Deals"
//     },
//     contactVisibility: "Public",
//     electricityBackup: "Partial",
//     waterSupply: "Available",
//     parkingSpaces: 4,
//     description: "A prime showroom location suitable for branded outlets with excellent visibility.",
//     datePosted: "2025-01-04T08:55:00Z",
//     isFeatured: false,
//     rating: 4.4,
//     views: 278,
//     images: [
//       "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
//       "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800"
//     ]
//   },

//   {
//     id: 2031,
//     title: "3-Bed Stylish Apartment in Gulberg Renovated Tower",
//     listingType: "For Rent",
//     propertyCategory: "Residential Flat",
//     price: 55000,
//     currency: "PKR",
//     areaSize: 1700,
//     areaUnit: "sqft",
//     address: {
//       city: "Karachi",
//       area: "Gulberg",
//       line1: "Block 13, Renovated Tower",
//       postalCode: "75330",
//       latitude: 24.9400,
//       longitude: 67.0850
//     },
//     bedrooms: 3,
//     bathrooms: 3,
//     floorLevel: 5,
//     furnishing: "Semi-Furnished",
//     yearBuilt: 2011,
//     propertyCondition: "Renovated",
//     amenities: ["Lift", "Security"],
//     features: ["Balcony", "Wardrobes"],
//     tags: ["Renovated", "Family"],
//     nearbyLandmarks: [
//       { name: "Gulberg Park", distanceKm: 1.1 }
//     ],
//     ownerType: "Owner",
//     ownerDetails: {
//       name: "Sadia Irfan",
//       phone: "0312-8811334",
//       email: "sadia.properties@example.com"
//     },
//     contactVisibility: "Public",
//     electricityBackup: "None",
//     waterSupply: "Available",
//     parkingSpaces: 1,
//     description: "A spacious and renovated flat perfect for families, located in a peaceful and central society.",
//     datePosted: "2025-01-03T12:10:00Z",
//     isFeatured: false,
//     rating: 4.2,
//     views: 180,
//     images: [
//       "https://images.unsplash.com/photo-1582407947304-7e3bd4b42a4a?w=800",
//       "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"
//     ]
//   },

//   {
//     id: 2032,
//     title: "Industrial Plot for Sale in SITE Super Highway",
//     listingType: "For Sale",
//     propertyCategory: "Industrial Plot",
//     price: 32000000,
//     currency: "PKR",
//     areaSize: 18000,
//     areaUnit: "sqft",
//     address: {
//       city: "Karachi",
//       area: "SITE",
//       line1: "Super Highway Industrial Estate",
//       postalCode: "75380",
//       latitude: 24.9600,
//       longitude: 67.1700
//     },
//     bedrooms: 0,
//     bathrooms: 0,
//     floorLevel: null,
//     furnishing: "Unfurnished",
//     yearBuilt: 0,
//     propertyCondition: "New",
//     amenities: ["Security"],
//     features: ["Main Road Facing"],
//     tags: ["Industrial", "Investment"],
//     nearbyLandmarks: [
//       { name: "SITE Police Station", distanceKm: 1.9 }
//     ],
//     ownerType: "Owner",
//     ownerDetails: {
//       name: "Faisal Industries",
//       phone: "0306-1122112",
//       email: "faisal.industries@example.com"
//     },
//     contactVisibility: "Public",
//     electricityBackup: "None",
//     waterSupply: "Not Available",
//     parkingSpaces: 10,
//     description: "A commercial industrial plot with excellent access to Super Highway, ideal for factories and warehouses.",
//     datePosted: "2025-01-02T14:00:00Z",
//     isFeatured: false,
//     rating: 4.0,
//     views: 220,
//     images: [
//       "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
//       "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800"
//     ]
//   },

//   {
//     id: 2033,
//     title: "2-Bed Furnished Flat in Clifton Pearl Residency",
//     listingType: "For Rent",
//     propertyCategory: "Residential Flat",
//     price: 65000,
//     currency: "PKR",
//     areaSize: 1450,
//     areaUnit: "sqft",
//     address: {
//       city: "Karachi",
//       area: "Clifton",
//       line1: "Block 7 Pearl Residency",
//       postalCode: "75600",
//       latitude: 24.8201,
//       longitude: 67.0377
//     },
//     bedrooms: 2,
//     bathrooms: 2,
//     floorLevel: 6,
//     furnishing: "Furnished",
//     yearBuilt: 2018,
//     propertyCondition: "Well-Maintained",
//     amenities: ["Lift", "Parking", "Gym"],
//     features: ["Sea Breeze", "Modern Kitchen"],
//     tags: ["Furnished", "Family"],
//     nearbyLandmarks: [
//       { name: "Boat Basin", distanceKm: 1.4 }
//     ],
//     ownerType: "Owner",
//     ownerDetails: {
//       name: "Farah Ahmed",
//       phone: "0309-4455991",
//       email: "farah.clifton@example.com"
//     },
//     contactVisibility: "Public",
//     electricityBackup: "Full",
//     waterSupply: "Available",
//     parkingSpaces: 1,
//     description: "A fully furnished tasteful apartment located in a peaceful and premium Clifton neighborhood.",
//     datePosted: "2025-01-01T15:05:00Z",
//     isFeatured: false,
//     rating: 4.3,
//     views: 230,
//     images: [
//       "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
//       "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800"
//     ]
//   },

//   {
//     id: 2034,
//     title: "5-Marla Modern House for Sale in North Karachi Sector 11-A",
//     listingType: "For Sale",
//     propertyCategory: "Residential House",
//     price: 11800000,
//     currency: "PKR",
//     areaSize: 1125,
//     areaUnit: "sqft",
//     address: {
//       city: "Karachi",
//       area: "North Karachi",
//       line1: "Sector 11-A",
//       postalCode: "75870",
//       latitude: 24.9700,
//       longitude: 67.0600
//     },
//     bedrooms: 3,
//     bathrooms: 4,
//     floorLevel: null,
//     furnishing: "Unfurnished",
//     yearBuilt: 2014,
//     propertyCondition: "Well-Maintained",
//     amenities: ["Parking", "Security"],
//     features: ["Terrace", "Tile Flooring"],
//     tags: ["Budget", "Family"],
//     nearbyLandmarks: [
//       { name: "UP Mor", distanceKm: 2.1 }
//     ],
//     ownerType: "Owner",
//     ownerDetails: {
//       name: "Noman Khan",
//       phone: "0341-2277880",
//       email: "noman.house@example.com"
//     },
//     contactVisibility: "Public",
//     electricityBackup: "None",
//     waterSupply: "Available",
//     parkingSpaces: 1,
//     description: "A well-maintained family house located in a peaceful neighborhood with wide streets and secure surroundings.",
//     datePosted: "2024-12-30T14:30:00Z",
//     isFeatured: false,
//     rating: 4.1,
//     views: 178,
//     images: [
//       "https://images.unsplash.com/photo-1572120360623-9d0e4ccdbf9a?w=800",
//       "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800"
//     ]
//   },

//   {
//     id: 2035,
//     title: "Corner Showroom Facing Main Nazimabad No. 7",
//     listingType: "For Rent",
//     propertyCategory: "Showroom",
//     price: 110000,
//     currency: "PKR",
//     areaSize: 2000,
//     areaUnit: "sqft",
//     address: {
//       city: "Karachi",
//       area: "Nazimabad",
//       line1: "Main Road, No. 7 Stop",
//       postalCode: "74600",
//       latitude: 24.9351,
//       longitude: 67.0260
//     },
//     bedrooms: 0,
//     bathrooms: 1,
//     floorLevel: 0,
//     furnishing: "Unfurnished",
//     yearBuilt: 2010,
//     propertyCondition: "Well-Maintained",
//     amenities: ["Parking", "Security"],
//     features: ["Corner Location", "Glass Windows"],
//     tags: ["Commercial", "High Footfall"],
//     nearbyLandmarks: [
//       { name: "Nazimabad Eidgah", distanceKm: 0.7 }
//     ],
//     ownerType: "Agent",
//     ownerDetails: {
//       name: "Nazimabad Property Hub",
//       phone: "0342-5566778",
//       email: "contact@nph.com",
//       agencyName: "NPH Real Estate"
//     },
//     contactVisibility: "Public",
//     electricityBackup: "None",
//     waterSupply: "Available",
//     parkingSpaces: 3,
//     description: "A well-located commercial showroom ideal for furniture, electronics, or accessories.",
//     datePosted: "2024-12-29T11:40:00Z",
//     isFeatured: false,
//     rating: 4.2,
//     views: 202,
//     images: [
//       "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
//       "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800"
//     ]
//   }
// ]
