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
  db.createTable('USER_SAVES', {
    ID: { type: 'int', primaryKey: true, autoIncrement: true },
    USER_ID: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'fk_user_id',
        table: 'USER',
        mapping: 'ID',
        rules: { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' }
      }
    },
    PAGE_KEY: { type: 'string', length: 50, notNull: true },
    DATA: { type: 'text', length: 'long', notNull: true },
    CREATED_AT: { type: 'datetime', notNull: true },
    UPDATED_AT: { type: 'datetime' }
  },
    callback
  );
}

exports.down = function (db, callback) {
  db.dropTable('USER_SAVES', callback);
};

exports._meta = {
  version: 1
};
