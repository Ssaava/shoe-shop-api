import app from "./app.js";
import { connectDB } from "./config/db.config.js";
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`App listening on port: ${PORT}`));
});
