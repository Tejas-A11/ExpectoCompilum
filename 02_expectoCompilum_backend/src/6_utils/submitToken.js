//during create and update problem handlers
//after submitBatch returns tokens for each entry, they are validated here and returned with status_id, and if all status ids are >=3, then they are further stored in db else it is handled in while true loop until all of the codes are >=3
const axios = require("axios");

const waiting = (timer) => {
    return new Promise((resolve) => {
        setTimeout(resolve, timer);
    });
};

const submitToken = async (resultTokens) => {
    const options = {
        method: "GET",
        url: process.env.JUDGE0_API,
        params: {
            tokens: resultTokens.join(","),
            base64_encoded: "false",
            fields: "*"
        }
    };

    async function fetchData() {
        try {
            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            console.error(error.response?.data || error.message);
            throw error;
        }
    }

    while (true) {
        const result = await fetchData();

        const isObtained = result.submissions.every(
            (submission) => submission.status.id > 2
        );

        if (isObtained) {
            return result.submissions;
        }

        await waiting(1000);
    }
};

module.exports = submitToken;