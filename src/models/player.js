class Player {
  #username;
  #color;
  #profession;
  #role;
  #profile;
  #isRolledDice;
  constructor(username, role) {
    this.#username = username;
    this.#role = role;
    this.#color = null;
    this.#profession = null;
    this.#profile = null;
    this.#isRolledDice = false;
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

  get details() {
    return {
      username: this.#username,
      role: this.#role,
      color: this.#color,
      profession: this.#profession,
      profile: this.#profile,
      isRolledDice: this.#isRolledDice
    };
  }
}

module.exports = { Player };
