/**
 * This function initializes database with two user records and two collections.
 */
(async function () {
  // eslint-disable-next-line no-undef -- this script has global context because it is executed in mongo shell
  const mongoClient = new Mongo();

  const adminDb = mongoClient.getDB('admin');

  async function init() {
    await adminDb.createUser({
      user: 'user',
      pwd: 'password',
      roles: [{ role: 'readWrite', db: 'portal' }],
    });

    await adminDb.createUser({
      user: 'admin',
      pwd: 'password',
      roles: [{ role: 'userAdminAnyDatabase', db: 'admin' }],
    });

    const portalDb = mongoClient.getDB('portal');
    await portalDb.createCollection('collectionOne', { capped: false });
    await portalDb.createCollection('collectionTwo', { capped: false });
  }

  await init();
})();
