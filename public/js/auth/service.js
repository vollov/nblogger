'use strict';

angular.module('auth.services', [])
.factory('authService', [ '$http', '$window', 'API', 'clientTokenName', function($http, $window, API, clientTokenName) {
	var auth = {};

	auth.saveToken = function(token) {
		$window.localStorage[clientTokenName] = token;
	};

	auth.getToken = function() {
		return $window.localStorage[clientTokenName];
	};
	
	auth.isLoggedIn = function() {
		var token = auth.getToken();
		//console.log('in auth.isLoggedIn token=' + token);
		// JWT token format: xxxxx.yyyyy.zzzzz  (header.payload.signature)
		// atob() - decodes a base-64 encoded string.
		// e.g. translate SGVsbG8gV29ybGQh to Hello World!
		if (token && token != 'undefined') {
			var payload = JSON.parse($window.atob(token.split('.')[1]));
			// exp in seconds
			return payload.exp > Date.now() / 1000;
		} else {
			return false;
		}
	};

	auth.currentUser = function() {
		if (auth.isLoggedIn()) {
			var token = auth.getToken();
			var payload = JSON.parse($window.atob(token.split('.')[1]));
			return payload.username;
		}
	};
	
	auth.register = function(user) {
		return $http.post(API + '/register', user).success(function(data) {
			auth.saveToken(data.token);
		});
	};

	auth.logIn = function(user) {
		return $http.post(API + '/login', user).success(function(data) {
			auth.saveToken(data.token);
		});
	};

	auth.logOut = function() {
		$window.localStorage.removeItem(clientTokenName);
	};

	return auth;
}])
.factory('authInterceptor', ['$injector','API',function authInterceptor($injector,API) {
	var interceptor = {};
	
	interceptor.request = function(config) {
		console.log('testInterceptor request config.url=%s', config.url);
		
		var authService = $injector.get('authService');
		var token = authService.getToken();
		
		console.log('testInterceptor request config.url.indexOf(API)=%s, token=%s', config.url.indexOf(API), token);
		if (config.url.indexOf(API) === 0 && token) {
			console.log('testInterceptor request --send token = ' + token);
			config.headers.HTTP_JWT = token;
		}
		return config;
	};
	
	interceptor.response = function(res) {
		console.log('testInterceptor response res.config.url=%s', res.config.url);
		console.log('testInterceptor response: res.config.url.indexOf(API)=%s, res.data.token=%s ',res.config.url.indexOf(API),res.data.token);
		//authService.saveToken('aabbcc');
		var authService = $injector.get('authService');
		if(res.config.url.indexOf(API) === 0 && res.data.token) {
		    console.log('here');
		    authService.saveToken(res.data.token);
		}
		return res;
	};
	
	interceptor.responseError= function(res) {
		console.log('testInterceptor responseError');
		return res;
	};
	return interceptor;	
}]);