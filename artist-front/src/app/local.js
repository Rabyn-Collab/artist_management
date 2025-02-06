import Cookies from 'js-cookie';





export const setCookie = (user) => {
  Cookies.set('user', JSON.stringify(user));
}

export const getCookie = () => {
  const user = Cookies.get('user');
  return user === undefined ? null : JSON.parse(user);
}

export const removeCookie = () => {
  Cookies.remove('user');
}