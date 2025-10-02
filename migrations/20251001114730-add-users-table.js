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
    NAME: { type: 'string', length: 100, notNull: true },
    PASSWORD: { type: 'string', length: 100, notNull: true },
    EMAIL: { type: 'string', length: 100, notNull: false, unique: true }, // for now we don't require an email
    CREATED_AT: { type: 'datetime', notNull: true },
    UPDATED_AT: { type: 'datetime' }
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('USER', callback);
};

exports._meta = {
  "version": 1
};
