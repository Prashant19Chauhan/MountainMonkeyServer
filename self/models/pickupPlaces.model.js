import mongoose from "mongoose";

const pickupPlaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  pickupPointType: {
    type: String,
    enum: ["airport", "railway", "bus stand"]
  },
  coordinates: {
    lat: Number,
    lng: Number
  }
})

export default mongoose.model("PickupPlace", pickupPlaceSchema);