angular.module('cr.services', ['ngResource'])

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key, value) {
      value = value || '{}';
      return JSON.parse($window.localStorage[key] || value);
    },
    remove: function(key) {
      $window.localStorage.removeItem(key);
    }
  }
}])

.factory('ResourceFactory', ['$q', '$resource',
    function($q, $resource) {

        function abortablePromiseWrap(promise, deferred, outstanding) {
            promise.then(function() {
                deferred.resolve.apply(deferred, arguments);
            });

            promise.catch(function() {
                deferred.reject.apply(deferred, arguments);
            });

            /**
             * Remove from the outstanding array
             * on abort when deferred is rejected
             * and/or promise is resolved/rejected.
             */
            deferred.promise.finally(function() {
                array.remove(outstanding, deferred);
            });
            outstanding.push(deferred);
        }

        function createResource(url, options, actions) {
            var resource;
            var outstanding = [];
            actions = actions || {};

            Object.keys(actions).forEach(function(action) {
                var canceller = $q.defer();
                actions[action].timeout = canceller.promise;
                actions[action].Canceller = canceller;
            });

            resource = $resource(url, options, actions);

            Object.keys(actions).forEach(function(action) {
                var method = resource[action];

                resource[action] = function() {
                    var deferred = $q.defer(),


                    promise = method.apply(null, arguments).$promise;

                    abortablePromiseWrap(promise, deferred, outstanding);


                    var data = {
                        $promise: deferred.promise,

                        url:url,
                        deferred:deferred,
                        promise:promise,
                        actions:actions,
                        action:action,
                        options:options,
                        resource:resource,
                        outstanding:outstanding,
                        method:method,
                        arguments:arguments,
                        

                        abort: function() {
                            deferred.reject('Aborted');
                        },
                        cancel: function() {
                            actions[action].Canceller.resolve('Call cancelled');

                            // Recreate canceler so that request can be executed again
                            var canceller = $q.defer();
                            actions[action].timeout = canceller.promise;
                            actions[action].Canceller = canceller;
                        }
                    };


                    // console.log('AQUI', data);

                    return data;
                };
            });

            /**
             * Abort all the outstanding requests on
             * this $resource. Calls promise.reject() on outstanding [].
             */
            resource.abortAll = function() {
                for (var i = 0; i < outstanding.length; i++) {
                    outstanding[i].reject('Aborted all');
                }
                outstanding = [];
            };

            return resource;
        }

        return {
            createResource: function (url, options, actions) {
                return createResource(url, options, actions);
            }
        };
    }
])


.factory('GenericService', ['ResourceFactory', '$resource', '$cacheFactory', function(ResourceFactory, $resource, $cacheFactory) {

    var data = ResourceFactory.createResource(config.api + '/:route/:action/:token/:id/:filter/:page/:pageLimit/:date/:scope/:op/:reply', 
    {
    },{ 
        all: {
            method:'GET',
            params:{action: 'all'},
            isArray:true
        },
        get: {
            method:'GET',
            params:{action: 'get'}
        },
        send: {
            method:'POST',
            params:{action: 'get'}
        },
        save: {
            method:'POST',
            params:{action: 'save'}
        },
        delete: {
            method:'DELETE',
            params:{action: 'delete'}
        }
    });

    return data;
}])

;
