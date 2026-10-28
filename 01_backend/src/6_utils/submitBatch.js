//during create and update problem handlers
//submits the reference codes to verify whether they are correct or not before putting them in db, this code returns tokens for each entry and do not compile or run the code, then these tokens are sent to submitToken function
const axios = require("axios");

const submitBatch = async (submissions) => {
    try {
        const response = await axios.post(
            process.env.JUDGE0_API,
            {
                submissions
            },
            {
                params: {
                    base64_encoded: "false"
                },
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error(error.response?.data || error.message);
        throw error;
    }
};

module.exports = submitBatch;