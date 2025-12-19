import dotenv from "dotenv";
import connectDB from "./databases/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("App Failed to Listen: ", error);
    });

    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at post: ${process.env.PORT}`);
    });
  })
  .catch(() => {
    console.log("MONGODB connection Failed !!!", error);
  });
