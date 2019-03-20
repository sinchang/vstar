export const getSessionStorage = (key) => {
  if (!key) {
    return
  }
  return JSON.parse(sessionStorage.getItem(key) || '{}')
}

export const setSessionStorage = (key, value) => {
  if (!key && !value) {
    return
  }
  sessionStorage.setItem(key, JSON.stringify(value))
}
