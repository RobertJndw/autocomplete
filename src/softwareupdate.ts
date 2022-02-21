const commonOpt: Fig.Option[] = [
  {
    name: ["--all", "-a"],
    description:
      "All updates that are applicable to your system, including those non-recommended ones",
  },
  {
    name: ["--recommended", "-r"],
    description: "All updates that are recommended for your system",
  },
  {
    name: "--os-only",
    description: "Only macOS updates",
  },
  {
    name: "--safari-only",
    description: "Only safari updates",
  },
  {
    name: "--stdinpass",
    description: "Password to authenticate as an owner. Apple Silicon only",
  },
  {
    name: "--user",
    description:
      "Local username to authenticate as an owner. Apple Silicon only",
  },
];

const commonArg: Fig.Arg = {
  name: "label",
  description: "Specific updates",
  isVariadic: true,
};

const fullInstallerGenerator: Fig.Generator = {
  script: "softwareupdate --list-full-installers",
  postProcess: function (out) {
    return out
      .split("\n")
      .filter((line) => line.startsWith("*"))
      .map((line) => {
        const {
          groups: { name, version, size, build },
        } = /\* Title: (?<name>.*), Version: (?<version>[0-9.]+), Size: (?<size>\d+)K, Build: (?<build>[0-9A-Z]+)/.exec(
          line
        );
        return {
          name: version,
          description: `${name} ${version} (${build}) Size: ${(
            parseInt(size) / Math.pow(1000, 3)
          ).toFixed(2)}GB`,
        };
      });
  },
};

const completionSpec: Fig.Spec = {
  name: "softwareupdate",
  description: "System software update tool for MacOS",
  subcommands: [
    {
      name: ["--list", "-l"],
      description: "List all appropriate update labels",
    },
    {
      name: ["--download", "-d"],
      description: "Download Only",
      options: [...commonOpt],
      args: commonArg,
    },
    {
      name: ["--install", "-i"],
      description: "Install",
      options: [...commonOpt],
      args: commonArg,
    },
    {
      name: "--list-full-installers",
      description: "List the available macOS Installers",
    },
    {
      name: "--fetch-full-installer",
      description: "Install the latest recommended macOS Installer",
      options: [
        {
          name: "--full-installer-version",
          description: "The version of macOS to install",
          args: {
            name: "macOS version",
            generators: fullInstallerGenerator,
          },
        },
      ],
    },
    {
      name: "--install-rosetta",
      description: "Install Rosetta 2",
    },
    {
      name: "--background",
      description: "Trigger a background scan and update operation",
    },
    {
      name: "--dump-state",
      description:
        "Log the internal state of the SU daemon to /var/log/install.log",
    },
    {
      name: "--evaluate-products",
      description:
        "Evaluate a list of product keys specified by the --products option",
    },
    {
      name: "--history",
      description:
        "Show the install history.  By default, only displays updates installed by softwareupdate",
    },
    {
      name: "--all",
      description: "Include all processes in history (including App installs)",
    },
  ],
  options: [
    {
      name: "--no-scan",
      description:
        "Do not scan when listing or installing updates (use available updates previously scanned)",
    },
    {
      name: "--product-types",
      description:
        "Limit a scan to a particular product type only - ignoring all others",
      args: {
        name: "<type>",
        suggestions: [{ name: "macOS" }, { name: "Safari" }],
      },
    },
    {
      name: "--products",
      description:
        "A comma-separated (no spaces) list of product keys to operate on",
    },
    {
      name: "--force",
      description: "Force an operation to complete",
    },
    {
      name: "--agree-to-license",
      description:
        "Agree to the software license agreement without user interaction",
    },
    {
      name: "--verbose",
      description: "Enable verbose output",
    },
    {
      name: ["--help", "-h"],
      description: "Print help",
    },
  ],
};
export default completionSpec;
