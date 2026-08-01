import mongoose from 'mongoose';

// Mock properties occupy ids 0-99 (see utils/mockPropertyGenerator.js), so
// real, user-created listings start well above that range to avoid any
// collision, with atomic $inc guaranteeing uniqueness under concurrent posts.
const STARTING_ID = 100000;

const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: STARTING_ID },
});

const Counter = mongoose.model('Counter', CounterSchema);

export async function nextPropertyId() {
  // $inc and a schema default can't be applied in the same upsert (Mongo
  // rejects "$inc" and "$setOnInsert" touching the same path), so the
  // starting value has to be seeded in a separate no-op upsert first —
  // otherwise $inc silently initializes an absent field to 0, and the very
  // first id would be 1, colliding with the mock pool's 0-99 range.
  await Counter.updateOne({ _id: 'propertyId' }, { $setOnInsert: { seq: STARTING_ID } }, { upsert: true });
  const counter = await Counter.findByIdAndUpdate('propertyId', { $inc: { seq: 1 } }, { new: true });
  return counter.seq;
}
