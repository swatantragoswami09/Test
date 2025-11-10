import { getAllReferrals, getReferralsById } from "../controllers/referral";

router.post("/getReferralsById", getReferralsById);

module.exports = router;
