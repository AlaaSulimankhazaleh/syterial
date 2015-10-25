'use strict';

angular.module('navDrawerToggle', [])
	.directive('navDrawerToggle', [function() {
    return {
      restrict: 'E',
      replace: true,
      link: function(scope, ele) {
        ele[0].addEventListener('click', function() {
          ele.toggleClass('active');
        });
      },
      template: '<button class="hamburger-menu"></div>'
    };
  }]);