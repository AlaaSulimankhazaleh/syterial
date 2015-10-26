"use strict";

angular.module("syTerial", [ "collapse", "convertToNumber", "dropdown", "mdInput", "modal", "navDrawerToggle", "ripple", "tabs" ]), 
angular.module("collapse", []).directive("collapse", [ "$timeout", function(a) {
    return {
        restrict: "A",
        transclude: !0,
        replace: !0,
        template: '<div class="collapse"><div ng-transclude></div></div>',
        link: function(b, c, d) {
            b.$watch(d.collapse, function(b) {
                a(function() {
                    c.css("height", b ? c.children()[0].offsetHeight + "px" : "0");
                }, 10);
            });
        }
    };
} ]), angular.module("convertToNumber", []).directive("convertToNumber", function() {
    return {
        require: "ngModel",
        link: function(a, b, c, d) {
            d.$parsers.push(function(a) {
                return parseInt(a, 10);
            }), d.$formatters.push(function(a) {
                return "" + a;
            });
        }
    };
}), angular.module("dropdown", []).directive("dropdown", [ "$window", "$document", function(a, b) {
    return {
        restrict: "A",
        link: function(c, d) {
            function e(a) {
                for (var b, c, d = a.target, e = document.querySelectorAll("[dropdown]"); d; ) {
                    if (b = d.getAttribute("dropdown"), c = d.classList.contains("dropdown-menu"), null !== b) {
                        for (var f = 0, g = e.length; g > f; f++) e[f].classList.remove("open");
                        return void d.classList.add("open");
                    }
                    if (c) {
                        for (var f = 0, g = e.length; g > f; f++) e[f].classList.remove("open");
                        return;
                    }
                    d = d.parentElement;
                }
                for (var f = 0, g = e.length; g > f; f++) e[f].classList.remove("open");
            }
            var f = d[0].getBoundingClientRect();
            d.parent().css({
                position: "relative",
                "z-index": 100
            }), d.addClass("dropdown"), d.children()[0].classList.add("dropdown-toggle"), d.children()[1].classList.add("dropdown-menu"), 
            a.innerWidth < f.left + 160 && angular.element(d[0].getElementsByClassName("dropdown-menu")).addClass("toLeft"), 
            d.on("click", function() {
                d.toggleClass("open");
            }), b.on("click", function(a) {
                e(a);
            });
        }
    };
} ]), angular.module("mdInput", []).directive("mdInput", [ "$timeout", function(a) {
    return {
        restrict: "C",
        link: function(b, c) {
            "" !== c.val() && c.addClass("filled"), c[0].onkeyup = function() {
                "" !== this.value ? c.addClass("filled") : c.removeClass("filled");
            }, c[0].onfocus = function() {
                var b = c.parent();
                b.append('<span class="focusbar"></span>'), a(function() {
                    b.find("span").addClass("show");
                }, 100);
            }, c[0].onblur = function() {
                var b = c.parent();
                b.find("span").removeClass("show"), a(function() {
                    b.find("span").remove();
                }, 500);
            };
        }
    };
} ]), angular.module("modal", []).factory("$modal", [ "$document", function(a) {
    var b = {};
    a.find("body");
    return b.open = function(a) {
        console.log(a);
    }, b;
} ]), angular.module("navDrawerToggle", []).directive("navDrawerToggle", [ function() {
    return {
        restrict: "E",
        replace: !0,
        link: function(a, b) {
            b[0].addEventListener("click", function() {
                b.toggleClass("active");
            });
        },
        template: '<button class="hamburger-menu"></div>'
    };
} ]), angular.module("ripple", []).directive("ripple", [ function() {
    return {
        restrict: "AC",
        scope: {
            ripple: "@"
        },
        link: function(a, b) {
            var c, d, e, f, g;
            b.css({
                overflow: "hidden",
                position: "relative"
            }), "false" != a.ripple && b[0].addEventListener("click", function(h) {
                if (c = h.target.getBoundingClientRect(), d = b.find("span"), 0 === d.length || !d.hasClass("ripple")) {
                    var i = Math.max(c.width, c.height);
                    d = angular.element(document.createElement("span")), d.addClass("ripple"), d.css({
                        width: i + "px",
                        height: i + "px"
                    }), b.append(d);
                }
                d.removeClass("show"), e = h.layerY - d[0].clientHeight / 2, f = h.layerX - d[0].clientWidth / 2, 
                g = "false" != a.ripple && "" === a.ripple ? getComputedStyle(b[0]).color : a.ripple, 
                d.css({
                    top: e + "px",
                    left: f + "px",
                    background: g
                }), d.addClass("show");
            });
        }
    };
} ]), angular.module("tabs", []).directive("tabs", [ function() {
    return {
        require: "ripple",
        restrict: "E",
        transclude: !0,
        scope: {
            animated: "=",
            justified: "=",
            scrollable: "=",
            scrollableHeight: "@"
        },
        controller: [ "$scope", "$element", "$timeout", function(a, b, c) {
            var d = this.panes = a.panes = [];
            this.animated = a.animated, this.scrollable = a.scrollable, a.scrollableHeight = this.scrollableHeight = a.scrollableHeight || 400, 
            a.screenWidth = window.innerWidth, a.$watchGroup([ "animated", "scrollable", "scrollableHeight" ], function(b) {
                a.$broadcast("attrChange", b);
            }), a.$watch("justified", function(b) {
                a.setActiveBar(!1);
            }), a.$watch("panes", function(b) {
                a.$broadcast("panesChange", b);
            }), window.onresize = function() {
                a.screenWidth = window.innerWidth, a.$apply();
            }, a.select = this.select = function(b, c) {
                angular.forEach(d, function(a) {
                    a.selected = !1;
                }), b.selected = !0, c && a.setActiveBar(c);
            }, a.setActiveBar = function(a) {
                var d = angular.element(b[0].querySelector(".active-bar"));
                if (a) {
                    var e = a.target;
                    if ("A" !== a.target.nodeName) for (;e && "A" !== e.nodeName; ) e = e.parentNode;
                    var f = e.getBoundingClientRect(), g = e.parentElement.parentElement, h = g.getBoundingClientRect(), i = f.left - h.left + g.offsetLeft + "px", j = f.width + "px";
                    d.css({
                        width: j,
                        left: i
                    });
                } else c(function() {
                    var a = b[0].querySelector(".pane-links"), c = a.getBoundingClientRect(), e = a.parentElement.parentElement, f = e.getBoundingClientRect(), g = c.left - f.left + e.offsetLeft + "px", h = c.width + "px";
                    d.css({
                        width: h,
                        left: g
                    });
                }, 10);
            }, this.addPane = function(b) {
                0 === d.length && a.select(b), d.push(b);
            };
        } ],
        template: '<div class="tabbable"><ul class="nav nav-tabs" ng-class="{justified: justified && screenWidth >= 768}"><li ng-repeat="pane in panes" ng-class="{active: pane.selected}" ripple="#ffeb3b"><a href="" ng-click="select(pane, $event)" class="pane-links">{{pane.title}} <i ng-if="pane.icon" ng-class="pane.icon"></i></a></li><div class="active-bar"></div></ul><div class="tab-content" ng-transclude></div></div>'
    };
} ]).directive("pane", [ "$timeout", function(a) {
    return {
        require: "^tabs",
        restrict: "E",
        replace: !0,
        transclude: !0,
        scope: {
            title: "@",
            icon: "@"
        },
        link: function(b, c, d, e) {
            function f(c) {
                b.anim = c;
                var d, e = angular.element(document.querySelectorAll(".tab-pane")), f = [];
                a(function() {
                    if (c) {
                        for (var a = 0; a < e.length; a++) f.push(e[a].clientHeight);
                        d = Math.max.apply(Math, f), e.parent().css("height", d + "px");
                    } else e.parent().css("height", "");
                }, 10);
            }
            function g(a, b) {
                var c = angular.element(document.querySelectorAll(".tab-pane"));
                a ? c.css({
                    maxHeight: b + "px",
                    overflowY: "auto"
                }) : c.css({
                    maxHeight: "",
                    overflowY: ""
                });
            }
            angular.isUndefined(b.title) && (b.title = "Pane"), angular.isUndefined(b.icon) && (b.icon = !1), 
            e.addPane(b), b.$on("attrChange", function(a, b) {
                f(b[0]), g(b[1], b[2]);
            }), f(e.animated), g(e.scrollable);
        },
        template: '<div class="tab-pane" ng-class="{fade: anim, in: selected}" ng-transclude></div>'
    };
} ]);