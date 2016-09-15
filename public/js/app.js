'use strict';

angular.module('markNote', ['ui.router','hc.marked','auth','user','post'])
.constant('API', 'http://localhost:8000/api/v1.0/')
.constant('clientTokenName', 'jwt-client-token')
.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {
	$stateProvider.state('posts', {
		url : '/posts',
		templateUrl : '/views/post/list.html',
		controller : 'PostCtrl',
		resolve: {
			postPromise: ['postService', function(postService){
				return postService.getAll();
			}]
		},
		data:{
			requireLogin: false
		}
	})
	// default route to list the blogs
	.state('blogs', {
		url : '/blogs',
		templateUrl : '/views/blog/list.html',
		controller : 'BlogCtrl',
		resolve: {
			postPromise: ['postService', function(postService){
				return postService.getBlogs();
			}]
		},
		data:{
			requireLogin: false
		}
	})
	.state('users', {
		url : '/users',
		templateUrl : '/views/user/list.html',
		controller : 'UserCtrl',
		resolve: {
			userPromise: ['userService', function(userService){
				return userService.getAll();
			}]
		},
		data:{
			requireLogin: true
		}
	})
	.state('post-view', {
		url : '/post/view/:id',
		templateUrl : '/views/post/view.html',
		controller : 'PostViewCtrl',
		resolve : {
			post : ['$stateParams', 'postService',
			function($stateParams, postService) {
				return postService.get($stateParams.id);
			}]
		},
		data:{
			requireLogin: false
		}
	})
	.state('post-edit', {
		url : '/post/edit/:id',
		templateUrl : '/views/post/edit.html',
		controller : 'PostEditCtrl',
		resolve : {
			post : ['$stateParams', 'postService',
			function($stateParams, postService) {
				return postService.get($stateParams.id);
			}],
			postPromise: ['postService', function(postService){
				return postService.getTags();
			}]
		},
		data:{
			requireLogin: true
		}
	})
	.state('post-add', {
		url : '/post/add',
		templateUrl : '/views/post/edit.html',
		controller : 'PostAddCtrl',
		resolve: {
			postPromise: ['postService', function(postService){
				return postService.getTags();
			}]
		},
		data:{
			requireLogin: true
		}
	})
	.state('login', {
		url : '/login',
		templateUrl : '/views/login.html',
		controller : 'AuthCtrl',
		onEnter : [ '$state', 'authService', function($state, authService) {
			if (authService.isLoggedIn()) {
				$state.go('home');
			}
		} ],
		data:{
			requireLogin: false
		}
	});
	$httpProvider.interceptors.push('authInterceptor');
	$urlRouterProvider.otherwise('blogs');
}])
.config(['markedProvider', function (markedProvider) {
  markedProvider.setOptions({
    gfm: true,
    tables: true
//    highlight: function (code, lang) {
//      if (lang) {
//        return hljs.highlight(lang, code, true).value;
//      } else {
//        return hljs.highlightAuto(code).value;
//      }
//    }
  });
}])
.run(function ($rootScope,$state,authService) {

	$rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
		var requireLogin = toState.data.requireLogin;
		console.log('state change event, isLoggedIn=%s',authService.isLoggedIn());
		// typeof $rootScope.currentUser === 'undefined'
		if (requireLogin && (!authService.isLoggedIn())) {
			event.preventDefault();
			// code for unauthorized access
			console.log('state change event -- unauthorized');
			$state.go('login');
		}
	});
});