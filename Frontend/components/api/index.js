export const getReferralByIdApi = async (userId) => {
  try {
    const res = await axios.post(`/api/getReferralsById`, {
      userId: userId,
    });
    return res;
  } catch (error) {
    console.log(error.message);
  }
};
