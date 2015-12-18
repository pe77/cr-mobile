angular.module('cr.controllers')

.controller('DashboardController', function($scope, $rootScope, $http, $cordovaMedia, $ionicPlatform) {
	$scope.chat = 
	{
		messages:[]
	}

	$scope.user = {
		question:''
	}

	$scope.goiaba 		= 0;
	$scope.hasHeadphone = false;
	$scope.cenouroImage = $scope.cenouroImageDefaul = 'img/cenouro-2015-5.png';

	
	try
	{
		// checa se esta usando headphone
		$ionicPlatform.ready(function(){
			window.plugins.headsetdetection.detect(function(detected) {
				$scope.hasHeadphone = detected;
			});	
		});

	}catch(e ){
		// bla bla bla
	};
	
	


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


	// não pergunte o preço da goiaba
	$scope.PrecoDaGoiaba = function()
	{
		// se esta usando headphone, response normalmente
		if($scope.hasHeadphone)
		{
			$scope.ClearChat();
			$scope.user.question = '';

			$scope.chat.messages.push({
		    	r:"Tá mais ou menos 4,02"
		    });

		    $scope.chat.messages.push({
		    	r:"O preço pode variar dependendo onde você mora!"
		    });

			return;
		}


		// coloca a layer pra "fechar"
		$rootScope.fakeClose = true;

		// toca o audio
		PlayX();

	}

	// manda aquele ao vivo
	function PlayX()
	{
		var src = '/android_asset/www/audio/xxx.mp3'; // aqui só funciona pra android


  		var m = new Media(
		src,
  		function(){
  			// roda denovo
  			m.play();
  		}, 
  		function(){
  			// alert('error' + error.message);
  		});

  		// aumenta o volume
  		m.setVolume(1);
  		window.system.setSystemVolume(1.0);

  		// bota pra chorar
  		m.play();
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


		    // verifica se voltou com mensagem
		    if(response.message)
		    {
		    	// mostra na tela
			    $scope.chat.messages.push({
			    	q:question,
			    	r:response.message
			    });
		    }

		    // volta imagem pra default pro default
		    $scope.cenouroImage = $scope.cenouroImageDefaul;

		    // verifica data
		    if(response.data)
		    {
		    	for (var i = response.data.length - 1; i >= 0; i--) {

		    		// procurando cheats
		    		if(response.data[i].cheat)
		    		{
		    			var cheatCode = parseInt(response.data[i].cheat);

		    			switch(cheatCode)
		    			{
		    				case 1: // solta a goiaba
		    					$scope.PrecoDaGoiaba();
		    					break;
		    			}
		    		}


		    		// procura por imagens
		    		if(response.data[i].image)
		    		{
		    			// troca o avatar pelo que foi passado
		    			$scope.cenouroImage = config.api + response.data[i].image;
		    			
		    		}

		    	};
		    }

		    

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