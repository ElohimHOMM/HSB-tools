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
  db.addColumn(
    'MINECRAFT_ACCOUNT',
    'PRIORITY',
    {
      type: 'smallint',
      notNull: true,
      defaultValue: 0
    },
    callback
  );
};

exports.down = function (db, callback) {
  db.removeColumn('MINECRAFT_ACCOUNT', 'PRIORITY', callback);
};

exports._meta = {
  version: 1
};
