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
