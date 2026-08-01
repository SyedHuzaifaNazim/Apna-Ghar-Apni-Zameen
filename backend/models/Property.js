import mongoose from 'mongoose';

/**
 * Real, user-created listings. Field shape mirrors the frontend's Property
 * type (types/property.ts) and the mock generator's output exactly, so both
 * sources can be blended into one feed and rendered by the same components.
 */
const PropertySchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },

    title: { type: String, required: true, trim: true, maxlength: 120 },
    listingType: { type: String, required: true, enum: ['For Sale', 'For Rent', 'Auction', 'Short Term Rent'] },
    propertyCategory: { type: String, required: true },

    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'PKR' },
    areaSize: { type: Number, required: true, min: 1 },
    areaUnit: { type: String, required: true, enum: ['sqft', 'sq-yard', 'acre', 'kanal', 'marla'] },

    address: {
      city: { type: String, required: true, trim: true },
      area: { type: String, required: true, trim: true },
      line1: { type: String, required: true, trim: true },
      postalCode: { type: String, default: '' },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },

    bedrooms: { type: Number, default: 0, min: 0 },
    bathrooms: { type: Number, default: 0, min: 0 },
    floorLevel: { type: Number, default: null },
    furnishing: { type: String, enum: ['Furnished', 'Semi-Furnished', 'Unfurnished'], default: 'Unfurnished' },

    yearBuilt: { type: Number, default: () => new Date().getFullYear() },
    propertyCondition: {
      type: String,
      enum: ['New', 'Renovated', 'Well-Maintained', 'Old'],
      default: 'Well-Maintained',
    },

    amenities: { type: [String], default: [] },
    features: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    nearbyLandmarks: { type: [{ name: String, distanceKm: Number }], default: [] },

    ownerType: { type: String, enum: ['Owner', 'Agent', 'Developer'], default: 'Owner' },
    ownerDetails: {
      agentId: { type: String, required: true },
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
      agencyName: { type: String },
    },
    ownerUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

    contactVisibility: { type: String, enum: ['Public', 'Verified Users Only'], default: 'Public' },
    waterSupply: { type: String, enum: ['Available', 'Not Available'], default: 'Available' },
    electricityBackup: { type: String, enum: ['None', 'Partial', 'Full'], default: 'None' },
    parkingSpaces: { type: Number, default: 0, min: 0 },

    description: { type: String, default: '', maxlength: 4000 },
    datePosted: { type: Date, default: Date.now },
    isFeatured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    images: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const Property = mongoose.model('Property', PropertySchema);
