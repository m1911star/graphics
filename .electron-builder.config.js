/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const version  = '0.1';
const productName = "Horus";
const winExt = 'exe';
module.exports = {
  // appId: "lhlxtl@gmail.com",
  productName: "Hello Horus",
  copyright: "Copyright © 2022 Horus",
  // asar: true,
  directories: {
    output: "release/0.1",
    buildResources: "build",
  },
  files: ["dist"],
  win: {
    target: [
      {
        target: "nsis",
        arch: ["x64"],
      },
    ],
    artifactName: `${productName}-${version}-Setup.exe`,
  },
  nsis: {
    oneClick: false,
    perMachine: false,
    allowToChangeInstallationDirectory: true,
    deleteAppDataOnUninstall: false,
  },
  mac: {
    target: ["dmg"],
    artifactName: `${productName}-${version}-Installer.dmg`,
  }
}
