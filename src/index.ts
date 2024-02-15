import dotenv from "dotenv";
dotenv.config();

import app from "@/app";

const PORT = process.env.SERVER_PORT || 6300;

app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
