'use strict';

angular.module('user.services', [])
.factory('userService', [ '$http', 'API', function($http, API) {
	
	var service = {
		users : []
	};
	
	service.getAll = function() {
		return $http.get(API + 'users')
		.success(function(data) {
			angular.copy(data, service.users);
		});
	};
	

	service.create = function(user) {
		return $http.post(API + 'users', user).success(function(data){
			service.users.push(data);
		});
	};
	
	service.update = function(user, id) {
		console.log('service put user by id = %s', id);
		return $http.put(API + 'users/' + id, user).success(function(data){
			//service.users.push(data);
			console.log('put return res=%j', data);
			return data;
		});
	};
	
	service.get = function(id) {
		console.log('service get user by id = %s', id);
		return $http.get(API + 'users/' + id).then(function(res) {
			return res.data;
		});
	};
	
	service.deleteById = function(id) {
		return $http.delete(API + 'users/' + id).then(function(res) {
			return res.data;
		});
	};
	
	return service;
}]);