'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, callback) {
  db.createTable('data', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    name: { type: 'string', length: 100, notNull: true },
    value: { type: 'text', length: 'long', notNull: true }, // LONGTEXT for large JSON
    created_at: { type: 'datetime', notNull: true },
    updated_at: { type: 'datetime' }
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('data', callback);
};

exports._meta = {
  "version": 1
};
