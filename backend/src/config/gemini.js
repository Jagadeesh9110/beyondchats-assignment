import axios from "axios";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not defined");
}

export const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + GEMINI_API_KEY;

const callGemini = async (prompt) => {
    try {
        const response = await axios.post(GEMINI_URL, {
            contents: [
                {
                    parts: [{ text: prompt }]
                }
            ]
        },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        const text =
            response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            throw new Error("Empty response from Gemini");
        }

        return text;
    } catch (err) {
        console.log("Error in callGemini", err.message);
        throw err;
    }
}

export default callGemini;
