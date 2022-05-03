#!/bin/bash

source tools/shell/utils/colors.sh ''
source tools/shell/utils/print-utils.sh ''

##
# Checks and sets up environment variables.
##
environmentSetup() {
  if [[ -z "$APP_DB_NAME" && -z "$DB_CONNECTION_STRING" ]] || [[ -z "$APP_DB_NAME" && -z "$DB_CONNECTION_STRING_REMOTE" ]]; then
    if [ ! -f '.env' ]; then
      printInfoMessage ".env file does not exist, and credential were not provided"
      printGap

      APP_DB_NAME="noop"
      DB_CONNECTION_STRING="noop"
      DB_CONNECTION_STRING_REMOTE="noop"
    else
      printSuccessMessage "<< .env file exists, loading variables >>"
      printGap

      set -a
      # shellcheck source=/dev/null
      . ./.env
      set +a
    fi
  fi

  if [ "$APP_DB_NAME" == "noop" ] || [ "$DB_CONNECTION_STRING" == "noop" ] || [ "$DB_CONNECTION_STRING_REMOTE" == "noop" ]; then
    printErrorTitle "Not all required environment variables are present. Check global scope or .env file depending on what is used in the scenario."
    printGap
    exit 1
  fi
}

##
# Supported commands.
# Associative array mapping: <command name> - <executable>
##
declare -A SUPPORTED_COMMANDS=(
  ["dump"]=mongodump
  ["export"]=mongoexport
  ["import"]=mongoimport
  ["restore"]=mongorestore
)

environmentSetup

##
# Supported environments.
# Associative array mapping: <environment name> - <environment variable>
##
declare -A SUPPORTED_ENVIRONMENTS=(
  ["local"]="$DB_CONNECTION_STRING"
  ["remote"]="$DB_CONNECTION_STRING_REMOTE"
)

##
# Prints script usage instructions.
##
reportUsage() {
  printInfoTitle "<< ${0} usage >>"
  printUsageTip "bash tools/shell/mongo.sh ?" "print help"
  printInfoMessage ">> dump"
  printUsageTip "bash tools/shell/mongo.sh dump local" "dump local database"
  printUsageTip "bash tools/shell/mongo.sh dump remote" "dump remote database"
  printInfoMessage ">> export"
  printUsageTip "bash tools/shell/mongo.sh export local" "export local database"
  printUsageTip "bash tools/shell/mongo.sh export remote" "export remote database"
  printInfoMessage ">> import"
  printUsageTip "bash tools/shell/mongo.sh import local ~/mongoexport" "import local database from previously exported data to the ~/mongoexport"
  printUsageTip "bash tools/shell/mongo.sh import remote ~/mongoexport" "import remote database from previously exported data to the ~/mongoexport"
  printInfoMessage ">> restore"
  printUsageTip "bash tools/shell/mongo.sh restore local ~/mongodump/inner_source_portal_db_prod" "restore local database from prod dump"
  printUsageTip "bash tools/shell/mongo.sh restore remote ~/mongodump/inner_source_portal_db_prod" "restore remote database from prod dump"
  printGap

  printInfoMessage "Supported commands"
  printGap

  for SUPPORTED_COMMAND_KEY in "${!SUPPORTED_COMMANDS[@]}"; do
    printValue "${SUPPORTED_COMMAND_KEY}"
  done
  printGap

  printInfoMessage "Supported environments"
  printGap

  for SUPPORTED_ENVIRONMENT_KEY in "${!SUPPORTED_ENVIRONMENTS[@]}"; do
    printValue "${SUPPORTED_ENVIRONMENT_KEY}"
  done
  printGap
}

