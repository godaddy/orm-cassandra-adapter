"use strict";

module.exports = CassandraAdapter;

var driver = require('node-cassandra-cql');

function CassandraAdapter(config) {
  this.config = parseConfig(config);
  this.client = null;
}

CassandraAdapter.prototype.connect = function(cb) {
  this.client = new driver.Client(this.config);
  cb();
};

function parseConfig(ormConfig) {
  var hosts = ormConfig.hosts || ormConfig.host;
  return {
    hosts: hosts.split(','),
    keyspace: ormConfig.path.replace(/^\/|\/$/g, '')
  };
}
