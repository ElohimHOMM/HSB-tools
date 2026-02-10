'use strict';

var dbm;
var type;
var seed;

exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, callback) {
  db.createTable('USER', {
    ID: { type: 'int', primaryKey: true, autoIncrement: true },
    NAME: { type: 'string', length: 100, notNull: true, unique: true },
    PASSWORD: { type: 'string', length: 255, notNull: true }, // hash length > 100
    EMAIL: { type: 'string', length: 100, unique: true }, // optional
    CREATED_AT: { type: 'datetime', notNull: true },
    UPDATED_AT: { type: 'datetime' }
  }, callback);

  db.createTable('MINECRAFT_ACCOUNT', {
    ID: { type: 'int', primaryKey: true, autoIncrement: true },
    USER_ID: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'fk_minecraft_user',
        table: 'USER',
        rules: { onDelete: 'CASCADE', onUpdate: 'RESTRICT' },
        mapping: 'ID'
      }
    },
    MC_USERNAME: { type: 'string', length: 50, notNull: true },
    MC_UUID: { type: 'string', length: 36 }, // for linking via Mojang API
    AVATAR_URL: { type: 'string', length: 255, notNull: true },
    CREATED_AT: { type: 'datetime', notNull: true },
    UPDATED_AT: { type: 'datetime' }
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('USER', callback);
  db.dropTable('MINECRAFT_ACCOUNT', callback);
};

exports._meta = {
  "version": 1
};
