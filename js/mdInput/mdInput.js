'use strict';

angular.module('mdInput', [])
	.directive('mdInput', ['$timeout', function($timeout) {
    return {
      restrict: 'C',
      link: function(scope, ele) {
        if (ele.val() !== '') {
          ele.addClass('filled');
        }

        ele[0].onkeyup = function() {
          if (this.value !== '') {
            ele.addClass('filled');
          } else {
            ele.removeClass('filled');
          }
        };

        ele[0].onfocus = function() {
          var parent = ele.parent();
          parent.append('<span class="focusbar"></span>');
          $timeout(function() {
            parent.find('span').addClass('show');
          }, 100);
        };

        ele[0].onblur = function() {
          var parent = ele.parent();
          parent.find('span').removeClass('show');
          $timeout(function() {
            parent.find('span').remove();
          }, 500);
        };
      }
    };
  }]);