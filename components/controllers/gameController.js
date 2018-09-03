var gameController = angular.module("gameController", []);
gameController.controller("gameCtrl", ['$scope', '$timeout', '$window', function($scope, $timeout, $window) {

  $scope.blackHoleEventManager = function(i, bHGameMode){
    var blackHoleDestination = $scope.player1.position + i;
    var blackHoleDestinationInverted = $scope.player1.position - i;
    if(bHGameMode === 0 && $scope.nowplayfield.platforms[blackHoleDestination].platform_BlackHole.state === 0){
      $scope.sharedBlackHoleEvent = $scope.nowplayfield.platforms[blackHoleDestination].platform_BlackHole.destabilize();
      console.log($scope.nowplayfield.platforms[blackHoleDestination].platform_BlackHole.state);
      if($scope.nowplayfield.platforms[blackHoleDestination].platform_BlackHole.state === 1){
        $timeout( function(){
          $scope.nowplayfield.platforms[blackHoleDestination].platform_BlackHole.stabilize();
        }, 6000);
      };
    } else if (blackHoleDestinationInverted >= 0 && bHGameMode === 1 && $scope.nowplayfield.platforms[blackHoleDestinationInverted].platform_BlackHole.state === 0) {
      $scope.sharedBlackHoleEvent = $scope.nowplayfield.platforms[blackHoleDestinationInverted].platform_BlackHole.destabilize();
      console.log($scope.nowplayfield.platforms[blackHoleDestinationInverted].platform_BlackHole.state);
      if($scope.nowplayfield.platforms[blackHoleDestinationInverted].platform_BlackHole.state === 1){
        $timeout( function(){
          $scope.nowplayfield.platforms[blackHoleDestinationInverted].platform_BlackHole.stabilize();
        }, 6000);
      };
    };
  };

  $scope.holyJump = function(){
    $scope.player1.holyjump($scope.nowplayfield, $scope.nowDestination);
  };

  $scope.jumpAndCheck = function(destination){
    var blackHoleGameMode = $scope.nowplayfield.gameMode;
    destination = parseInt(destination, );
    $scope.nowDestination = destination;
    $scope.blackHoleEventManager(destination, blackHoleGameMode);
    $timeout(function() {
      if($scope.player1.state === 0)
        $scope.player1.jump($scope.nowplayfield.gameMode, destination);
      $scope.sharedBlackHoleEvent = 0;
      $scope.distance = 0;
      $scope.player1.ready();
    }, 2000);
    $timeout(function() {
      if($scope.player1.position === $scope.nowplayfield.platforms.length - 1 && $scope.nowplayfield.platforms[$scope.player1.position].platform_BlackHole.state != 1){
        $window.location.href = 'winner.html';
      }else if($scope.player1.position < 0 || $scope.player1.position >= $scope.nowplayfield.platforms.length || $scope.nowplayfield.platforms[$scope.player1.position].platform_BlackHole.state === 1){
        $window.location.href = 'loser.html';
      }
    }, 2300);
  };

  $scope.inverted_Dimension_Travel = function(){
    var allClass = document.getElementById('all').getAttribute("class");
    var all = document.getElementById('all');
    if($scope.nowplayfield.gameMode != 0){
      all.classList.add('inverted');
    }
    else {
      all.classList.remove('inverted');
    }
  };

  var min = 16;
  var max = 26;

  $scope.nowDestination = 0;
  $scope.stopCounter = 0;
  $scope.sharedBlackHoleEvent = 0;
  $scope.nowplayfield = new playField;
  $scope.nowplayfield.createplayfield(min, max);
  $scope.nowplayfield.playfieldconfirmer(min, max);
  $scope.player1 = new player;
  $scope.distance = 0;

  document.getElementById('jform').addEventListener("submit", function(evt){        //cooldown for submit, let the animation run
    if(document.getElementById('player')){
      if(document.getElementById('player').getAttribute("class") === 'player ng-scope shake')
        document.getElementById('player').classList.remove('shake');
      document.getElementById('player').classList.add('action');
      window.setTimeout(function(){
        if(document.getElementById('player') && document.getElementById('player').getAttribute("class") === 'player ng-scope action')
          document.getElementById('player').classList.remove('action');
      }, 2200);
    };
    document.getElementById('stopb').removeAttribute("disabled");        //sblocca il bottone stop
    document.getElementById('sj').setAttribute("disabled","disabled");        //blocca il tasto submit jump
    setTimeout(function(){
      document.getElementById('stopb').setAttribute("disabled","disabled");
    }, 1000);
    setTimeout(function(){
      document.getElementById('sj').removeAttribute("disabled");
    }, 2300);
  }, false);

  document.addEventListener('keydown', (event) => {
      const keyName = event.key;
      if(keyName === 's'){
        document.getElementById('stopb').click();
        document.getElementById('hj').setAttribute("disabled","disabled");
      }
      if(keyName === 'h'){
        document.getElementById('hj').click();
        document.getElementById('hj').setAttribute("disabled","disabled");
      }
  });

  $scope.$watch("player1.state", function(n){
    if (n == undefined) {
      return;
    };
    if(n === 1){
      document.getElementById('player').classList.remove('action');
      document.getElementById('player').classList.add('shake');
      $scope.stopCounter = $scope.stopCounter + 1;
      window.setTimeout(function(){
        if($scope.stopCounter === 1 && document.getElementById('player').getAttribute("class") === 'player ng-scope shake'){
          document.getElementById('player').classList.remove('shake');
        };
        $scope.stopCounter = $scope.stopCounter - 1;
      }, 6000);
    };
  });

  $scope.$watch("nowplayfield.gameMode", function(n, o){
    if (n == undefined) {
      return;
    };
    if(n != o){
      $scope.inverted_Dimension_Travel();
    }
  });

  $scope.$watch("sharedBlackHoleEvent", function(n, o){
      if (n === undefined) {
        return;
      };
      if(n != o && n === 1 && $scope.player1.holyjumps > 0){
        document.getElementById('hj').removeAttribute("disabled");          //abilita holyjump
      } else if(n != o){
        document.getElementById('hj').setAttribute("disabled","disabled");
      };
    }
  );

}]);
