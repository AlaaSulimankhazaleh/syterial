'use strict';

angular.module('modal', [])
  .factory('$modal', ['$document', function ($document) {
    var obj = {},
    body    = $document.find('body');

    obj.open = function(options) {
      
      console.log(options);
    };

    return obj;
  }]);