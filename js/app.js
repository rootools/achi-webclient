var Achivster = angular.module('achi', []);
var api_url_prefix = '/webapi';

Achivster.config(function ($routeProvider) {
  $routeProvider
    .when('/profile', {templateUrl: 'page/profile.html', controller: 'ProfileController'})
    .when('/dashboard', {templateUrl: 'page/dashboard.html', controller : 'DashboardController'})
    .when('/dashboard/:service/', {templateUrl: 'page/dashboard_service.html', controller : 'DashboardServiceController'})
    .when('/feed', {templateUrl: 'page/feed.html', controller : 'FeedController'})
    .when('/top', {templateUrl: 'page/top.html', controller : 'TopController'})
    .when('/top/:filter', {templateUrl: 'page/top.html', controller : 'TopController'})
    .when('/friends', {templateUrl: 'page/friendslist.html', controller : 'FriendsController'})
    .when('/friends/:select', {templateUrl: 'page/friendslist.html', controller : 'FriendsController'})
    .when('/messages', {templateUrl: 'page/messages.html', controller : 'MessagesController'})
    .when('/login')
    .when('/logout')
    .otherwise({redirectTo: '/dashboard'});
});

function AppController ($scope, $rootScope, $http) {

};

function ProfileController ($scope, $rootScope, $routeParams) {

};

function DashboardController ($scope, $rootScope, $routeParams, $http) {
  $http.post(api_url_prefix + '/dashboard/latest').success(function(latest){
    $scope.latest = latest;
  });

  $http.post(api_url_prefix + '/dashboard/service_list').success(function(services){
    $scope.services = services;
  });
};

function DashboardServiceController ($scope, $rootScope, $routeParams, $http) {
  $http.post(api_url_prefix + '/dashboard/'+$routeParams.service).success(function(data){
    $scope.achievements = data.achievements;
    $scope.info = data.info;
  });
};

function FeedController ($scope, $rootScope, $routeParams, $http) {
  $http.post(api_url_prefix + '/feed').success(function(topics){
    $scope.topics = topics;
  });
};

function TopController ($scope, $rootScope, $routeParams, $http, $location) {
  if($routeParams.filter === undefined) {
    $location.path('/top/friends');
  } else if($routeParams.filter === 'friends') {
    
    $http.post(api_url_prefix + '/top/friends').success(function(top_users){
      $scope.top_users = top_users;
      $scope.second_menu_chooser_friends = 'choosed';
      $scope.second_menu_chooser_world = '';
    });
  
  } else if($routeParams.filter === 'world') {
  
    $http.post(api_url_prefix + '/top/world').success(function(top_users){
      $scope.top_users = top_users;
      $scope.second_menu_chooser_friends = '';
      $scope.second_menu_chooser_world = 'choosed';
    });
  
  }
};

function FriendsController ($scope, $rootScope, $routeParams, $http, $location) {
  if($routeParams.select === undefined) {
    $location.path('/friends/list');
  } else if($routeParams.select === 'list') {
  
    $http.post(api_url_prefix + '/friends').success(function(friends_list){
      $scope.friends = friends_list;
      $scope.second_menu_chooser_list = 'choosed';
      $scope.second_menu_chooser_find = '';
      $scope.second_menu_chooser_invite = '';
    });

  } else if($routeParams.select === 'find') {
    $scope.second_menu_chooser_list = '';
    $scope.second_menu_chooser_find = 'choosed';
    $scope.second_menu_chooser_invite = '';
  } else if($routeParams.select === 'invite') {
    $scope.second_menu_chooser_list = '';
    $scope.second_menu_chooser_find = '';
    $scope.second_menu_chooser_invite = 'choosed';
  }
};

function MessagesController ($scope, $rootScope, $routeParams) {

};