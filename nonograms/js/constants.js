export const board = {
  val: [5, "rune"],
  get game() {
    return this.val;
  },
  set game(value) {
    this.val = value;
  },
};

export const isSound = {
  _sound: true,
  get sound() {
    return this._sound;
  },
  set sound(value) {
    this._sound = value;
  },
};
export const difficulty = {
  5: "easy(5x5)",
  10: "medium(10x10)",
  15: "hard(15x15)",
};

export const maxTime = 99 * 60;

export const timer = {
  val: 0,
  get value() {
    return this.val;
  },
  set value(value) {
    this.val = value;
  },
};

export const interval = {
  id: "",
  get intervalId() {
    return this.id;
  },
  set intervalId(value) {
    this.id = value;
  },
};

export const dimensions = {
  5: { cell_size: "8", board_size: "40", top_height: "70", side_width: "52" },
  10: {
    cell_size: "5.7",
    board_size: "57",
    top_height: "76",
    side_width: "56",
  },
  15: { cell_size: "4", board_size: "60", top_height: "76", side_width: "56" },
};

export const defaultGame = [5, "rune"];

export const sounds = {
  checked: "./assets/aud/sound_check.mp3",
  empty: "./assets/aud/sound_empty.mp3",
  marked: "./assets/aud/sound_mark.mp3",
  win: "./assets/aud/sound_win.mp3",
};
