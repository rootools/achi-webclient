angular.module('achi', []).
  config(['$routeProvider', function($routeProvider, $cookies) {
  $routeProvider.
    when('/profile', {templateUrl: 'profile.html'}).
    when('/dashboard', {templateUrl: 'dashboard.html'}).
    when('/dashboard/:service/', {templateUrl: 'dashboard_service.html'}).
    when('/feed', {templateUrl: 'feed.html'}).
    when('/top', {templateUrl: 'top.html'}).
    when('/friends', {templateUrl: 'friendslist.html'}).
    when('/messages', {templateUrl: 'messages.html'}).
    when('/login').
    when('/logout').
    otherwise({redirectTo: '/'});
}]);