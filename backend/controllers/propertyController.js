import { asyncHandler } from '../middleware/errorHandler.js';
import { nextPropertyId } from '../models/Counter.js';
import { Property } from '../models/Property.js';
import { User } from '../models/User.js';
import { generateMockProperty, TOTAL_MOCK_PROPERTIES } from '../utils/mockPropertyGenerator.js';
import { toClientProperty } from '../utils/toClientProperty.js';

const slugify = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const REQUIRED_FIELDS = ['title', 'listingType', 'propertyCategory', 'price', 'areaSize', 'areaUnit', 'address'];

const validatePayload = (body) => {
  const missing = REQUIRED_FIELDS.filter(field => body[field] === undefined || body[field] === null || body[field] === '');
  if (missing.length > 0) return `Missing fields: ${missing.join(', ')}`;

  const address = body.address || {};
  if (!address.city || !address.area || !address.line1) return 'Address must include city, area, and line1.';
  if (typeof address.latitude !== 'number' || typeof address.longitude !== 'number') {
    return 'Please choose a location on the map.';
  }
  if (typeof body.price !== 'number' || body.price <= 0) return 'Price must be a positive number.';
  if (typeof body.areaSize !== 'number' || body.areaSize <= 0) return 'Area size must be a positive number.';
  if (!Array.isArray(body.images) || body.images.length === 0) return 'At least one photo is required.';

  return null;
};

// Real listings are always shown first (newest posted, most relevant to
// users), with the mock pool filling out the rest of the feed underneath —
// this is the simplest way to blend the two sources without a full rewrite
// of the pagination math to page across both simultaneously.
export const listProperties = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.max(1, parseInt(req.query.limit) || 20);

  const realDocs = await Property.find().sort({ datePosted: -1 });
  const real = realDocs.map(toClientProperty);

  const total = real.length + TOTAL_MOCK_PROPERTIES;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;

  const data = [];
  for (let i = startIndex; i < startIndex + limit && i < total; i++) {
    if (i < real.length) {
      data.push(real[i]);
    } else {
      data.push(generateMockProperty(i - real.length));
    }
  }

  res.json({ total, totalPages, page, limit, data });
});

export const getPropertyById = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id) || id < 0) {
    return res.status(404).json({ status: 'error', error: 'Property not found.' });
  }

  if (id < TOTAL_MOCK_PROPERTIES) {
    return res.json(generateMockProperty(id));
  }

  const doc = await Property.findOne({ id });
  if (!doc) return res.status(404).json({ status: 'error', error: 'Property not found.' });

  res.json(toClientProperty(doc));
});

export const listMyProperties = asyncHandler(async (req, res) => {
  const docs = await Property.find({ ownerUser: req.user.id }).sort({ datePosted: -1 });
  res.json({ data: docs.map(toClientProperty) });
});

export const createProperty = asyncHandler(async (req, res) => {
  const error = validatePayload(req.body);
  if (error) return res.status(400).json({ status: 'error', error });

  // The JWT payload only carries id/email/role (see authController.signToken) —
  // name and phone have to come from the DB, not req.user.
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ status: 'error', error: 'User not found.' });

  const id = await nextPropertyId();
  const agentId = slugify(user.name || user.email);

  const doc = await Property.create({
    ...req.body,
    id,
    ownerUser: user.id,
    ownerType: user.role === 'agent' ? 'Agent' : 'Owner',
    ownerDetails: {
      agentId,
      name: user.name,
      phone: req.body.contactPhone || user.phone || '',
      email: user.email,
      agencyName: req.body.agencyName || undefined,
    },
  });

  res.status(201).json(toClientProperty(doc));
});

export const updateProperty = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(404).json({ status: 'error', error: 'Property not found.' });

  const doc = await Property.findOne({ id });
  if (!doc) return res.status(404).json({ status: 'error', error: 'Property not found.' });

  if (doc.ownerUser.toString() !== req.user.id) {
    return res.status(403).json({ status: 'error', error: 'You can only edit your own listings.' });
  }

  const error = validatePayload({ ...doc.toObject(), ...req.body });
  if (error) return res.status(400).json({ status: 'error', error });

  const { id: _ignoredId, ownerUser: _ignoredOwner, ownerDetails: _ignoredOwnerDetails, ...updates } = req.body;
  Object.assign(doc, updates);
  await doc.save();

  res.json(toClientProperty(doc));
});

export const deleteProperty = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(404).json({ status: 'error', error: 'Property not found.' });

  const doc = await Property.findOne({ id });
  if (!doc) return res.status(404).json({ status: 'error', error: 'Property not found.' });

  if (doc.ownerUser.toString() !== req.user.id) {
    return res.status(403).json({ status: 'error', error: 'You can only delete your own listings.' });
  }

  await doc.deleteOne();
  res.json({ status: 'ok' });
});
