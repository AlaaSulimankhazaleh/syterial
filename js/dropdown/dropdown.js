'use strict';

angular.module('dropdown', [])
	.directive('dropdown', ['$window', '$document', function($window, $document) {
		return {
			restrict: 'A',
			link: function(scope, ele) {
				var eleRect = ele[0].getBoundingClientRect();

				ele.parent().css({
					position: 'relative',
					'z-index': 100
				});

				ele.addClass('dropdown');
				ele.children()[0].classList.add('dropdown-toggle');
				ele.children()[1].classList.add('dropdown-menu');

				if ($window.innerWidth < eleRect.left + 160) {
					angular.element(ele[0].getElementsByClassName('dropdown-menu')).addClass(
						'toLeft');
				}

				function hide(event) {
					var target = event.target,
						dropdowns = document.querySelectorAll('[dropdown]'),
						check, checkClass;

					while (target) {
						check = target.getAttribute('dropdown');
						checkClass = target.classList.contains('dropdown-menu');

						if (check !== null) {
							for (var i = 0, len = dropdowns.length; i < len; i++) {
								dropdowns[i].classList.remove('open');
							}
							target.classList.add('open');
							return;
						}

						if (checkClass) {
							for (var i = 0, len = dropdowns.length; i < len; i++) {
								dropdowns[i].classList.remove('open');
							}
							return;
						}

						target = target.parentElement;
					}

					for (var i = 0, len = dropdowns.length; i < len; i++) {
						dropdowns[i].classList.remove('open');
					}
				}

				ele.on('click', function() {
					ele.toggleClass('open');
				});

				$document.on('click', function(e) {
					hide(e);
				});
			}
		};
	}]);
