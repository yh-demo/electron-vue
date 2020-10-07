import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  console.log('------setToken---------')
  return console.error(Cookies.set(TokenKey, token))
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
