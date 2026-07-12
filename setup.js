#!/usr/bin/env node
// ============================================================
// WeightSynth — setup.js
// Execute: node setup.js
// Preenche automaticamente os dados do projeto
// ============================================================

const fs   = require("fs");
const path = require("path");
const rl   = require("readline").createInterface({
  input: process.stdin, output: process.stdout,
});

const ask = (q) => new Promise((res) => rl.question(q, res));

const replace = (file, map) => {
  let content = fs.readFileSync(file, "utf8");
  for (const [from, to] of Object.entries(map)) {
    content = content.split(from).join(to);
  }
  fs.writeFileSync(file, content, "utf8");
};

async function main() {
  console.log("\n╔══════════════════════════════════════╗");
  console.log("║   WeightSynth — Setup Inicial        ║");
  console.log("╚══════════════════════════════════════╝\n");
  console.log("Responda as perguntas abaixo.");
  console.log("Pressione Enter para pular (mantém o valor padrão).\n");

  // ── Coleta de dados ──────────────────────────────────────
  const email = await ask("Seu e-mail de contato: ");
  const pkg   = await ask("Package name Android (ex: com.wenson.weightsynth): ");
  const bundle= await ask("Bundle ID iOS (Enter para usar o mesmo do Android): ");
  const privacyUrl = await ask("URL da política de privacidade (ex: https://usuario.github.io/...): ");
  const appleId    = await ask("Apple ID (e-mail Apple Developer, Enter para pular): ");
  const ascAppId   = await ask("App Store Connect App ID (número, Enter para pular): ");
  const appleTeam  = await ask("Apple Team ID (10 caracteres, Enter para pular): ");

  rl.close();

  const bundleId = bundle.trim() || pkg.trim() || "com.seudominio.weightsynth";
  const packageId = pkg.trim() || "com.seudominio.weightsynth";
  const emailVal  = email.trim() || "seuemail@email.com";
  const privUrl   = privacyUrl.trim() || "https://seusite.com/privacy-policy.html";

  console.log("\n🔧 Aplicando configurações...\n");

  // app.json
  if (packageId !== "com.seudominio.weightsynth") {
    replace("app.json", {
      "com.seudominio.weightsynth": packageId,
    });
    // bundle iOS
    if (bundleId !== packageId) {
      const appJson = JSON.parse(fs.readFileSync("app.json", "utf8"));
      appJson.expo.ios.bundleIdentifier = bundleId;
      fs.writeFileSync("app.json", JSON.stringify(appJson, null, 2));
    }
    console.log("  ✓ app.json atualizado");
  }

  // eas.json
  const easMap = {};
  if (appleId.trim())   easMap["SEU_APPLE_ID@email.com"]          = appleId.trim();
  if (ascAppId.trim())  easMap["SEU_APP_ID_APPSTORE_CONNECT"]      = ascAppId.trim();
  if (appleTeam.trim()) easMap["SEU_TEAM_ID"]                      = appleTeam.trim();
  if (Object.keys(easMap).length > 0) {
    replace("eas.json", easMap);
    console.log("  ✓ eas.json atualizado");
  }

  // privacy-policy.html
  replace("privacy-policy.html", {
    "seuemail@email.com": emailVal,
  });
  console.log("  ✓ privacy-policy.html atualizado");

  // STORE_LISTING.md
  replace("STORE_LISTING.md", {
    "seuemail@email.com": emailVal,
  });
  console.log("  ✓ STORE_LISTING.md atualizado");

  // Gerar .env com URL da política (para referência)
  fs.writeFileSync(".env.setup", [
    `EMAIL=${emailVal}`,
    `PACKAGE=${packageId}`,
    `BUNDLE_ID=${bundleId}`,
    `PRIVACY_URL=${privUrl}`,
    appleId    ? `APPLE_ID=${appleId.trim()}`       : "",
    ascAppId   ? `ASC_APP_ID=${ascAppId.trim()}`    : "",
    appleTeam  ? `APPLE_TEAM=${appleTeam.trim()}`   : "",
  ].filter(Boolean).join("\n") + "\n");
  console.log("  ✓ .env.setup criado com seus dados");

  console.log("\n╔══════════════════════════════════════╗");
  console.log("║   Setup concluído!                   ║");
  console.log("╚══════════════════════════════════════╝\n");
  console.log("Próximos passos:");
  console.log("  1. npm install");
  console.log("  2. npx expo start   (testar no celular)");
  console.log("  3. eas login");
  console.log("  4. eas build --platform android --profile preview");
  console.log("     (gera APK para testar sem precisar da Play Store)\n");
  console.log(`  5. Hospedar privacy-policy.html em:`);
  console.log(`     ${privUrl}\n`);
  console.log("  Leia o arquivo REVISAO.md para todos os detalhes.\n");
}

main().catch((e) => { console.error(e); process.exit(1); });
