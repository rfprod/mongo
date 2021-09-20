#!/bin/sh

# set directory ownership
chown -R mongodb:mongodb /home/mongodb
chown -R mongodb:mongodb /var/lib/mongodb
chown -R mongodb:mongodb /etc/mongod.conf
chmod 777 /etc/mongod.conf
chown -R mongodb:mongodb /docker-entrypoint-initdb.d

echo ">> starting mongod as a background process"
mongod --fork --logpath /var/log/mongod.log --dbpath /var/lib/mongodb

for f in /docker-entrypoint-initdb.d/*; do
  case "$f" in
  *.sh)
    echo "$0: running $f"
    sh "$f"
    ;;
  *.js)
    echo "$0: running $f"
    mongo --host 127.0.0.1 --port 27017 --quiet "$MONGO_INITDB_DATABASE" "$f"
    ;;
  *) echo "$0: ignoring $f" ;;
  esac
  echo
done

echo ">> stopping mongod process"
mongo admin --eval "db.shutdownServer();quit();"

# set directory ownership again after initializing database using user different than mongodb
chown -R mongodb:mongodb /var/lib/mongodb
chmod -R 777 /var/lib/mongodb

# run mongod under the mongodb user
runuser -u mongodb -- mongod -f /etc/mongod.conf
