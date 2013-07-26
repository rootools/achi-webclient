var Achivster = angular.module('achi', []);

var path = {};
path.api_prefix = '/webapi';
moment.lang('ru');


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

/*Achivster.directive('fastClick', ['$parse', function ($parse) {
  return function (scope, element, attr) {
    var fn = $parse(attr['fastClick']);
    var initX, initY, endX, endY;
    var elem = element;
    var maxMove = 4;

    elem.bind('touchstart', function (event) {
      event.preventDefault();
      initX = endX = event.touches[0].clientX;
      initY = endY = event.touches[0].clientY;
      elem.bind('touchend', onTouchEnd);
      elem.bind('touchmove', onTouchMove);
    });

    function onTouchMove(event) {
      endX = event.touches[0].clientX;
      endY = event.touches[0].clientY;
    };

    function onTouchEnd(event) {
      elem.unbind('touchmove');
      elem.unbind('touchend');
      if (Math.abs(endX - initX) > maxMove) return;
      if (Math.abs(endY - initY) > maxMove) return;
      scope.$apply(function () { fn(scope, { $event: event }); });
    };
  };
} ]);*/

Achivster.directive('achievementDescription', function(){
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    templateUrl: 'page/dashboard_achievement_description.html'
  }
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

  $scope.checkShortname = function() {
    var shortname = $scope.profile.shortname;
    var reg = /^[a-z0-9_-]{3,20}$/;
    if(!reg.test(shortname)) {
      $scope.form_error_message = 'Используются недопустимые символы в поле Псевдоним';
    } else {
      $scope.form_error_message = '';
    }
  }

  $scope.checkName = function() {
    var name = $scope.profile.name;
    var reg = /^[a-z A-Z а-я А-Я]{3,20}$/;
    if(!reg.test(name)) {
      $scope.form_error_message = 'Используются недопустимые символы в поле Имя';
    } else {
      $scope.form_error_message = '';
    }
  }

  $scope.addAvatar = function() {
    var img = document.getElementById('edit_profile_avatar_change_button_input').files[0];
    document.getElementById('edit_profile_avatar_image').src = window.URL.createObjectURL(img);
    document.getElementById('edit_profile_avatar_change_button_save').style.display = 'block';
  };
};

