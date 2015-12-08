angular.module('cr.controllers')

.controller('DashboardController', function($scope, $rootScope, $http) {
	$scope.chat = {
		question:'',
		response:''
	}

	$scope.user = {
		question:''
	}

	$scope.Send = function()
	{

		if($scope.chat.question == '' && false)
			return;
		//

		// carregando
		$rootScope.loading = true;


		$scope.chat = {
			question:'',
			response:''
		}

		var question = "";
		question = $scope.user.question;


		$http({
		  method: 'GET',
		  params:{
		  	requestType:'talk',
		  	input:$scope.user.question
		  },
		  url: config.api
		}).then(function successCallback(response) {
		    $rootScope.loading = false;

		  	$scope.chat.response = response.data;
		  	$scope.chat.question = question;

		  	$scope.user.question = '';

		}, $rootScope.ResponseFail);


	}

});