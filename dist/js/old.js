'use strict';

angular.module('syTerial', [])
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
  }])
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
  }])
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
  })
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

        $scope.$watchGroup(['animated', 'scrollable', 'scrollableHeight'], function(newValue) {
          $scope.$broadcast('attrChange', newValue);
        });

        $scope.$watch('panes', function(newValue) {
          $scope.$broadcast('panesChange', newValue);
        });

        this.animated = $scope.animated;
        this.scrollable = $scope.scrollable;
        this.scrollableHeight = $scope.scrollableHeight || 400;
        $scope.screenWidth = window.innerWidth;

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
            var ele = event.target.getBoundingClientRect(),
              parent = event.target.parentElement.parentElement,
              parentRect = parent.getBoundingClientRect(),
              left = ele.left - parentRect.left + parent.offsetLeft + 'px',
              width = ele.width + 'px';

            activeBar.css({
              width: width,
              left: left
            });
          } else {
            $timeout(function() {
              var te = $element[0].querySelector('.pane-links'),
                teRect = te.getBoundingClientRect(),
                parent = te.parentElement.parentElement,
                parentRect = parent.getBoundingClientRect(),
                left = teRect.left - parentRect.left + parent.offsetLeft + 'px';
              width = teRect.width + 'px';

              activeBar.css({
                width: width,
                left: left
              });
            }, 100);
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
      template: '<div class="tab-pane" ng-class="{fade: anim, in: selected, hidden: !anim && !selected}" ng-transclude></div>'
    };
  }])
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
  }])
  .directive('collapse', [function() {
    return {
      restrict: 'A',
      scope: {
        collapse: '='
      },
      link: function(scope, ele) {
        ele.css({
          'max-height': 0,
          opacity: 0,
          overflow: 'hidden',
          transition: 'max-height 0.4s ease 0s'
        });

        if (ele[0].nodeName == 'TR') ele.css('display', 'none');

        function toggle(bool) {
          if (bool) {
            ele.css({
              'max-height': '1000px',
              opacity: 1
            });
            if (ele[0].nodeName == 'TR') ele.css('display', 'table-row');
          } else {
            ele.css({
              'max-height': 0,
              opacity: 0
            });
            if (ele[0].nodeName == 'TR') ele.css('display', 'none');
          }
        }

        scope.$watch('collapse', function(newValue) {
          toggle(newValue);
        });
      }
    };
  }])
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
  }])
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
  }])

  .factory('ModalService', ['$document', '$compile', '$controller', '$http', '$rootScope', '$q', '$templateCache',
    function($document, $compile, $controller, $http, $rootScope, $q, $templateCache) {

      //  Get the body of the document, we'll add the modal to this.
      var body = $document.find('body');

      function ModalService() {

        var self = this;

        //  Returns a promise which gets the template, either
        //  from the template parameter or via a request to the
        //  template url parameter.
        var getTemplate = function(template, templateUrl) {
          var deferred = $q.defer();
          if (template) {
            deferred.resolve(template);
          } else if (templateUrl) {
            //  Get the template, using the $templateCache.
            $http.get(templateUrl, {
                cache: $templateCache
              })
              .then(function(result) {
                deferred.resolve(result.data);
              }, function(error) {
                deferred.reject(error);
              });
          } else {
            deferred.reject('No template or templateUrl has been specified.');
          }
          return deferred.promise;
        };

        self.showModal = function(options) {

          //  Create a deferred we'll resolve when the modal is ready.
          var deferred = $q.defer();

          //  Validate the input parameters.
          var controllerName = options.controller;
          if (!controllerName) {
            deferred.reject('No controller has been specified.');
            return deferred.promise;
          }

          //  Get the actual html of the template.
          getTemplate(options.template, options.templateUrl)
            .then(function(template) {

              //  Create a new scope for the modal.
              var modalScope = $rootScope.$new();

              //  Create the inputs object to the controller - this will include
              //  the scope, as well as all inputs provided.
              //  We will also create a deferred that is resolved with a provided
              //  close function. The controller can then call 'close(result)'.
              //  The controller can also provide a delay for closing - this is
              //  helpful if there are closing animations which must finish first.
              var closeDeferred = $q.defer();
              var inputs = {
                $scope: modalScope,
                close: function(result, delay) {
                  if (delay === undefined || delay === null) delay = 0;
                  window.setTimeout(function() {
                    //  Resolve the 'close' promise.
                    closeDeferred.resolve(result);

                    //  We can now clean up the scope and remove the element from the DOM.
                    modalScope.$destroy();
                    modalElement.remove();

                    //  Unless we null out all of these objects we seem to suffer
                    //  from memory leaks, if anyone can explain why then I'd
                    //  be very interested to know.
                    inputs.close = null;
                    deferred = null;
                    closeDeferred = null;
                    modal = null;
                    inputs = null;
                    modalElement = null;
                    modalScope = null;
                  }, delay);
                }
              };

              //  If we have provided any inputs, pass them to the controller.
              if (options.inputs) angular.extend(inputs, options.inputs);

              //  Compile then link the template element, building the actual element.
              //  Set the $element on the inputs so that it can be injected if required.
              var linkFn = $compile(template);
              var modalElement = linkFn(modalScope);
              inputs.$element = modalElement;

              //  Create the controller, explicitly specifying the scope to use.
              var modalController = $controller(options.controller, inputs);

              if (options.controllerAs) {
                modalScope[options.controllerAs] = modalController;
              }
              //  Finally, append the modal to the dom.
              if (options.appendElement) {
                // append to custom append element
                options.appendElement.append(modalElement);
              } else {
                // append to body when no custom append element is specified
                body.append(modalElement);
              }

              //  We now have a modal object...
              var modal = {
                controller: modalController,
                scope: modalScope,
                element: modalElement,
                close: closeDeferred.promise
              };

              //  ...which is passed to the caller via the promise.
              deferred.resolve(modal);

            })
            .then(null, function(error) { // 'catch' doesn't work in IE8.
              deferred.reject(error);
            });

          return deferred.promise;
        };
      }
      return new ModalService();
    }
  ])