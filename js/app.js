var Achivster = angular.module('achi', []);

Achivster.config(function ($routeProvider) {
  $routeProvider
    .when('/profile', {templateUrl: 'page/profile.html', controller: 'ProfileController'})
    .when('/dashboard', {templateUrl: 'page/dashboard.html', controller : 'DashboardController'})
    .when('/dashboard/:service/', {templateUrl: 'page/dashboard_service.html'})
    .when('/feed', {templateUrl: 'page/feed.html', controller : 'FeedController'})
    .when('/top', {templateUrl: 'page/top.html', controller : 'TopController'})
    .when('/top/:filter', {templateUrl: 'page/top.html', controller : 'TopController'})
    .when('/friends', {templateUrl: 'page/friendslist.html', controller : 'FriendsController'})
    .when('/friends/:select', {templateUrl: 'page/friendslist.html', controller : 'FriendsController'})
    .when('/messages', {templateUrl: 'page/messages.html', controller : 'MessagesController'})
    .when('/login')
    .when('/logout')
    .otherwise({redirectTo: '/index.html'});
});

function AppController ($scope, $rootScope, $http) {

};

function ProfileController ($scope, $rootScope, $routeParams) {

};

function DashboardController ($scope, $rootScope, $routeParams, $http) {
  $http.post('/dashboard/latest').success(function(latest){
    $scope.latest = latest;
  });

  $http.post('/dashboard/service_list').success(function(services){
    console.log(services);
    $scope.services = services;
  });
};

function FeedController ($scope, $rootScope, $routeParams, $http) {
  $http.post('/feed').success(function(topics){
    console.log(topics);
    $scope.topics = topics;
  });
};

function TopController ($scope, $rootScope, $routeParams, $http, $location) {
  if($routeParams.filter === undefined) {
    $location.path('/top/friends');
  } else if($routeParams.filter === 'friends') {
    
    $http.post('/top/friends').success(function(top_users){
      $scope.top_users = top_users;
      $scope.second_menu_chooser_friends = 'choosed';
      $scope.second_menu_chooser_world = '';
    });
  
  } else if($routeParams.filter === 'world') {
  
    $http.post('/top/world').success(function(top_users){
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
  
    $http.post('/friends').success(function(friends_list){
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