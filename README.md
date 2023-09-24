# Mongo

MongoDB docker container image with automation utilities.

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## Workflows

| Info                                                       | Trigger                            | Badge                                                                                                                                                                        |
| ---------------------------------------------------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [:information_source:](# 'Quality gates.')                 | PR open event (destination: trunk) | [![validate-pr](https://github.com/rfprod/mongo/actions/workflows/validate-pr.yml/badge.svg)](https://github.com/rfprod/mongo/actions/workflows/validate-pr.yml)             |
| [:information_source:](# 'Source code security scanning.') | CodeQL analysis                    | [![codeql-analysis](https://github.com/rfprod/mongo/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/rfprod/mongo/actions/workflows/codeql-analysis.yml) |

## Requirements

In order to run own copy of the project one must fulfill the following requirements.

### Supported operating system

- :trophy: [Debian based Linux](https://en.wikipedia.org/wiki/List_of_Linux_distributions#Debian-based) - `recommended`
  - check out [this dev setup instructions](https://github.com/rfprod/wdsdu) to facilitate setting up the dev environment;
  - one will have to install MongoDB oneself;
  - given that the dev environment is set up, the following commands should install everything needed to work with the project;
    ```bash
    yarn install:shellcheck:linux && yarn install
    ```
- :ok: [OSX](https://en.wikipedia.org/wiki/MacOS) - `should work due to the similarities with Linux`
  - one will have to figure out oneself how to set up the dev environment;
  - one will have to install MongoDB oneself;
  - given that the dev environment is set up, the following commands should install everything needed to work with the project;
    ```bash
    yarn install:shellcheck:linux && yarn install
    ```
- 🤷 [Windows](https://en.wikipedia.org/wiki/Microsoft_Windows) - `should work, but no guarantees`
  - one will have to figure out oneself how to set up the dev environment;
  - one will have to install MongoDB oneself;
  - given that the dev environment is set up, the following commands should be used to install `shellcheck` via PowerShell;
    ```powershell
    iwr -useb get.scoop.sh | iex
    scoop install shellcheck
    ```
  - recommended shell: [Git for Windows](https://gitforwindows.org/) > `Git BASH`.

### Core dependencies

- [Bash 5](https://www.gnu.org/software/bash/)
- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)

### Recommended IDE

- [VSCode](https://code.visualstudio.com/)

## Package scripts reference

The project has lots of package scripts, check it in the `package.json` located in the project root, or use the following command (see terminal output for usage tips)

```bash
yarn workspace:help
```

## Committing changes to repo

Using [commitizen cli](https://github.com/commitizen/cz-cli) is mandatory.

Provided all dependencies are installed, and [commitizen cli is installed as a global dependency](https://github.com/commitizen/cz-cli#conventional-commit-messages-as-a-global-utility), this command must be used.

```bash
git cz
```

## Environment variables setup

Manualy create the `.env` file in the project root with the following content

```bash
DB_NAME="admin"
DB_CONNECTION_STRING="mongodb://admin:password@127.0.0.1:27017" # replace the default values of the login and the password as needed
DB_CONNECTION_STRING_REMOTE="mongodb://admin:password@127.0.0.1:27017" # put a value here after deploying the database container
```

or execute the following command to create the `.env` file with the default values in the project root

```bash
yarn env:create
```

To set arbitrary values of the variable in the .env file, pass the variables via arguments, see help

```bash
yarn env:help
```

## Technologies Reference

### Container engine

- [Docker](https://www.docker.com/)

### Database

- [MongoDB](https://mongodb.com/)

### CI

- [GitHub Actions](https://github.com/features/actions)

### Development methodology

- [Trunk based development](https://trunkbaseddevelopment.com/)

## Disclaimers

All logos are the property of their respective owners.
