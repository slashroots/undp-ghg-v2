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
    },
    edit: {
      method: 'PUT',
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
    },
    edit: {
      method: 'PUT',
      params: {
        id: '@id'
      }
    }
  });
});

/*
  Manipulate Inventory
*/
services.factory('InventoryFactory', function($resource) {
  return $resource('/api/inventory/:id', {}, {
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
    get: {
      method: 'GET',
      isArray: false
    }
  });
});

services.factory('GasFactory', function($resource) {
  return $resource('/api/gas/:id', {}, {
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
    },
    edit: {
      method: 'PUT',
      params: {
        id: '@id'
      }
    }
  });
});


services.factory('AdminUserFactory', function($resource) {
  return $resource('/users/:id', {}, {
    query: {
      method: 'GET',
      isArray: true
    },
    get: {
      method: 'GET',
      params: {
        id: '@id'
      }
    },
    edit: {
      method: 'PUT',
      params: {
        id: '@id'
      }
    }
  });
});

services.factory('ActivityFactory', function($resource) {
  return $resource('/api/activity/:id', {}, {
    query: {
      method: 'GET',
      isArray: true
    },
    get: {
      method: 'GET',
      params: {
        id: '@id'
      }
    },
    edit: {
      method: 'PUT',
      params: {
        id: '@id'
      }
    }
  });
});
