import axios from "axios";

export async function verifyDocument(file: any) {
  try {
    const response = await axios.post(
      process.env.AI_MODEL_URL as string,
      file
    );

    return response.data;

  } catch (error) {
    throw new Error("AI verification failed");
  }
}