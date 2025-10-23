'use strict';

var dbm;
var type;
var seed;

exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db, callback) {
  db.createTable('PATCH_NOTE_TYPE', {
    ID: { type: 'int', primaryKey: true, autoIncrement: true },
    NAME: { type: 'string', length: 50, notNull: true, unique: true },
    CREATED_AT: { type: 'datetime', notNull: true },
    UPDATED_AT: { type: 'datetime' }
  }, callback);

  db.createTable('PATCH_NOTES', {
    ID: { type: 'int', primaryKey: true, autoIncrement: true },
    VERSION: { type: 'string', length: 100, notNull: true },
    TYPE_ID: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'fk_patch_note_type',
        table: 'PATCH_NOTE_TYPE',
        mapping: 'ID',
        rules: { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' }
      }
    },
    PATCH_NOTE: { type: 'string', length: 255 }, // optional
    CREATED_AT: { type: 'datetime', notNull: true },
    UPDATED_AT: { type: 'datetime' }
  }, callback);
}

exports.down = function (db, callback) {
  db.dropTable('PATCH_NOTE_TYPE', callback);
  db.dropTable('MINECRAFT_ACCOUNT', callback);
};

exports.seed = function (db, callback) {
  const types = ['Fix', 'Added', 'Removed', 'Updated'];
  const promises = types.map(type => db.insert('PATCH_NOTE_TYPE', { NAME: type }));

  Promise.all(promises)
    .then(() => callback())
    .catch(err => callback(err));
};

exports._meta = {
  version: 1
};
