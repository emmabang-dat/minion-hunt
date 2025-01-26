const fs = require("fs");
const path = require("path");
const { withDangerousMod } = require("@expo/config-plugins");

// Denne funktion læser den genererede Podfile og tilføjer "use_modular_headers!"
function addUseModularHeaders(content) {
  // Hvis Podfile allerede indeholder "use_modular_headers!", så gør ikke mere
  if (content.includes("use_modular_headers!")) {
    return content;
  }

  // Typisk vil man se "use_expo_modules!" i Podfile.
  // Her tilføjer vi "use_modular_headers!" på linjen efter.
  return content.replace(
    "use_expo_modules!",
    "use_expo_modules!\n  use_modular_headers!"
  );
}

const withModularHeadersPodfile = (config) => {
  return withDangerousMod(config, [
    "ios",
    async (config) => {
      // Sti til den genererede Podfile
      const podfilePath = path.join(
        config.modRequest.platformProjectRoot,
        "Podfile"
      );

      // Læs Podfile
      let podfileContents = await fs.promises.readFile(podfilePath, "utf8");

      // Tilføj "use_modular_headers!"
      podfileContents = addUseModularHeaders(podfileContents);

      // Skriv ændret Podfile tilbage
      await fs.promises.writeFile(podfilePath, podfileContents);

      return config;
    },
  ]);

};

module.exports = (config) => {
  // Her kan du evt. tilføje flere modifikationer, hvis det er nødvendigt.
  // Vi sørger for at patch'e Podfile med "use_modular_headers!"
  config = withModularHeadersPodfile(config);
  return config;
};
