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
