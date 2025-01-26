// fixGrpcPodfile.js

const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * Indsætter en linje i post_install-blokken for at sætte CLANG_CXX_LANGUAGE_STANDARD = c++14.
 */
function addGrpcFixToPodfile(contents) {
  // Hvis vi allerede har lagt vores snippet ind, skal vi ikke gøre det igen
  if (contents.includes("target.name == 'gRPC-Core'")) {
    return contents;
  }

  // Hvis der allerede findes en 'post_install do |installer| ... end' blok,
  // så sætter vi vores ændring ind i dén blok.
  if (contents.match(/post_install do \|installer\|/)) {
    return contents.replace(
      /post_install do \|installer\|\n((?:(?!end).)*)\nend/m,
      (match, p1) => {
        return `post_install do |installer|
  ${p1}
  # [ADDED BY fixGrpcPodfile.js]
  installer.pods_project.targets.each do |target|
    if target.name == 'gRPC-Core'
      target.build_configurations.each do |config|
        config.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'c++14'
      end
    end
  end`;
      }
    );
  } else {
    // Hvis der slet ikke er en post_install-blok, appender vi én til sidst
    return (
      contents +
      `

post_install do |installer|
  # [ADDED BY fixGrpcPodfile.js]
  installer.pods_project.targets.each do |target|
    if target.name == 'gRPC-Core'
      target.build_configurations.each do |config|
        config.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'c++14'
      end
    end
  end
end
`
    );
  }
}

/**
 * Dette er selve plugin-funktionen.
 */
const withGrpcPodfileFix = (config) => {
  return withDangerousMod(config, [
    'ios',
    config => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');

      if (!fs.existsSync(podfilePath)) {
        // Ingen Podfile genereret endnu - vend bare tilbage
        return config;
      }

      let podfileContents = fs.readFileSync(podfilePath, 'utf-8');
      let updatedPodfile = addGrpcFixToPodfile(podfileContents);

      if (updatedPodfile !== podfileContents) {
        fs.writeFileSync(podfilePath, updatedPodfile, 'utf-8');
      }

      return config;
    },
  ]);
};

module.exports = withGrpcPodfileFix;
