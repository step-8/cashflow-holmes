class Player {
  #username;
  #color;
  #profession;
  #role;
  constructor(username, role) {
    this.#username = username;
    this.#role = role;
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
      role: this.#role,
      color: this.#color,
      profession: this.#profession
    };
  }
}

module.exports = { Player };
