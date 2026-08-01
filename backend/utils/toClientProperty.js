/** Serializes a persisted Property document into the exact shape the frontend's Property type expects. */
export function toClientProperty(doc) {
  return {
    id: doc.id,
    title: doc.title,
    listingType: doc.listingType,
    propertyCategory: doc.propertyCategory,

    price: doc.price,
    currency: doc.currency,
    areaSize: doc.areaSize,
    areaUnit: doc.areaUnit,

    address: {
      city: doc.address.city,
      area: doc.address.area,
      line1: doc.address.line1,
      postalCode: doc.address.postalCode || '',
      latitude: doc.address.latitude,
      longitude: doc.address.longitude,
    },

    bedrooms: doc.bedrooms,
    bathrooms: doc.bathrooms,
    floorLevel: doc.floorLevel ?? null,
    furnishing: doc.furnishing,

    yearBuilt: doc.yearBuilt,
    propertyCondition: doc.propertyCondition,

    amenities: doc.amenities,
    features: doc.features,
    tags: doc.tags,
    nearbyLandmarks: doc.nearbyLandmarks,

    ownerType: doc.ownerType,
    ownerDetails: {
      agentId: doc.ownerDetails.agentId,
      name: doc.ownerDetails.name,
      phone: doc.ownerDetails.phone,
      email: doc.ownerDetails.email,
      agencyName: doc.ownerDetails.agencyName,
    },
    // Not part of the frontend Property type's core fields, but included so the
    // client can gate "Edit/Delete" controls without a second round trip.
    ownerUserId: doc.ownerUser.toString(),

    contactVisibility: doc.contactVisibility,
    waterSupply: doc.waterSupply,
    electricityBackup: doc.electricityBackup,
    parkingSpaces: doc.parkingSpaces,

    description: doc.description,
    datePosted: doc.datePosted.toISOString(),
    isFeatured: doc.isFeatured,
    views: doc.views,
    images: doc.images,
  };
}
