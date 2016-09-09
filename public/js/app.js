'use strict';

angular.module('markNote', ['ui.router','hc.marked','user','post'])
.constant('API', 'http://localhost:8000/api/v1.0/')
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	$stateProvider.state('posts', {
		url : '/posts',
		templateUrl : '/views/post/list.html',
		controller : 'PostCtrl',
		resolve: {
			postPromise: ['postService', function(postService){
				return postService.getAll();
			}]
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
		}
	});
	
	$urlRouterProvider.otherwise('users');
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
}]);