angular.module('cr.controllers')

.controller('GlobalController', function($scope, $rootScope, $ionicLoading) {

	$rootScope.config 	      = config;
	$rootScope.loading			  = false;


	// sempre que alterar o loading, coloca o carregando
	$scope.$watchCollection('loading', function(newValue, oldValue) {
  		newValue ? $ionicLoading.show() : $ionicLoading.hide();

	});


	$rootScope.ResponseFail = function(response)
	{
		$rootScope.loading = false;

		// mensagem de erro de conexção generica
		alert('Erro ao tentar se conectar. Verifique sua conexão e tente novamente.');
	}


});