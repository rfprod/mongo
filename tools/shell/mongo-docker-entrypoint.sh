#!/bin/sh

# set directory ownership
chown -R mongodb:mongodb /var/lib/mongodb
chown -R mongodb:mongodb /etc/mongod.conf

# run mongod under the mongodb user
runuser -u mongodb -- mongod -f /etc/mongod.conf

# create users
# echo ">> create users"
# mongo admin --host localhost -u root -p password --eval "db.createUser({user: 'user', pwd: 'password', roles: [{role: 'readWrite', db: 'portal'}]}); db.createUser({user: 'admin', pwd: 'password', roles: [{role: 'userAdminAnyDatabase', db: 'admin'}]});"
# echo ">> users created"
