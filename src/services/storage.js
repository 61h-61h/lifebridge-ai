const KEYS = {
  KEYS: 'lb_ai_keys',
  ACTIVE_PROVIDER: 'lb_active_provider',
  DIARIES: 'lb_diaries',
  TASKS: 'lb_tasks',
  MILESTONES: 'lb_milestones',
  MOMENTS: 'lb_moments'
};

export const storage = {
  getAIConfig() {
    return {
      keys: JSON.parse(localStorage.getItem(KEYS.KEYS) || '{}'),
      active: localStorage.getItem(KEYS.ACTIVE_PROVIDER) || 'zhipu'
    };
  },
  saveAIConfig(keys, active) {
    localStorage.setItem(KEYS.KEYS, JSON.stringify(keys));
    localStorage.setItem(KEYS.ACTIVE_PROVIDER, active);
  },

  get(key) { return JSON.parse(localStorage.getItem(key) || '[]'); },
  save(key, data) { localStorage.setItem(key, JSON.stringify(data)); },

  add(key, item) {
    const list = this.get(key);
    list.unshift({ id: Date.now(), createdAt: new Date().toLocaleString(), ...item });
    this.save(key, list);
  },
  delete(key, id) {
    const list = this.get(key).filter(item => item.id !== id);
    this.save(key, list);
  },
  update(key, id, updatedItem) {
    const list = this.get(key).map(item => item.id === id ? { ...item, ...updatedItem } : item);
    this.save(key, list);
  }
};
export { KEYS };
