"use strict";

module.exports = CassandraAdapter;

var driver = require('node-cassandra-cql');

function CassandraAdapter(config) {
  this.client = null;
  this.config = parseConfig(config);
  this.customTypes = {};
}

CassandraAdapter.prototype.connect = function(cb) {
  this.client = new driver.Client(this.config);
  cb();
};

CassandraAdapter.prototype.ping = function(cb) {
  // TODO: Implement actual check. For now, ping always succeeds.
  cb(null);
};

CassandraAdapter.prototype.close = function(cb) {
  if (this.client) {
    this.client.shutdown(cb);
  } else {
    cb(null);
  }
};

function parseConfig(ormConfig) {
  var hosts = ormConfig.hosts || ormConfig.host;
  return {
    hosts: hosts.split(','),
    keyspace: ormConfig.path.replace(/^\/|\/$/g, '')
  };
}
