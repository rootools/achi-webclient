var Achivster = angular.module('achi', []);

Achivster.config(function ($routeProvider) {
  $routeProvider
//    .when('/profile', {templateUrl: 'profile.html', controller: 'ProfileController'})
    .when('/page/dashboard', {templateUrl: 'dashboard.html', controller : 'DashboardController'})
//    .when('/dashboard/:service/', {templateUrl: 'dashboard_service.html'})
//    .when('/feed', {templateUrl: 'feed.html'})
//    .when('/top', {templateUrl: 'top.html'})
//    .when('/friends', {templateUrl: 'friendslist.html'})
//    .when('/messages', {templateUrl: 'messages.html'})
//    .when('/login')
//    .when('/logout')
    .otherwise({redirectTo: '/index.html'});
});

function AppController ($scope, $rootScope, $http) {

}

function DashboardController ($scope, $rootScope, $routeParams) {
  // Getting the slug from $routeParams
    var slug = $routeParams.slug;
    console.log('DashboardController called, sc : ' + scope + ', rs : ' + rootScope + ', rp : ' + routeParams);
    $scope.$emit('routeLoaded', {slug: slug});
    $scope.page = $rootScope.pages[slug];
}

