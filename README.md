# Mongo

MongoDB docker images.

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## Workflows

| Trigger                            | Badge                                                                                                                                                                        |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PR open event (destination: trunk) | [![pr-validation](https://github.com/rfprod/mongo/actions/workflows/pr-validation.yml/badge.svg)](https://github.com/rfprod/mongo/actions/workflows/pr-validation.yml)       |
| CodeQL analysis                    | [![codeql-alalysis](https://github.com/rfprod/mongo/actions/workflows/codeql-alalysis.yml/badge.svg)](https://github.com/rfprod/mongo/actions/workflows/codeql-alalysis.yml) |

## Requirements

In order to run own copy of the project one must fulfill the following requirements.

### Supported operating systems

- [Debian based Linux](https://en.wikipedia.org/wiki/List_of_Linux_distributions#Debian-based)
- [OSX](https://en.wikipedia.org/wiki/MacOS)
- [Windows](https://en.wikipedia.org/wiki/Microsoft_Windows)

### Core dependencies

- [Node.js](https://nodejs.org/)
- [NPM](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/) - preferred package manager
- [Git](https://git-scm.com/)
- [Bash 5](https://www.gnu.org/software/bash/)

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

## Technologies Reference

### Container engine

- [Docker](https://www.docker.com/)

### Database

- [MongoDB](https://mongodb.com/)

### CI

- [GitHub Actions](https://github.com/features/actions)

### Development methodology

- [Trunk based development](https://trunkbaseddevelopment.com/)
