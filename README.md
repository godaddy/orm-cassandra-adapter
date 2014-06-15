orm-cassandra-adapter
=====================
Adapter that adds Cassandra support to `orm2`.

Enabling
--------
To enable this adapter, use the `addAdapter` method of `orm2`. Observe:
 
```javascript
var orm = require('orm2');
orm.addAdapter(require('orm-cassandra-adapter'));
```

Using
-----
Once you've enabled the adapter, you can create `orm2` models using the `cassandra://` scheme for
your database URI. A typical URI will have this syntax:

    cassandra://username:password@/keyspace?hosts=host:port,host:port,host:port
    
Note the lack of a host in this URL; the host is ignored since Cassandra clients
may need to connect to multiple hosts. The `hosts` query string parameter takes a comma-separated
list of `hostname:port` values, with `:port` being optional (the default is `:9042`).
    
The following optional query string parameters are also available:

* staleTime: Time in milliseconds before trying to reconnect to a node.
* maxExecuteRetries: Maximum amount of times an execute can be retried using another connection, in case the server is unhealthy.
* getAConnectionTimeout: Maximum time in milliseconds to wait for a connection from the pool.
* poolSize: Number of connections to open for each host (default 1)

How It Works
------------
This adapter uses the `node-cassandra-cql` module for its database operations.
