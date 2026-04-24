const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const envFile = process.argv[2];
const outFile = process.argv[3];
const minify = process.argv.includes("--minify");

if (!envFile || !outFile) {
  console.error(
    "Usage: node scripts/build.js <env-file> <out-file> [--minify]",
  );
  process.exit(1);
}

function build() {
  try {
    // Load env
    const envPath = path.resolve(process.cwd(), envFile);
    if (!fs.existsSync(envPath)) {
      console.error(`Env file not found: ${envPath}`);
      process.exit(1);
    }

    const envContent = fs.readFileSync(envPath, "utf8");
    const apiUrlMatch = envContent.match(/API_URL=(.+)/);

    if (!apiUrlMatch) {
      console.error(`API_URL not found in ${envFile}`);
      process.exit(1);
    }

    const apiUrl = apiUrlMatch[1].trim();
    console.log(`Building with API_URL: ${apiUrl}`);

    // Read source
    let content = fs.readFileSync("mira-widget.js", "utf8");

    // Replace placeholder
    content = content.replace("__API_URL__", apiUrl);

    // Create dist if not exists
    const distDir = path.dirname(path.resolve(process.cwd(), outFile));
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }

    // Write temp or final file
    fs.writeFileSync(outFile, content);
    console.log(`Successfully created: ${outFile}`);

    if (minify) {
      console.log(`Minifying ${outFile}...`);
      // Use npx to ensure terser is available if not in path,
      // but package.json has it in devDeps
      try {
        execSync(`npx terser ${outFile} -o ${outFile} -c -m`);
        console.log(`Minified: ${outFile}`);
      } catch (terserErr) {
        console.error("Minification failed:", terserErr.message);
      }
    }
  } catch (err) {
    console.error("Build failed:", err.message);
    process.exit(1);
  }
}

build();
