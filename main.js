var app = new Vue({
  el: '#app',
  data: {
    gameIsRunning: false,
    resultsShow: false,
    showError: false,
    playerName: '',
    playerHealth: 100,
    monsterHealth: 100,
    targets: ['head', 'hands', 'body', 'legs'],
    playerAttackTarget: '',
    playerDefenceTarget: '',
    turns: [],
    winner: ''
  },
  methods: {
    startGame: function() {
      var name = document.querySelector('#name').value
      if(name)  {
        this.gameIsRunning = true;
        this.playerName = name;
      } else {
        this.showError = true;
        var self = this;
        setTimeout(function(){
          self.showError = false;
        }, 3000);
      }
    },
    attack: function() {
      this.chooseTarget('input[name=attack-target]', 'playerAttackTarget');
      this.chooseTarget('input[name=defence-target]', 'playerDefenceTarget');
      if(this.playerAttackTarget == '') {
        this.turns.unshift({
          text: 'Выберете  куда атаковать' 
        });
      } else if(this.playerDefenceTarget == '') {
         this.turns.unshift({
          text: 'Выберете  блок' 
        });
      } else {
        this.compareTargets();
        this.setToZero('input[name=attack-target]');
        this.setToZero('input[name=defence-target]');
      }
      if(this.checkWin()) {
        return;
      }
    },
    compareTargets: function() {
      var monsterTargetAttack = this.calculate(0,3);
      var monsterTargetDefence= this.calculate(0,3);
      if(this.targets[monsterTargetAttack] == this.playerDefenceTarget) {
        this.turns.unshift({
          text: 'Монстр попал в блок',
          isPlayer: false
        });
      } else {
        var damage = this.calculate(15,20);
        this.turns.unshift({
          text: 'Монстр бьёт игрока в ' + this.targets[monsterTargetDefence] + ' на ' + damage,
          isPlayer: false
        });
        this.playerHealth -= damage;
      }
      
      if(this.targets[monsterTargetDefence] == this.playerAttackTarget) {
        this.turns.unshift({
          text: this.playerName + ' попал в блок',
          isPlayer: true
        });
      } else {
        var damage = this.calculate(15,20);
        this.turns.unshift({
          text: this.playerName + ' бьёт монстра в ' + this.playerAttackTarget + ' на ' + damage,
          isPlayer: true
        });
        this.monsterHealth -= damage;
      }
    },
    calculate: function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    chooseTarget: function(val, name) {
       var targets = document.querySelectorAll(val);
       var target = '';
       for(var i = 0; i < targets.length; i++) {
        if(targets[i].checked) {
          target = targets[i].dataset.target;
        } 
       }
       if(target) {
        this[name] = target;
      } else {
        this[name] = '';
      }
    },
    setToZero: function(val) {
      var targets = document.querySelectorAll(val);
      for(var i = 0; i < targets.length; i++) {
        targets[i].checked = false;
      }
    },
    checkWin: function() {
      if(this.playerHealth <= 0 || this.monsterHealth <= 0) {
        if(this.playerHealth <= 0) {
          this.winner = 'Monster';
          this.resultsShow = true;
        } else if(this.monsterHealth <= 0) {
          var name = this.playerName;
          this.winner = name;
          this.resultsShow = true;
        }
      }
      return false;
    },
    newGame: function() {
      this.resultsShow = false;
      this.playerHealth = 100;
      this.monsterHealth = 100;
      this.turns = [];
    }
  }
})
