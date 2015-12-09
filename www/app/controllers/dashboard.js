angular.module('cr.controllers')

.controller('DashboardController', function($scope, $rootScope, $http) {
	$scope.chat = 
	{
		messages:[]
	}

	$scope.user = {
		question:''
	}


	$scope.ClearChat = function()
	{
		$scope.chat.messages = [];
	}


	$scope.Rec = function()
	{
		$scope.ClearChat();

		var maxMatches = 3;
        var promptString = "Fala ai!"; // optional
        var language = "en-US";                     // optional
        window.plugins.speechrecognizer.startRecognize(function(result){
            
            $scope.$apply(function () {
            	$scope.user.question = result[0];
            });
            
            // alert(result);

        }, function(errorMessage){
            
            console.log("Error message: " + errorMessage);

            $scope.chat.messages.push({
		    	r:"Não entendi nada, fala direito."
		    });

        }, maxMatches, promptString);
	}




	$scope.Send = function()
	{

		if($scope.user.question == '')
			return;
		//

		// carregando
		$rootScope.loading = true;


		// limpa chat
		$scope.ClearChat();

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

			var response = response.data;

		    $rootScope.loading = false;

		    // mostra na tela
		    $scope.chat.messages.push({
		    	q:question,
		    	r:response.message
		    });

		    // limpa form
		  	$scope.user.question = '';

		}, function(){

			// para o loading
			$rootScope.loading = false;

			// randomiza uma resposta
			var message = '';
			switch(Math.floor((Math.random() * 15) + 1))
			{
				case 1:
					message = "Precisa de internet pra funcionar, jovem.";
					break;

				case 2:
					message = "Coloca algum credito no celular aew, seu fudido!";
					break;

				case 3:
					message = "Grande bosta ter um telefone foda se não tem dinheiro nem pro 3G!";
					break;

				case 4:
					message = "Vá roubar o wifi do vizinho!";
					break;

				case 5:
					message = "Arruma essa internet ai, rapaz.";
					break;

				case 6:
					message = "JESUS COMO EU QUERO MORRER HOJE";
					break;

				case 7:
					message = "Como espera que eu estrague sua vida sem internet?";
					break;

				case 8:
					message = "Só funciono com internet. Assim como você!";
					break;

				default:
					message = "...";
			    //

			}


			// limpa form
		  	$scope.user.question = '';

			// exibe
			$scope.chat.messages.push({
		    	r:message
		    });	

		    $scope.chat.messages.push({
		    	r:"(sem conexão)"
		    });	
			
		});


	}

});