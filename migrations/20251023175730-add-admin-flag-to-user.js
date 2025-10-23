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
    'USER',
    'IS_ADMIN',
    {
      type: 'boolean',
      notNull: true,
      defaultValue: 0
    },
    callback
  );
}

exports.down = function (db, callback) {
  db.removeColumn('USER', 'IS_ADMIN', callback);
};

exports._meta = {
  version: 1
};
