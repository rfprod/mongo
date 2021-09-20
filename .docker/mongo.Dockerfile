FROM mongo:5.0.2-focal
# Set environment variables:
# - debian frontend noninteractive due to there's no UI;
# - mogo credentials.
ENV DEBIAN_FRONTEND=noninteractive \
  MONGO_INITDB_DATABASE="admin"
# Copy entrypoint script.
COPY tools/shell/mongo-docker-entrypoint.sh /docker-entrypoint.sh
# Copy initialization scripts.
COPY tools/js/init.js /docker-entrypoint-initdb.d/init.js
# Install dependencies and configure directories.
RUN apt-get update ; \
    apt-get upgrade -y --no-install-recommends ; \
    apt-get install -y --no-install-recommends apt-utils ; \
    apt-get install -y --no-install-recommends apt-transport-https ca-certificates curl gnupg2 numactl ; \
    apt-get clean ; \
    apt-get autoclean ; \
    apt-get autoremove ; \
    rm -rf /tmp/* ; \
    echo ">> creating directories and setting permissions..." ; \
    mkdir -p /home/mongodb ; \
    mkdir -p /var/lib/mongodb ; \
    chmod -R 777 /var/lib/mongodb ; \
    chmod -R 777 /docker-entrypoint-initdb.d ; \
    chmod 777 /docker-entrypoint.sh
# Copy mongo config.
COPY tools/config/mongod.conf /etc/mongod.conf
# Set up persistent volume.
VOLUME /var/lib/mongodb
# Expose mongo port, 27017 is the default.
EXPOSE 27017 27018 27019
# Define entrypoint.
ENTRYPOINT ["/docker-entrypoint.sh"]
