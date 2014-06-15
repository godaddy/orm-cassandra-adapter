"use strict";

var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
var proxyquire = require('proxyquire');

chai.use(require('sinon-chai'));

describe('The CassandraAdapter', function() {
  this.timeout(500);

  var CassandraAdapter;
  var mockCassandra, mockCassandraClient;

  beforeEach(function() {
    mockCassandraClient = {};
    mockCassandra = { Client: sinon.stub().returns(mockCassandraClient) };

    CassandraAdapter = proxyquire('../../lib/adapter', {
      'node-cassandra-cql': mockCassandra
    });
  });

  describe('constructor', function() {
    it('requires either a host or hosts option', function() {
      expect(function() { var adapter = new CassandraAdapter({}); }).to.throw(Error);
    });
    it('requires a non-empty path', function() {
      expect(function() { var adapter = new CassandraAdapter({}); }).to.throw(Error);
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
});