function DashboardController ($scope, $rootScope, $routeParams, $http) {
  if($routeParams.shortname && $rootScope.shortname && $rootScope.shortname !== $routeParams.shortname) {
    $scope.headerStatus = function() { return true; };
    $scope.hideSharing = false;
    $http.post(path.api_prefix + '/user/info', {shortname: $routeParams.shortname}).success(function(info){
      var uid = info.uid;
      $http.post(path.api_prefix + '/user/points', {uid: uid}).success(function(points){
        info.points = points;
        if(info.friendship === true) {
          info.friendship = function() { return true; };
          info.friendship_true_message = 'Прекратить дружбу';
        } else if (info.friendship === false) {
          info.friendship = function() { return false; };
        }
        $scope.info = info;
      });
    });

  } else {
    $scope.hideSharing = true;
    $scope.headerStatus = function() { return false; };
  }

  $http.post(path.api_prefix + '/dashboard/latest', {shortname: $routeParams.shortname}).success(function(latest){
    
    for(var i in latest) {
      latest[i].earned = true;
      latest[i].sharingTwitter = 'http://twitter.com/intent/tweet?text='+encodeURIComponent('Я заработал(а) достижение "'+latest[i].name+'" за '+latest[i].points+' очков. http://achivster.com/#/u/'+$rootScope.shortname+' #achivster');
      latest[i].sharingFacebook = 'https://www.facebook.com/dialog/feed?app_id=258024554279925&link=https://developers.facebook.com/docs/reference/dialogs/&picture=http://achivster.com'+latest[i].icon+'&name='+encodeURIComponent('Я заработал(а) достижение!')+'&caption=http://achivster.com/&description="'+encodeURIComponent(latest[i].name + '" за '+latest[i].points+' очков. #achivster')+'&redirect_uri='+encodeURIComponent('http://achivster.com/#/u/'+$rootScope.shortname);
      latest[i].sharingVk = 'http://vk.com/share.php?url='+encodeURIComponent('http://achivster.com/#/u/'+$rootScope.shortname)+'&title=Я заработал(а) достижение&description="'+latest[i].name+'" за '+latest[i].points+' очков.&image=http://achivster.com'+latest[i].icon;
    }

      $http.post(path.api_prefix + '/dashboard/service_list', {shortname: $routeParams.shortname}).success(function(services){
        for(var i in services) {
          services[i].percent = Math.floor(services[i].earned * 100 / services[i].full);
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

        for(var i in latest) {
          for(var n in services) {
            if(services[n].service === latest[i].service) {
              latest[i].color = services[n].color;
            }
          }
        }

        $scope.latest = latest;
        $scope.services = services;

      });

    
  });

  $scope.addFriend = function() {
    var target_uid = $scope.info.uid;
    
    $http.post(path.api_prefix + '/friends/add', {uid: target_uid}).success(function(message){
      $scope.info.friendship = function() { return true; };
      $scope.info.friendship_true_message = message.message;
    });
  }

  $scope.removeFriend = function() {
    var target_uid = $scope.info.uid;
    $http.post(path.api_prefix + '/friends/remove', {friend_uid: target_uid}).success(function(message){
      $scope.info.friendship = function() { return false; };
      $scope.info.friendship_true_message = 'Добавить в друзья';
    });
  }

  $scope.dashboard_sorting_elem_list = '';
  $scope.dashboard_sorting_elem_icon = 'choosed';

  $scope.show_as_list = function() {
    $scope.sort_handler = true;
    $scope.dashboard_sorting_elem_list = 'choosed';
    $scope.dashboard_sorting_elem_icon = '';
  }

  $scope.show_as_icons = function() {
    $scope.sort_handler = false;
    $scope.dashboard_sorting_elem_list = '';
    $scope.dashboard_sorting_elem_icon = 'choosed';
  }

  $scope.showAchievementDescription = function(achiv) {
    $scope.showDescription = true;
    $scope.achiv = achiv;
  };

  $scope.closeAchievementDescription = function() {
    $scope.showDescription = false;
  };

};

function DashboardServiceController ($scope, $rootScope, $routeParams, $http) {
  if($routeParams.shortname && $rootScope.shortname !== $routeParams.shortname) {
    $scope.hideSharing = false;
  } else {
    $scope.hideSharing = true;
  }
  if($routeParams.shortname) {
    var shortname = $routeParams.shortname;
  } else {
    var shortname = $rootScope.shortname;  
  }
  $scope.shortname = shortname;
  $http.post(path.api_prefix + '/dashboard/'+$routeParams.service, {shortname: shortname}).success(function(data){
    for(var i in data.achievements) {
      if(data.achievements[i].earned === false) {
        data.achievements[i].color = '';
      } else {
        data.achievements[i].color = data.info.color;
      }

      data.achievements[i].sharingTwitter = 'http://twitter.com/intent/tweet?text='+encodeURIComponent('Я заработал(а) достижение "'+data.achievements[i].name+'" за '+data.achievements[i].points+' очков. http://achivster.com/#/u/'+$rootScope.shortname+' #achivster');
      data.achievements[i].sharingFacebook = 'https://www.facebook.com/dialog/feed?app_id=258024554279925&link=https://developers.facebook.com/docs/reference/dialogs/&picture=http://achivster.com'+data.achievements[i].icon+'&name='+encodeURIComponent('Я заработал(а) достижение!')+'&caption=http://achivster.com/&description="'+encodeURIComponent(data.achievements[i].name + '" за '+data.achievements[i].points+' очков. #achivster')+'&redirect_uri='+encodeURIComponent('http://achivster.com/#/u/'+$rootScope.shortname);
      data.achievements[i].sharingVk = 'http://vk.com/share.php?url='+encodeURIComponent('http://achivster.com/#/u/'+$rootScope.shortname)+'&title=Я заработал(а) достижение&description="'+data.achievements[i].name+'" за '+data.achievements[i].points+' очков.&image=http://achivster.com'+data.achievements[i].icon;
    }
    
    $scope.achievements = data.achievements;
    $scope.info = data.info;
  });

  $scope.showAchievementDescription = function(achiv) {
    $scope.showDescription = true;
    $scope.achiv = achiv;
  };

  $scope.closeAchievementDescription = function() {
    $scope.showDescription = false;
  };
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

function MessagesController ($scope, $rootScope, $routeParams, $http) {
  $http.post(path.api_prefix + '/messages/get').success(function(messages){
    messages = messages.messages;
    if(messages.length > 0) {
      $scope.hideNullMessage = function() {
        return true;
      }
    }
    for(var i in messages) {
      var duration = new Date().getTime() - messages[i].time;
      messages[i].time = moment.duration(duration, "milliseconds").humanize() + ' назад';
    }
    $scope.messages = messages;
  });

  $scope.acceptFriendship = function(message) {
    $http.post(path.api_prefix + '/friends/accept', {owner_uid: message.uid}).success(function(){
      message.action_message = 'Подтверждено';
      message.hideButtons = function() { return true; }
    });
  };

  $scope.rejectFriendship = function(message) {
    $http.post(path.api_prefix + '/friends/reject', {owner_uid: message.uid}).success(function(){
      message.action_message = 'Отклонено';
      message.hideButtons = function() { return true; }
    });
  };
};

function UserInfoUpdateController($scope, $rootScope, $routeParams, $http, $location) {
  $http.post(path.api_prefix + '/profile').success(function(userInfo){
    if(!userInfo) {
      document.location.href='/login';
    }
    $scope.userInfo = userInfo;
    $rootScope.uid = userInfo.uid;
    $rootScope.shortname = userInfo.shortname;
  });

  $http.post(path.api_prefix + '/user/points').success(function(points){
    $scope.points = points;
  });
};