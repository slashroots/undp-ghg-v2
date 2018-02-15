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

services.factory('IPCCCategoryFactory', function($resource) {
  return $resource('/api/ipcc/category/:id', {}, {
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

/**
 * Gas Routes
 */
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

services.factory('IPCCActivityFactory', function($resource) {
  return $resource('/api/ipcc/activity/:id', {}, {
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

services.factory('UnitFactory', function($resource) {
  return $resource('/api/unit/:id', {}, {
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

services.factory('RegionFactory', function($resource) {
  return $resource('/api/region/:id', {}, {
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

services.factory('NotationKeyFactory', function($resource) {
  return $resource('/api/ipcc/notationkey/:id', {}, {
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

services.factory('DataFactory', function($resource) {
  return $resource('/data/:id', {}, {
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

services.factory('SupportingFilesFactory', function($resource) {
  return $resource('/api/supportingfiles/:id', {}, {
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


/**
 * Administrative logs
 */
services.factory('LogsFactory', function($resource) {
  return $resource('/logs/:id', {}, {
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
 * Count of administrative logs
 */
services.factory('LogFactory', function($resource) {
  return $resource('/logcount', {}, {
    count: {
      method: 'GET'
    }
  });
});

services.factory('CalculationFactory', function($resource) {
  return $resource('/api/calculation/:id', {}, {
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