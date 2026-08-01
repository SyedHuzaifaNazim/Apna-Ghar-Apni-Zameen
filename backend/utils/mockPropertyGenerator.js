/**
 * Deterministic mock property data, seeded by id.
 *
 * The old generator used Math.random() on every call, so page 1 returned
 * different properties on every request and /properties/:id could never
 * match anything a list screen had just shown. Seeding by id means the same
 * id always produces the same property, everywhere — real server-side
 * pagination and stable detail links, without needing DB persistence yet
 * (that's Task 10). Field shape matches the frontend's Property type
 * (types/property.ts) exactly so the whole app — cards, filters, listing
 * detail, contact agent — can consume this data with no gaps.
 */

export const TOTAL_MOCK_PROPERTIES = 100;

// Fixed once at process start rather than read per-call, so datePosted stays
// identical across requests (Date.now() per-call would drift by however much
// wall-clock time passed between two calls, breaking determinism).
const GENERATION_EPOCH = Date.now();

const LOCATIONS = [
  { area: 'DHA Phase 8', city: 'Karachi', lat: 24.7891, lng: 67.0485 },
  { area: 'Clifton', city: 'Karachi', lat: 24.8215, lng: 67.0326 },
  { area: 'Gulshan-e-Iqbal', city: 'Karachi', lat: 24.9197, lng: 67.097 },
  { area: 'PECHS', city: 'Karachi', lat: 24.8716, lng: 67.0599 },
  { area: 'Bahria Town Karachi', city: 'Karachi', lat: 25.0441, lng: 67.3195 },
  { area: 'Gulberg', city: 'Lahore', lat: 31.5085, lng: 74.3486 },
  { area: 'DHA Phase 5', city: 'Lahore', lat: 31.4697, lng: 74.4142 },
  { area: 'Model Town', city: 'Lahore', lat: 31.4818, lng: 74.3247 },
  { area: 'F-7', city: 'Islamabad', lat: 33.7195, lng: 73.0577 },
  { area: 'Bahria Town Islamabad', city: 'Islamabad', lat: 33.5651, lng: 73.1863 },
];

const LISTING_TYPES = ['For Sale', 'For Rent', 'Auction', 'Short Term Rent'];
const PROPERTY_CATEGORIES = [
  'Residential Flat',
  'Residential House',
  'Commercial Shop',
  'Commercial Office',
  'Industrial Plot',
  'Farm House',
  'Warehouse',
  'Penthouse',
  'Studio',
  'Retail Outlet',
  'Showroom',
  'Corporate Tower',
  'Factory',
];
const AREA_UNITS = ['sqft', 'sq-yard', 'acre', 'kanal', 'marla'];
const FURNISHING_TYPES = ['Furnished', 'Semi-Furnished', 'Unfurnished'];
const CONDITIONS = ['New', 'Renovated', 'Well-Maintained', 'Old'];
const OWNER_TYPES = ['Owner', 'Agent', 'Developer'];
const WATER_SUPPLY = ['Available', 'Not Available'];
const ELECTRICITY_BACKUP = ['None', 'Partial', 'Full'];

// Matches the amenity names PropertyInfo.tsx's icon map already recognizes.
const AMENITIES_POOL = [
  'Swimming Pool',
  'Gym',
  'Security',
  'Parking',
  'Garden',
  'Lift',
  'Power Backup',
  'Solar Panels',
  'CCTV',
  'Gated Community',
  'Fire Safety System',
  'Reception Lobby',
];
const FEATURES_POOL = [
  'Open Kitchen',
  'Walk-in Closet',
  'Balcony',
  'Servant Quarter',
  'Store Room',
  'Study Room',
  'Home Theater',
  'Private Garden',
  'Rooftop Access',
  'Smart Home System',
];
const LANDMARK_POOL = ['City Park', 'Grand Mall', 'International Airport', 'General Hospital', 'Central School'];
const AGENT_NAMES = ['Ahmed Khan', 'Bilal Sheikh', 'Sana Malik', 'Farhan Iqbal', 'Ayesha Raza', 'Usman Tariq', 'Hina Baig'];
const AGENCY_NAMES = ['Prime Estates', 'Skyline Realty', 'Metro Properties', 'Elite Realtors'];

