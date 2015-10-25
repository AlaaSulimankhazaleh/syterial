angular.module('syterial', ['collapse', 'convertToNumber', 'dropdown', 'mdInput', 'modal', 'navDrawerToggle', 'ripple', 'tabs']);'use strict';

angular.module('collapse', [])
	.directive('collapse', ['$timeout', function($timeout) {
    return {
      restrict: 'A',
      transclude: true,
      replace: true,
      template: '<div class="collapse"><div ng-transclude></div></div>',
      link: function(scope, element, attrs) {
        scope.$watch(attrs.collapse, function(isExpanded) {
          $timeout(function() {
            element.css('height', isExpanded ? element.children()[0].offsetHeight + 'px' : '0');
          }, 10);
        });
      }
    };
  }]);'use strict';

angular.module('convertToNumber', [])
	.directive('convertToNumber', function() {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        ngModel.$parsers.push(function(val) {
          return parseInt(val, 10);
        });
        ngModel.$formatters.push(function(val) {
          return '' + val;
        });
      }
    };
  });'use strict';

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
  }]);'use strict';

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
  }]);'use strict';

angular.module('modal', [])
  .factory('$modal', ['$document', function ($document) {
    var obj = {},
    body    = $document.find('body');

    obj.open = function(options) {
      
      console.log(options);
    };

    return obj;
  }]);'use strict';

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
  }]);'use strict';

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
  }]);'use strict';

angular.module('tabs', [])
	.directive('tabs', [function() {
    return {
      require: 'ripple',
      restrict: 'E',
      transclude: true,
      scope: {
        animated: '=',
        justified: '=',
        scrollable: '=',
        scrollableHeight: '@'
      },
      controller: ['$scope', '$element', '$timeout', function($scope, $element, $timeout) {
        var panes = this.panes = $scope.panes = [];

        this.animated = $scope.animated;
        this.scrollable = $scope.scrollable;
        $scope.scrollableHeight = this.scrollableHeight = $scope.scrollableHeight || 400;
        $scope.screenWidth = window.innerWidth;

        $scope.$watchGroup(['animated', 'scrollable', 'scrollableHeight'], function(newValue) {
          $scope.$broadcast('attrChange', newValue);
        });

        $scope.$watch('panes', function(newValue) {
          $scope.$broadcast('panesChange', newValue);
        });

        window.onresize = function() {
          $scope.screenWidth = window.innerWidth;
          $scope.$apply();
        };

        $scope.select = this.select = function(pane, event) {
          angular.forEach(panes, function(pane) {
            pane.selected = false;
          });
          pane.selected = true;

          var activeBar = angular.element($element[0].querySelector('.active-bar'));
          if (event) {
            var ele       = event.target.getBoundingClientRect(),
              parent      = event.target.parentElement.parentElement,
              parentRect  = parent.getBoundingClientRect(),
              left        = ele.left - parentRect.left + parent.offsetLeft + 'px',
              width       = ele.width + 'px';

            activeBar.css({
              width: width,
              left: left
            });
          } else {
            $timeout(function() {
              var te        = $element[0].querySelector('.pane-links'),
                teRect      = te.getBoundingClientRect(),
                parent      = te.parentElement.parentElement,
                parentRect  = parent.getBoundingClientRect(),
                left        = teRect.left - parentRect.left + parent.offsetLeft + 'px',
                width       = teRect.width + 'px';

              activeBar.css({
                width: width,
                left: left
              });
            }, 10);
          }
        };

        this.addPane = function(pane) {
          if (panes.length === 0) {
            $scope.select(pane);
          }
          panes.push(pane);
        };
      }],
      template: '<div class="tabbable"><ul class="nav nav-tabs" ng-class="{justified: justified && screenWidth >= 768}"><li ng-repeat="pane in panes" ng-class="{active: pane.selected}" ripple="#ffeb3b"><a href="" ng-click="select(pane, $event)" class="pane-links">{{pane.title}} <i ng-if="pane.icon" ng-class="pane.icon"></i></a></li><div class="active-bar"></div></ul><div class="tab-content" ng-transclude></div></div>'
    };
  }])
  .directive('pane', ['$timeout', function ($timeout) {
    return {
      require: '^tabs',
      restrict: 'E',
      replace: true,
      transclude: true,
      scope: {
        title: '@',
        icon: '@'
      },
      link: function(scope, ele, attrs, tabsCtrl) {
        if (angular.isUndefined(scope.title)) scope.title = 'Pane';
        if (angular.isUndefined(scope.icon)) scope.icon = false;

        tabsCtrl.addPane(scope);

        function setAnim(bool) {
          scope.anim = bool;
          var tabPanes = angular.element(document.querySelectorAll('.tab-pane')),
            heights = [],
            maxHeight;

          $timeout(function() {
            if (bool) {
              for (var i = 0; i < tabPanes.length; i++) {
                heights.push(tabPanes[i].clientHeight);
              }
              maxHeight = Math.max.apply(Math, heights);
              tabPanes.parent().css('height', maxHeight + 'px');
            } else {
              tabPanes.parent().css('height', '');
            }
          }, 10);
        }

        function setScrollable(bool, height) {
          var tabPanes = angular.element(document.querySelectorAll('.tab-pane'));
          if (bool) {
            tabPanes.css({
              maxHeight: height + 'px',
              overflowY: 'auto'
            });
          } else {
            tabPanes.css({
              maxHeight: '',
              overflowY: ''
            });
          }
        }

        scope.$on('attrChange', function(e, values) {
          setAnim(values[0]);
          setScrollable(values[1], values[2]);
        });

        setAnim(tabsCtrl.animated);
        setScrollable(tabsCtrl.scrollable);
      },
      template: '<div class="tab-pane" ng-class="{fade: anim, in: selected}" ng-transclude></div>'
    };
  }])