var services = angular.module('undp-ghg-v2.services', ['ngResource']);



/*
  Manipulate Category
*/
services.factory('CategoryFactory', function($resource) {
  return $resource('/api/category/:id', {}, {
    query: {
      method: 'GET',
      isArray: true
    },
    create: {
      method: 'POST',
      isArray: false
    },
    get: {
      method: 'GET',
      params: {
        id: '@id'
      }
    }
  });
});

/*
  Manipulate Sector
*/
services.factory('SectorFactory', function($resource) {
  return $resource('/api/sector/:id', {}, {
    query: {
      method: 'GET',
      isArray: true
    },
    create: {
      method: 'POST',
      isArray: false
    },
    get: {
      method: 'GET',
      params: {
        id: '@id'
      }
    }
  });
});

/**
  * Request currently authenticated user details.
  */
services.factory('UserFactory', function($resource) {
  return $resource('/user', {}, {
    query: {
      method: 'GET',
      isArray: false
    }
  });
});
