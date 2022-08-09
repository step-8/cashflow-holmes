class Player {
  #username;
  #color;
  #profession;
  constructor(username) {
    this.#username = username;
    this.#color = null;
    this.#profession = null;
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
      color: this.#color,
      profession: this.#profession
    };
  }
}

module.exports = { Player };
