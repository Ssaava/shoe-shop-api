import { connectDB } from "./config/db.config.js";
import { PORT } from "./config/env.config.js";
import app from "./app.js";

connectDB().then(() => {
  app.listen(PORT, () => console.log(`App listening on port: ${PORT}`));
});
