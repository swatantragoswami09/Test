import referral from "../models/referral";
import mongoose from "mongoose";

export const getAllReferrals = async (req, res) => {
  try {
    const referrals = await referral.find();
    // Send the users data as a response to the frontend
    res.status(200).json(referrals);
  } catch (error) {
    // Handle any errors
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getReferralsById = async (req, res) => {
  try {
    const { userId } = req.body;
    console.log("userId: " + userId);
    const referal = await referral
      .find({
        userId: mongoose.Types.ObjectId(userId),
      })
      .exec();
    if (!referal) return res.status(404).json({ error: "referral not found" });
    console.log(referal);
    res.status(200).send({ user: referal });
  } catch (error) {
    console.log(error);
  }
};
