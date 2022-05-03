#!/bin/bash

source tools/shell/utils/colors.sh ''
source tools/shell/utils/print-utils.sh ''

##
# Prints script usage instructions.
##
reportUsage() {
  printInfoTitle "<< ${0} usage >>"
  printUsageTip "bash tools/shell/env.sh ?" "print help"
  printUsageTip "bash tools/shell/env.sh cleanup" "remove the .env file located in the project root (mainly used in CI environment after executing jobs)"
  printUsageTip "bash tools/shell/env.sh create" "create the .env file with the default values"
  printUsageTip "bash tools/shell/env.sh create \"\$APP_DB_NAME\" \"\$DB_NAME\" \"\$DB_CONNECTION_STRING\" \"\$DB_CONNECTION_STRING_REMOTE\"" "create the .env file with arbitrary values passed via the script arguments"
  printGap
}

##
# Create the .env file in the project root.
##
createEnvFile() {
  printInfoTitle "<< Creating .env file in the project root >>"
  printGap

  local ENV_FILE_LOCATION
  ENV_FILE_LOCATION=./.env

  if [ -f "$ENV_FILE_LOCATION" ]; then
    printWarningMessage "The .env file already exists in the project root."
    printGap
    exit 0
  fi

  local APP_DB_NAME_DEFAULT
  APP_DB_NAME_DEFAULT="portal"
  local DB_NAME_DEFAULT
  DB_NAME_DEFAULT="admin"
  local DB_CONNECTION_STRING_DEFAULT
  DB_CONNECTION_STRING_DEFAULT="mongodb://admin:password@127.0.0.1:27017"

  local APP_DB_NAME
  APP_DB_NAME="${1:-$APP_DB_NAME_DEFAULT}"
  local DB_NAME
  DB_NAME="${2:-$DB_NAME_DEFAULT}"
  local DB_CONNECTION_STRING
  DB_CONNECTION_STRING="${3:-$DB_CONNECTION_STRING_DEFAULT}"
  local DB_CONNECTION_STRING_REMOTE
  DB_CONNECTION_STRING_REMOTE="${4:-$DB_CONNECTION_STRING_DEFAULT}"

  {
    echo "APP_DB_NAME=\"$APP_DB_NAME\""
    echo "DB_NAME=\"$DB_NAME\""
    echo "DB_CONNECTION_STRING=\"$DB_CONNECTION_STRING\""
    echo "DB_CONNECTION_STRING_REMOTE=\"$DB_CONNECTION_STRING_REMOTE\""
  } >"$ENV_FILE_LOCATION"

  printSuccessMessage "OK: environment variables set"
  printNameAndValue "out dir" "$ENV_FILE_LOCATION"
  printGap
}

##
# Removes the .env file located in the project root.
##
cleanUp() {
  printInfoTitle "<< Removing .env file located in the project root >>"
  printGap

  rm -rf "$ENV_FILE_LOCATION"
}

if [ "$1" == "?" ]; then
  reportUsage
elif [ "$1" == "cleanup" ]; then
  cleanUp
elif [ "$1" == "create" ]; then
  createEnvFile "$2" "$3" "$4" "$5"
else
  reportUsage
  exit 1
fi
