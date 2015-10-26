'use strict';

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

        $scope.$watch('justified', function(newValue) {
          $scope.setActiveBar(false);
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

          if (event) {
            $scope.setActiveBar(event);
          }
        };

        $scope.setActiveBar = function(event) {
          var activeBar = angular.element($element[0].querySelector('.active-bar'));
          if (event) {
            var target = event.target;

            if (event.target.nodeName !== 'A') {
              while (target) {
                if (target.nodeName === 'A') break;
                target = target.parentNode;
              }
            }

            var ele       = target.getBoundingClientRect(),
              parent      = target.parentElement.parentElement,
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