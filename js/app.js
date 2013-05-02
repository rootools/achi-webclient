angular.module('achi', []).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/profile', {templateUrl: 'profile.html'/*, controller: FriendsListCtrl*/}).
    when('/dashboard', {templateUrl: 'dashboard.html'/*, controller: FriendsListCtrl*/}).
    when('/friends', {templateUrl: 'friendslist.html'/*, controller: FriendsListCtrl*/}).
    otherwise({redirectTo: '/'});
}]);