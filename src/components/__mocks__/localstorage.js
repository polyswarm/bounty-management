class LocalStorage {
  constructor() {
    this.store = {};
  }

  setItem(key, value) {
    this.store[key] = value;
  }

  getItem(key) {
    return this.store[key];
  }
}
export default LocalStorage;
