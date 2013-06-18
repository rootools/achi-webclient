var Achivster = angular.module('achi', []);

var path = {};
path.api_prefix = '/webapi';

Achivster.config(function ($routeProvider, $httpProvider) {
  $routeProvider
    .when('/profile', {templateUrl: 'page/profile.html', controller: 'ProfileController'})
    .when('/u/:shortname', {templateUrl: 'page/dashboard.html', controller : 'DashboardController'})
    .when('/dashboard', {templateUrl: 'page/dashboard.html', controller : 'DashboardController'})
    .when('/dashboard/:service/', {templateUrl: 'page/dashboard_service.html', controller : 'DashboardServiceController'})
    .when('/dashboard/:service/:shortname', {templateUrl: 'page/dashboard_service.html', controller : 'DashboardServiceController'})
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
  
  if($routeParams.shortname && $rootScope.shortname !== $routeParams.shortname) {
    $scope.headerStatus = function() { return true; };
    $http.post(path.api_prefix + '/user/info', {shortname: $routeParams.shortname}).success(function(info){
      var uid = info.uid;
      
      $http.post(path.api_prefix + '/user/points', {uid: uid}).success(function(points){
        info.points = points;
        if(info.friendship === true) {
          info.friendship = function() { return true; };
        } else if (info.friendship === false) {
          info.friendship = function() { return false; };
        }
        $scope.info = info;
      });
    });

  } else {
    $scope.headerStatus = function() { return false; };
  }

  $http.post(path.api_prefix + '/dashboard/latest', {shortname: $routeParams.shortname}).success(function(latest){
    $scope.latest = latest;
    if(latest.error) {
      $scope.error = true;
      $scope.error_text = latest.error;
    }
  });

  $http.post(path.api_prefix + '/dashboard/service_list', {shortname: $routeParams.shortname}).success(function(services){
    for(var i in services) {
      if(services[i].valid === true) {
        
        if($routeParams.shortname && $rootScope.shortname !== $routeParams.shortname) {
          services[i].link = '#/dashboard/'+services[i].service+'/'+$routeParams.shortname;
        } else {
          services[i].link = '#/dashboard/'+services[i].service;
        }

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
  if($routeParams.shortname) {
    var shortname = $routeParams.shortname;
  } else {
    var shortname = $rootScope.shortname;  
  }
  $http.post(path.api_prefix + '/dashboard/'+$routeParams.service, {shortname: shortname}).success(function(data){
    
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
    $scope.topics = topics;
  });
};

function TopController ($scope, $rootScope, $routeParams, $http, $location) {
  if($routeParams.filter === undefined) {
    $location.path('/top/friends');
  } else if($routeParams.filter === 'friends') {
    
    $http.post(path.api_prefix + '/top/friends').success(function(top_users){
      console.log(top_users)
      $scope.top_users = top_users;
      $scope.second_menu_chooser_friends = 'choosed';
      $scope.second_menu_chooser_world = '';
    });
  
  } else if($routeParams.filter === 'world') {
  
    $http.post(path.api_prefix + '/top/world').success(function(top_users){
      console.log(top_users)
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
      for(var i in friends_list) {
        friends_list[i].display = function (){return true;}
        friends_list[i].remove_message = 'Удалить из друзей';
      }
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

  $scope.Friendship = function(friend, state) {
    var uid = friend.uid;
    
    if (state % 2 === 0) { var action = 'restore' }
    else { var action = 'remove'; }

    if(action === 'remove') {
      $http.post(path.api_prefix + '/friends/remove', {friend_uid: uid}).success(function(){
        friend.opacity = 0.2;
        friend.display = function (){return false;}
        friend.remove_message = 'Восстановить дружбу';
      });
    } else if(action === 'restore') {
      $http.post(path.api_prefix + '/friends/restore', {friend_uid: uid}).success(function(){
        friend.opacity = 1;
        friend.display = function (){return true;}
        friend.remove_message = 'Удалить из друзей';
      });
    }
  
  };
};

function MessagesController ($scope, $rootScope, $routeParams) {

};

function UserInfoUpdateController($scope, $rootScope, $routeParams, $http) {
  $http.post(path.api_prefix + '/profile').success(function(userInfo){
    $scope.userInfo = userInfo;
    $rootScope.uid = userInfo.uid;
    $rootScope.shortname = userInfo.shortname;
  });

  $http.post(path.api_prefix + '/user/points').success(function(points){
    $scope.points = points;
  });
};