const PROPERTY_IMAGES = [
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
];

/** mulberry32 — small, fast, deterministic PRNG. Same seed -> same sequence, always. */
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = (rand, arr) => arr[Math.floor(rand() * arr.length)];

const slugify = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const pickMultiple = (rand, arr, count) => {
  const pool = [...arr];
  const result = [];
  const n = Math.min(count, pool.length);
  for (let i = 0; i < n; i++) {
    const index = Math.floor(rand() * pool.length);
    result.push(pool.splice(index, 1)[0]);
  }
  return result;
};

export function generateMockProperty(id) {
  const rand = mulberry32(id + 1000);

  const loc = pick(rand, LOCATIONS);
  const listingType = pick(rand, LISTING_TYPES);
  const propertyCategory = pick(rand, PROPERTY_CATEGORIES);
  const ownerType = pick(rand, OWNER_TYPES);
  const isRental = listingType === 'For Rent' || listingType === 'Short Term Rent';
  const isMultiStory = !['Residential House', 'Farm House', 'Industrial Plot'].includes(propertyCategory);

  const bedrooms = Math.floor(rand() * 5) + 1;
  const bathrooms = Math.max(1, bedrooms - Math.floor(rand() * 2));
  const daysAgo = Math.floor(rand() * 90);

  return {
    id,
    title: `${propertyCategory} in ${loc.area}`,
    listingType,
    propertyCategory,

    price: isRental ? (Math.floor(rand() * 100) + 30) * 1000 : (Math.floor(rand() * 50) + 10) * 1000000,
    currency: 'PKR',
    areaSize: Math.floor(rand() * 400) + 100,
    areaUnit: pick(rand, AREA_UNITS),

    address: {
      city: loc.city,
      area: loc.area,
      line1: `Street ${Math.floor(rand() * 20) + 1}, ${loc.area}`,
      postalCode: `${74000 + Math.floor(rand() * 999)}`,
      latitude: loc.lat + (rand() - 0.5) * 0.01,
      longitude: loc.lng + (rand() - 0.5) * 0.01,
    },

    bedrooms,
    bathrooms,
    floorLevel: isMultiStory ? Math.floor(rand() * 15) : null,
    furnishing: pick(rand, FURNISHING_TYPES),

    yearBuilt: 2000 + Math.floor(rand() * 25),
    propertyCondition: pick(rand, CONDITIONS),

    amenities: pickMultiple(rand, AMENITIES_POOL, 3 + Math.floor(rand() * 4)),
    features: pickMultiple(rand, FEATURES_POOL, 2 + Math.floor(rand() * 3)),
    tags: rand() > 0.7 ? ['Hot Deal'] : [],

    nearbyLandmarks: pickMultiple(rand, LANDMARK_POOL, 2).map(name => ({
      name,
      distanceKm: Math.round((rand() * 5 + 0.5) * 10) / 10,
    })),

    ownerType,
    ownerDetails: (() => {
      const agentName = pick(rand, AGENT_NAMES);
      const agentId = slugify(agentName);
      // Seed the agent's own details off their name/id (not the listing id), so every
      // property posted by "Ahmed Khan" resolves to the same phone/email/agent profile.
      const agentRand = mulberry32(agentId.length * 7919 + agentName.charCodeAt(0));
      return {
        agentId,
        name: agentName,
        phone: `+92300${(1000000 + Math.floor(agentRand() * 8999999)).toString()}`,
        email: `${agentId}@farshezameen.com`,
        agencyName: ownerType === 'Owner' ? undefined : pick(agentRand, AGENCY_NAMES),
      };
    })(),

    contactVisibility: 'Public',
    waterSupply: pick(rand, WATER_SUPPLY),
    electricityBackup: pick(rand, ELECTRICITY_BACKUP),
    parkingSpaces: Math.floor(rand() * 4),

    description: `This ${propertyCategory.toLowerCase()} in ${loc.area}, ${loc.city} offers a comfortable space with modern amenities, ideal for families and professionals alike.`,
    datePosted: new Date(GENERATION_EPOCH - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
    isFeatured: rand() > 0.8,
    views: Math.floor(rand() * 500),
    images: pickMultiple(rand, PROPERTY_IMAGES, 2),
  };
}
