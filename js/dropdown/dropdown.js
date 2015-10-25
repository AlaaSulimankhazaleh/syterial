'use strict';

angular.module('dropdown', [])
	.directive('dropdown', ['$window', function($window) {
    return {
      restrict: 'A',
      link: function(scope, ele) {
        var eleRect = ele[0].getBoundingClientRect();

        ele.parent().css({
          position: 'relative',
          'z-index': 100
        });

        if ($window.innerWidth < eleRect.left + 160) {
          angular.element(ele[0].getElementsByClassName('dropdown-menu')).addClass('toLeft');
        }

        function hide(event) {
          var target = event.target,
            check;

          while (target) {
            check = target.getAttribute('dropdown');
            if (check !== null) return;
            target = target.parentElement;
          }

          var dropdowns = document.querySelectorAll('[dropdown]');
          for (var i = 0, len = dropdowns.length; i < len; i++) {
            dropdowns[i].classList.remove('open');
          }
        }

        ele[0].addEventListener('click', function() {
          ele.toggleClass('open');
        });

        document.addEventListener('click', function(e) {
          hide(e);
        });
      }
    };
  }]);