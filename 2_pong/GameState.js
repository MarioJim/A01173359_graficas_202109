export default class GameState {
  constructor() {
    this.points = {
      left: 0,
      right: 0,
    };
    this.state = {
      left: 'waiting',
      right: 'waiting',
    };

    this.scoreLeft = document.getElementById('scoreLeft');
    this.scoreRight = document.getElementById('scoreRight');
    this.state = document.getElementById('state');
  }

  leftPlaying() {
    this.state.left = 'playing';
    this.updateHeader();
  }

  rightPlaying() {
    this.state.right = 'playing';
    this.updateHeader();
  }

  arePlayersReady() {
    return this.state.left === 'playing' && this.state.right === 'playing';
  }

  leftScored() {
    this.points.left++;
    this.state = {
      left: 'waiting',
      right: 'waiting',
    };
    this.updateHeader();
  }

  rightScored() {
    this.points.right++;
    this.state = {
      left: 'waiting',
      right: 'waiting',
    };
    this.updateHeader();
  }

  updateHeader() {
    this.scoreLeft.textContent = this.points.left;
    this.scoreRight.textContent = this.points.right;

    if (this.state.left === 'waiting' && this.state.right === 'waiting') {
      this.state.textContent = 'Waiting for both players to move';
    } else if (this.state.left === 'waiting') {
      this.state.textContent = 'Waiting for left player to move';
    } else if (this.state.right === 'waiting') {
      this.state.textContent = 'Waiting for right player to move';
    } else {
      this.state.textContent = 'Play!';
    }
  }
}
