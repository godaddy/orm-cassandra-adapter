"use strict";

var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
var proxyquire = require('proxyquire');
var async = require('async');

chai.use(require('sinon-chai'));

describe('The CassandraAdapter', function() {
  this.timeout(500);

  var CassandraAdapter;
  var mockCassandra, mockCassandraClient;

  beforeEach(function() {
    mockCassandraClient = { shutdown: sinon.stub().yields(null) };
    mockCassandra = { Client: sinon.stub().returns(mockCassandraClient) };

    CassandraAdapter = proxyquire('../../lib/adapter', {
      'node-cassandra-cql': mockCassandra
    });
  });

  describe('constructor', function() {
    it('requires either a host or hosts option', function() {
      expect(function() { new CassandraAdapter({}); }).to.throw(Error);
    });
    it('requires a non-empty path', function() {
      expect(function() { new CassandraAdapter({}); }).to.throw(Error);
    });
  });

  describe('connect method', function() {
    it('uses the hosts specified in the connection options', function(done) {
      var adapter = new CassandraAdapter({ hosts: "host1:2304,host2,host3", path: 'keyspace' });

      adapter.connect(function() {
        expect(mockCassandra.Client).to.have.been.calledWithMatch({
          hosts: sinon.match(['host1:2304','host2','host3'])
        });
        done();
      });
    });

    it('uses the path specified in the connection URL as the keyspace', function(done) {
      var adapter = new CassandraAdapter({ path: "/keyspace", hosts: "host1:2304,host2,host3" });

      adapter.connect(function() {
        expect(mockCassandra.Client).to.have.been.calledWithMatch({ keyspace: 'keyspace' });
        done();
      });
    });
  });

  describe('ping method', function() {
    it('always succeeds', function(done) {
      var adapter = new CassandraAdapter({ path: "/keyspace", hosts: "host1:2304,host2,host3" });
      adapter.ping(function(err) {
        expect(err).to.be.null;
        done();
      });
    });
  });

  describe('close method', function() {

    var adapter;

    beforeEach(function() {
      adapter = new CassandraAdapter({ path: "/keyspace", hosts: "host1:2304,host2,host3" });
    });

    it('does nothing if a connection has not been opened', function(done) {
      adapter.close(function(err) {
        expect(err).to.be.null;
        done();
      });
    });

    it('calls shutdown for the underlying client if connected', function(done) {
      async.series([
        adapter.connect.bind(adapter),
        adapter.close.bind(adapter)
      ], function() {
        expect(mockCassandraClient.shutdown).to.have.been.called;
        done();
      });
    });
  })
});
