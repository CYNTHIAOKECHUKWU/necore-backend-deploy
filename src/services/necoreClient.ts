import axios from "axios";
import FormData from "form-data";

const BASE_URL = "https://necore.onrender.com";


export async function uploadDocument(
  file: any,
  sessionId: string,
  documentType: string
) {

  try {

    const formData = new FormData();

    formData.append("file", file.buffer, file.originalname);
    formData.append("session_id", sessionId);
    formData.append("country_code", "NG");
    formData.append("document_type", documentType);
    formData.append("is_primary", "true");

    const response = await axios.post(
      `${BASE_URL}/kyc/documents/upload`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          "X-User-ID": sessionId
        }
      }
    );

    return response.data;

  } catch (error: any) {

    console.log("NECore DOCUMENT UPLOAD ERROR:");
    console.log(error.response?.data);

    throw error;
  }
}


//submitKYC
export async function submitKYC(
  sessionId: string,
  documentId: string,
  documentType: string
) {

  try {

   const response = await axios.post(
  `${BASE_URL}/kyc/submit`,
  {
    session_id: sessionId,
    primary_document_id: documentId,
    selfie_id: "demo_selfie", // bypass
    declaration: true
  },
  {
    headers: {
      "X-User-ID": sessionId
    }
    
  }
  
);
   console.log("SUBMIT RESULT:", response.data);
    return response.data;

  } catch (error: any) {

    
    console.log("NECore SUBMIT ERROR:");
    console.dir(error.response?.data, { depth: null });
    
    

    throw error;

  }
}