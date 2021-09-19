FROM mongo:5.0.2-focal
# Set environment variables:
# - debian frontend noninteractive due to there's no UI;
# - mogo credentials.
ENV DEBIAN_FRONTEND=noninteractive \
  MONGO_INITDB_ROOT_PASSWORD="password" \
  MONGO_INITDB_ROOT_USERNAME="root"
# Copy entrypoint script.
COPY tools/shell/mongo-docker-entrypoint.sh /
# Copy initialization scripts.
COPY dist/docker-entrypoint-initdb.d/src/mongo-init/init-accounts.js /docker-entrypoint-initdb.d
# Install dependencies and configure directories.
RUN apt-get update ; \
    apt-get upgrade -y --no-install-recommends ; \
    apt-get install -y --no-install-recommends apt-utils ; \
    apt-get install -y --no-install-recommends apt-transport-https ca-certificates curl gnupg2 ; \
    apt-get clean ; \
    apt-get autoclean ; \
    apt-get autoremove ; \
    rm -rf /tmp/* ; \
    mkdir -p /var/lib/mongodb ; \
    chmod 777 /mongo-docker-entrypoint.sh
# Copy mongo config.
COPY tools/config/mongod.conf /etc/mongod.conf
# Set up persistent volume.
VOLUME /var/lib/mongodb
# Expose mongo port, 27017 is the default.
EXPOSE 27017 27018 27019
# Define entrypoint.
ENTRYPOINT ["/mongo-docker-entrypoint.sh"]
