﻿/* Copyright (c) Microsoft Open Technologies, Inc.  All rights reserved.  Licensed under the Apache License, Version 2.0.  See License.txt in the project root for license information. */ var AngularCloudDataConnector;
(function (AngularCloudDataConnector) {
    /// <reference path="../../lib/angularjs/angular.d.ts" />
    /// <reference path="../../lib/jquery/jquery.d.ts" />
    (function (Internals) {
        // The goal of this class is to provide a IDB API using only in-memory storage
        var InMemoryRequest = (function () {
            function InMemoryRequest(result) {
                var _this = this;
                this.result = result;
                this.onerror = null;
                this.onblocked = null;
                this.onsuccess = null;
                this.onupgradeneeded = null;
                setTimeout(function () {
                    if (_this.onupgradeneeded) {
                        _this.onupgradeneeded({ target: { result: _this.result } });
                    }

                    if (_this.onsuccess) {
                        _this.onsuccess();
                    }
                }, 0);
            }
            return InMemoryRequest;
        })();
        Internals.InMemoryRequest = InMemoryRequest;

        var InMemoryTransaction = (function () {
            function InMemoryTransaction(db) {
                var _this = this;
                this._db = db;
                setTimeout(function () {
                    if (_this.oncomplete) {
                        _this.oncomplete();
                    }
                }, 0);
            }
            InMemoryTransaction.prototype.objectStore = function (name) {
                return new InMemoryTransactionalObjectStore(this._db._objectStores[name], this);
            };
            return InMemoryTransaction;
        })();
        Internals.InMemoryTransaction = InMemoryTransaction;

        var InMemoryObjectStore = (function () {
            function InMemoryObjectStore(keypath) {
                this.keypath = keypath;
                this.data = [];
            }
            return InMemoryObjectStore;
        })();
        Internals.InMemoryObjectStore = InMemoryObjectStore;

        var InMemoryTransactionalObjectStore = (function () {
            function InMemoryTransactionalObjectStore(objectStore, transaction) {
                this.objectStore = objectStore;
                this.transaction = transaction;
            }
            InMemoryTransactionalObjectStore.prototype.delete = function (idToDelete) {
                if (this.objectStore.data[idToDelete]) {
                    delete this.objectStore.data[idToDelete];
                }
            };

            InMemoryTransactionalObjectStore.prototype.put = function (value) {
                var key = value[this.objectStore.keypath];
                this.objectStore.data[key] = value; // Add or update
            };

            InMemoryTransactionalObjectStore.prototype.openCursor = function () {
                return new InMemoryCursor(this.objectStore);
            };

            InMemoryTransactionalObjectStore.prototype.clear = function () {
                this.objectStore.data = [];
            };
            return InMemoryTransactionalObjectStore;
        })();
        Internals.InMemoryTransactionalObjectStore = InMemoryTransactionalObjectStore;

        var InMemoryCursor = (function () {
            function InMemoryCursor(objectStore) {
                this.objectStore = objectStore;
                this._position = -1;
                this._keys = [];

                for (var key in objectStore.data) {
                    this._keys.push(key);
                }

                this.continue();
            }
            Object.defineProperty(InMemoryCursor.prototype, "value", {
                get: function () {
                    return this.objectStore.data[this._keys[this._position]];
                },
                enumerable: true,
                configurable: true
            });

            InMemoryCursor.prototype.continue = function () {
                var _this = this;
                this._position++;

                var nextCursor = this._position < this._keys.length ? this : null;

                setTimeout(function () {
                    if (_this.onsuccess) {
                        _this.onsuccess({ target: { result: nextCursor } });
                    }
                }, 0);
            };
            return InMemoryCursor;
        })();
        Internals.InMemoryCursor = InMemoryCursor;

        var InMemoryDatabase = (function () {
            function InMemoryDatabase() {
                this._objectStores = {};
            }
            InMemoryDatabase.prototype.open = function (name, version) {
                return new InMemoryRequest(this);
            };

            InMemoryDatabase.prototype.createObjectStore = function (name, def) {
                this._objectStores[name] = new InMemoryObjectStore(def.keyPath);
            };

            InMemoryDatabase.prototype.transaction = function (name) {
                return new InMemoryTransaction(this);
            };
            return InMemoryDatabase;
        })();
        Internals.InMemoryDatabase = InMemoryDatabase;
    })(AngularCloudDataConnector.Internals || (AngularCloudDataConnector.Internals = {}));
    var Internals = AngularCloudDataConnector.Internals;
})(AngularCloudDataConnector || (AngularCloudDataConnector = {}));
//# sourceMappingURL=inMemoryDatabase.js.map
