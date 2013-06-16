var Achivster = angular.module('achi', []);

var path = {};
path.api_prefix = '/webapi';

Achivster.config(function ($routeProvider, $httpProvider) {
  $routeProvider
    .when('/profile', {templateUrl: 'page/profile.html', controller: 'ProfileController'})
    .when('/u/:user', {templateUrl: 'page/dashboard.html', controller : 'DashboardController'})
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

function ProfileController ($scope, $rootScope, $routeParams, $http, $timeout) {
  $scope.form_error_message = '';

  $http.post(path.api_prefix + '/profile').success(function(profile){
    profile.omg = '';
    $scope.profile = profile;
  });

  $scope.saveProfile = function() {
    var request = {};

    if($scope.profile_pass && $scope.profile_pass_new && $scope.profile_pass.length > 0 && $scope.profile_pass_new > 0) {
      request.password = $scope.profile_pass;
      request.password_confirm = $scope.profile_pass_new;
    }
    
    request.profile = $scope.profile;

    $http.post(path.api_prefix + '/profile/save', request).success(function(){
      $scope.form_success_message = 'Изменения сохранены';
      $timeout(function(){
        $scope.form_success_message = '';
      }, 3000);
    });

  }

  $scope.checkPassword = function() {
    if($scope.profile_pass !== $scope.profile_pass_new) {
      $scope.form_error_message = 'Введенные пароли не совпадают';
    } else {
      $scope.form_error_message = '';
    }
  }

  $scope.submitButtonDisabler = function() {
    if($scope.form_error_message.length > 0) {
      return true;  
    } else {
      return false;
    }
  }
  
  $scope.addAvatar = function() {
    var img = document.getElementById('edit_profile_avatar_change_button_input').files[0];
    document.getElementById('edit_profile_avatar_image').src = window.URL.createObjectURL(img);
    document.getElementById('edit_profile_avatar_change_button_save').style.display = 'block';
  };
};

function DashboardController ($scope, $rootScope, $routeParams, $http) {
  $http.post(path.api_prefix + '/dashboard/latest', {shortname: $routeParams.user}).success(function(latest){
    $scope.latest = latest;
    if(latest.error) {
      $scope.error = true;
      $scope.error_text = latest.error;
    }
  });

  $http.post(path.api_prefix + '/dashboard/service_list', {shortname: $routeParams.user}).success(function(services){
    for(var i in services) {
      if(services[i].valid === true) {
        services[i].link = '#/dashboard/'+services[i].service;
      } else {
        services[i].link = path.api_prefix + '/add_service/'+services[i].service;
        services[i].color = '#c0c0c0';
      }
    }

    for(var i in $scope.latest) {
      for(var n in services) {
        if(services[n].service === $scope.latest[i].service) {
          $scope.latest[i].color = services[n].color;
        }
      }
    }

    $scope.services = services;
  });
};

function DashboardServiceController ($scope, $rootScope, $routeParams, $http) {
  $http.post(path.api_prefix + '/dashboard/'+$routeParams.service).success(function(data){
    
    for(var i in data.achievements) {
      if(data.achievements[i].earned === false) {
        data.achievements[i].color = '';
      } else {
        data.achievements[i].color = data.info.color;
      }
    }
    
    $scope.achievements = data.achievements;
    $scope.info = data.info;
  });
};

function FeedController ($scope, $rootScope, $routeParams, $http) {
  $http.post(path.api_prefix + '/feed').success(function(topics){
  console.log(topics);
    $scope.topics = topics;
  });
};

function TopController ($scope, $rootScope, $routeParams, $http, $location) {
  if($routeParams.filter === undefined) {
    $location.path('/top/friends');
  } else if($routeParams.filter === 'friends') {
    
    $http.post(path.api_prefix + '/top/friends').success(function(top_users){
      $scope.top_users = top_users;
      $scope.second_menu_chooser_friends = 'choosed';
      $scope.second_menu_chooser_world = '';
    });
  
  } else if($routeParams.filter === 'world') {
  
    $http.post(path.api_prefix + '/top/world').success(function(top_users){
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
  
    $http.post(path.api_prefix + '/friends').success(function(friends_list){
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

function UserInfoUpdateController($scope, $rootScope, $routeParams, $http) {
  $http.post(path.api_prefix + '/profile').success(function(userInfo){
    $scope.userInfo = userInfo;
  });

  $http.post(path.api_prefix + '/user/getPoints').success(function(points){
    $scope.points = points;
  });
};