import fs from "fs";
import handlebars from "handlebars";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const htmlTemplate = (templatePath, data) => {
  const filePath = path.join(__dirname, templatePath);
  const source = fs.readFileSync(filePath, "utf8");
  const template = handlebars.compile(source);

  return template(data);
};
