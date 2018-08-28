var app = angular.module("gamefloor", [])
.controller("myCtrl", ['$scope', '$timeout', '$window', function($scope, $timeout, $window) {

  class player {
    constructor(){
      this.position = 0;
      this.holyjumps = 3;
    };

    jump(destination){
      this.position = this.position + destination;
    };

    stop(){

    };
    holyjump(){

    };
  };

  class BlackHole {
    destabilize(){

    };
    stabilize(){

    };
  };

  class platform {
    constructor(){
      this.min_jump ;
      this.max_jump ;
      this.checkmin = false;
      this.checkmax = false;
      this.state = 0;
      this.platform_BlackHole = 0;
    };
  };

  class playField {
    constructor(){
      this.platforms = [];
      this.gameMode = 0;
    };

    randomRange(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    };

    createplayfield(min, max) {          //createplayfield crea il terreno di gioco e posiziona il player sulla prima piattaforma
      var l = this.randomRange(min, max);
      this.platforms = [];
      for (var i = 0; i < l; i++) {
        var nowplatform = new platform;
        if (i < l - 1) {
            nowplatform.min_jump = this.randomRange(1, 5);
            nowplatform.checkmin = false;
            nowplatform.checkmax = false;
            nowplatform.state = 0;
            nowplatform.max_jump = this.randomRange(nowplatform.min_jump, 5);
            if (nowplatform.min_jump != nowplatform.max_jump) {
              this.platforms.push(nowplatform);       //console.log(nowplatform);
            } else {
              nowplatform = null;
              i--;
            }
        } else {
          nowplatform.state = 0;
          this.platforms.push(nowplatform);       //console.log(nowplatform);
        };
      }
      console.log(this);
    };

    scrollplatforms(platid) {       //scorrimento ricorsivo piattaforme alla ricerca di un percorso vincente
      var nextplatid;
      if (platid <= this.platforms.length - 1) {
        var i = this.platforms[platid].min_jump;
        nextplatid = platid + i;      //selezione piattaforma successiva in base al percorso selezionato dal ciclo
        if (platid === this.platforms.length - 1) {        //percorso valido trovato
          return true;
        } else {
          if (platid < this.platforms.length) {
            return this.scrollplatforms(nextplatid);         //passa alla successiva tappa del percorso
          }
        }
        return false;
      } else
        return false;
    };

    scout(platid, check) {
      var nextplatid;
      if (platid < this.platforms.length) {        // ciclo per esplorare tutte le opzioni della piattaforma
        var i = this.platforms[platid].min_jump;
        nextplatid = platid + i;
        if(!this.platforms[platid].checkmin){
          check = this.scrollplatforms(nextplatid) || check;
          this.platforms[platid].checkmin = true;
          i = this.platforms[platid].max_jump;
        }
        if(!this.platforms[platid].checkmax){
          nextplatid = platid + i;
          check = this.scrollplatforms(nextplatid) || check;
          this.platforms[platid].checkmax = true;
        }

        if (check) {
          return true ;
        } else {        // ricorsioni per esplorare tutte le opzioni generate dalle opzioni della piattaforma
          i = this.platforms[platid].min_jump;
          nextplatid = platid + i;
          check = this.scout(nextplatid, check) || check;
          i = this.platforms[platid].max_jump;
          nextplatid = platid + i;
          check = this.scout(nextplatid, check) || check;
          if (check) {
            return true;
          }
        }
      }
      return check;
    };

    playfieldconfirmer(min, max) {
      if (this.scout(0, false)) {
      } else {
        this.createplayfield(min, max);
        this.playfieldconfirmer(min, max);
      }
    };

  };

  $scope.jumpAndCheck = function(destination){
    destination = parseInt(destination);
    $scope.player1.jump(destination);
    $scope.distance = 0;
    if($scope.player1.position === $scope.nowplayfield.platforms.length - 1){
      $window.location.href = 'winner.html';
    }else if($scope.player1.position < 0 || $scope.player1.position >= $scope.nowplayfield.platforms.length){
      $window.location.href = 'loser.html';
    }
  };

  var min = 16;
  var max = 26;

  $scope.nowplayfield = new playField;
  $scope.nowplayfield.createplayfield(min, max);
  $scope.nowplayfield.playfieldconfirmer(min, max);
  $scope.player1 = new player;
  $scope.distance = 0;
}]);
