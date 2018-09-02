class player {
  constructor(){
    this.position = 0;
    this.holyjumps = 3;
    this.state = 0;
  };

  jump(gameMode, destination){
    this.state = 0;
    if(gameMode === 0)
      this.position = this.position + destination;
    else
      this.position = this.position - destination;
  };

  stop(){
    this.state = 1;
  };

  ready(){
    this.state = 0;
  }

  holyjump(playfield, holyRange){
    this.holyjumps = this.holyjumps - 1;
    if(playfield.gameMode === 0){
      var holyDestination = this.position + holyRange;
    } else {
      var holyDestination = this.position - holyRange;
    };
    playfield.platforms[holyDestination].platform_BlackHole.state = 0;
  };
};


class BlackHole {
  constructor(){
    this.state = 0;
  };

  destabilize(){
    var blackHoleProbability = Math.random() < 0.4;
    if(blackHoleProbability === true){
      this.state = 1;
      return (this.state);
    };
  };

  stabilize(){
    this.state = 0;
  };
};

class platform {
  constructor(){
    this.min_jump;
    this.max_jump;
    this.checkmin = false;
    this.checkmax = false;
    this.state = 0;
    this.platform_BlackHole = {};
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
          nowplatform.platform_BlackHole = new BlackHole;
          nowplatform.max_jump = this.randomRange(nowplatform.min_jump, 5);
          if (nowplatform.min_jump != nowplatform.max_jump) {
            this.platforms.push(nowplatform);       //console.log(nowplatform);
          } else {
            nowplatform = null;
            i--;
          }
      } else {
        nowplatform.state = 0;
        nowplatform.platform_BlackHole = new BlackHole;
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

  changeGameMode(){
    if(this.gameMode == 0){
      this.gameMode = 1;
    }else{
      this.gameMode = 0;
    };
  };

};