##
# Execute action.
##
execute() {
  printInfoTitle "<< Executing >>"
  printNameAndValue "command" "$1"
  printNameAndValue "environment" "$2"
  printNameAndValue "dump location (only for restore)" "$3"
  printGap

  local COMMAND
  COMMAND="${SUPPORTED_COMMANDS[$1]}"

  if [ -z "$COMMAND" ]; then
    printErrorTitle "Comand is not supported"
    printGap
    reportUsage
    exit 1
  fi

  environmentSetup

  local CONNECTION_STRING
  CONNECTION_STRING="${SUPPORTED_ENVIRONMENTS[$2]}"

  if [ -z "$CONNECTION_STRING" ]; then
    printErrorTitle "Environment is not supported"
    printGap
    reportUsage
    exit 1
  fi

  local DUMP_LOCATION
  DUMP_LOCATION=$3
  #
  case "$1" in
  "dump")
    local DUMP_OUT
    DUMP_OUT="$HOME"/mongodump

    mkdir "$DUMP_OUT" || true

    printInfoMessage "<< Dumping database >>"
    printNameAndValue "dump out" "$DUMP_OUT"
    printGap

    $COMMAND --uri="$CONNECTION_STRING" --tlsInsecure --out="$DUMP_OUT" || exit 1
    ;;
  "export")
    local EXPORT_OUT
    EXPORT_OUT="$HOME"/mongoexport

    mkdir "$EXPORT_OUT" || true

    local ALL_COLLECTIONS
    ALL_COLLECTIONS=$(mongo "$CONNECTION_STRING" --quiet --eval "db.getSisterDB(\"$APP_DB_NAME\").getCollectionNames()" | sed 's/\[//g' | sed 's/\]//g' | sed 's/,//g' | sed 's/\"//g')

    printInfoTitle "<< Exporting collecitons >>"
    printNameAndValue "all collections" "$ALL_COLLECTIONS"
    printGap

    for COLLECTION in $ALL_COLLECTIONS; do
      printInfoMessage "Exporting $COLLECTION..."
      printGap

      $COMMAND --uri="$CONNECTION_STRING"/"$APP_DB_NAME" --tlsInsecure -c "$COLLECTION" -o "$EXPORT_OUT"/"$COLLECTION".json --jsonArray || exit 1
    done
    ;;
  "import")
    local EXPORT_IN
    EXPORT_IN="$HOME"/mongoexport

    if [ ! -d "$EXPORT_IN" ]; then
      printErrorTitle "<< $EXPORT_IN does not exist >>"
      printGap
      exit 1
    fi

    local ALL_COLLECTION_FILES
    ALL_COLLECTION_FILES=()
    while IFS= read -r -d $'\0'; do
      ALL_COLLECTION_FILES+=("${REPLY//"$EXPORT_IN/"/}")
    done < <(find "$EXPORT_IN" -maxdepth 1 -name "*.json" -print0)

    printInfoTitle "<< Importing collecitons >>"
    printNameAndValue "all collection files" "${ALL_COLLECTION_FILES[@]}"
    printGap

    local COLLECTION

    for COLLECTION_FILE in "${ALL_COLLECTION_FILES[@]}"; do

      COLLECTION=${COLLECTION_FILE//".json"/}

      printInfoMessage "Importing $COLLECTION_FILE"
      printNameAndValue "collection name" "$COLLECTION"
      printGap

      local FILE_CONTENTS
      FILE_CONTENTS="$(cat "$EXPORT_IN"/"$COLLECTION".json)"

      if [ "$FILE_CONTENTS" != "[]" ]; then
        $COMMAND --uri="$CONNECTION_STRING"/"$APP_DB_NAME" --tlsInsecure -c "$COLLECTION" --file "$EXPORT_IN"/"$COLLECTION".json --jsonArray || exit 1
      fi
    done
    ;;
  "restore")
    if [ ! -d "$DUMP_LOCATION" ]; then
      printErrorTitle "dump does not exist"
      printGap
      exit 1
    fi

    printInfoMessage "<< Restoring database >>"
    printNameAndValue "dump location" "$DUMP_LOCATION"
    printGap

    $COMMAND --uri="$CONNECTION_STRING" --tlsInsecure --dir="$DUMP_LOCATION" || exit 1
    ;;
  esac
}

##
# Script execution control flow.
##
if [ "$1" = "?" ]; then
  reportUsage
elif [ 1 -lt $# ]; then
  execute "$1" "$2" "$3"
else
  reportUsage
  exit 1
fi
