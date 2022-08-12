const { Profile } = require('./profile.js');
class Player {
  #username;
  #color;
  #profession;
  #role;
  #profile;
  #isRolledDice;
  #currentPosition;
  constructor(username, role) {
    this.#username = username;
    this.#role = role;
    this.#color = null;
    this.#profession = null;
    this.#profile = null;
    this.#isRolledDice = false;
    this.#currentPosition = 0;
  }

  set rolledDice(status) {
    this.#isRolledDice = status;
  }

  assignColor(color) {
    this.#color = color;
  }

  assignProfession(profession) {
    this.#profession = profession;
  }

  createProfile() {
    this.#profile = new Profile(this.#profession);
  }

  move(steps) {
    this.#currentPosition = (this.#currentPosition + steps) % 25;
    if (this.#currentPosition === 0) {
      this.#currentPosition = 1;
    }
  }

  get details() {
    return {
      username: this.#username,
      role: this.#role,
      color: this.#color,
      profession: this.#profession,
      profile: this.#profile.details,
      isRolledDice: this.#isRolledDice,
      currentPosition: this.#currentPosition
    };
  }
}

module.exports = { Player };
