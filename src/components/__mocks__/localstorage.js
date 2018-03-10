class LocalStorage {
  constructor() {
    this.store = {};
  }

  setItem(key, value) {
    this.store[key] = value;
  }

  removeItem(key) {
    delete this.store[key];
  }

  getItem(key) {
    return this.store[key] || null;
  }

  clear() {
    this.store = {};
  }
}
export default LocalStorage;
