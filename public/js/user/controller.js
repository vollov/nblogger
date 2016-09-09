'use strict';

angular.module('user.controllers', [ 'user.services'])
.controller('UserCtrl', ['$scope', 'userService',
function($scope, userService) {
	$scope.users = userService.users;

	$scope.selectUser = function(row) {
		$scope.selectedRow = row;
	};
	
	$scope.deleteUser = function(user, index) {
		//console.log('delete user by id='+ user._id);
		userService.deleteById(user._id);
		$scope.users.splice(index, 1);
	};
}]);
//.controller('PostAddCtrl', ['$scope','$state', 'userService', function($scope, $state, userService) {
//	$scope.tags = userService.tags;
//	
//	//console.log('tags= %j', tags);
//	$scope.savePost = function() {
//		if (!$scope.user.title || $scope.user.title === '') {
//			return;
//		}
//		if (!$scope.user.id || $scope.user.id === '') {
//			return;
//		}
//		
//		userService.create({
//			id:$scope.user.id,
//			tag:$scope.user.tag,
//			title : $scope.user.title,
//			content : $scope.user.content
//		});
//		$scope.user.id = '';
//		$scope.user.title = '';
//		$scope.user.content = '';
//		
//		$state.go('users');
//	};
//}])
//.controller('PostViewCtrl', ['$scope', 'user', function($scope,user) {
//	$scope.user = user;
//	$scope.markdown_content = user.content;
//}])
//.controller('PostEditCtrl', ['$scope', '$state', 'user', 'userService', function($scope, $state,user, userService) {
//	$scope.user = user;
//	$scope.tags = userService.tags;
//	
//	$scope.savePost = function() {
//		if (!$scope.user.title || $scope.user.title === '') {
//			return;
//		}
//		if (!$scope.user.id || $scope.user.id === '') {
//			return;
//		}
//		
//		userService.update({
//			id:$scope.user.id,
//			tag:$scope.user.tag,
//			title : $scope.user.title,
//			content : $scope.user.content
//		}, user._id);
//		$scope.user.id = '';
//		$scope.user.title = '';
//		$scope.user.content = '';
//		
//		$state.go('users');
//	};
//}]);