'use strict';

angular.module('ripple', [])
	.directive('ripple', [function() {
    return {
      restrict: 'AC',
      scope: {
        ripple: '@'
      },
      link: function(scope, ele) {
        var rect, ripple, top, left, color;

        ele.css({
          overflow: 'hidden',
          position: 'relative'
        });

        if (scope.ripple != 'false') {
          ele[0].addEventListener('click', function(event) {
            rect = event.target.getBoundingClientRect();
            ripple = ele.find('span');
            if (ripple.length === 0 || !ripple.hasClass('ripple')) {
              var wh = Math.max(rect.width, rect.height);
              ripple = angular.element(document.createElement('span'));
              ripple.addClass('ripple');
              ripple.css({
                width: wh + 'px',
                height: wh + 'px'
              });
              ele.append(ripple);
            }
            ripple.removeClass('show');
            top = event.layerY - ripple[0].clientHeight / 2;
            left = event.layerX - ripple[0].clientWidth / 2;
            if (scope.ripple != 'false' && scope.ripple === '') {
              color = getComputedStyle(ele[0]).color;
            } else {
              color = scope.ripple;
            }
            ripple.css({
              top: top + 'px',
              left: left + 'px',
              background: color
            });
            ripple.addClass('show');
          });
        }
      }
    };
  }]);