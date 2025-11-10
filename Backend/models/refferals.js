import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ReferralSchema = new Schema({
  referralId: {
    type: String,
    unique: true,
  },
  referralLink: {
    type: String,
    unique: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  referrals: [],
  bv: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model("referral", ReferralSchema);
