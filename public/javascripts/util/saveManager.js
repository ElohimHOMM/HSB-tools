class SaveManager {

  constructor(pageKey) {
    this.pageKey = pageKey;
    this.isLoggedIn = Boolean(window.HSB_USER_ID);
  }

  async loadData() {
    if (this.isLoggedIn) {
      try {
        const res = await fetch(`/api/saves/${this.pageKey}`);
        if (res.ok) {
          const { data } = await res.json();
          this.data = data || {};
          this._saveLocalBackup(); // optional: also mirror to localStorage
          return this.data;
        }
      } catch (err) {
        console.warn('Falling back to localStorage (failed to fetch DB data):', err);
      }
    }

    // fallback: localStorage
    this.data = this._loadLocalBackup();
    return this.data;
  }

  async saveData(newData) {
    this.data = newData;

    if (this.isLoggedIn) {
      try {
        const res = await fetch(`/api/saves/${this.pageKey}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newData)
        });
        if (res.ok) {
          const { message } = await res.json();
          console.debug('Save successful:', message);
          this._saveLocalBackup(); // optional mirror
          return true;
        }
      } catch (err) {
        console.error('Error saving data to API:', err);
      }
    }

    // fallback to localStorage
    this._saveLocalBackup();
    return false;
  }

  _saveLocalBackup() {
    localStorage.setItem(`hsbtools.${this.pageKey}`, JSON.stringify(this.data));
  }

  _loadLocalBackup() {
    try {
      const raw = localStorage.getItem(`hsbtools.${this.pageKey}`);
      return raw ? JSON.parse(raw) : {};
    } catch (err) {
      console.error('Error reading localStorage backup:', err);
      return {};
    }
  }
}
