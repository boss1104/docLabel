import jwtDecode from 'jwt-decode';
// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str) {
  // return localStorage.getItem('antd-pro-authority') || ['admin', 'user'];
  const authorityString =
    typeof str === 'undefined' ? localStorage.getItem('antd-pro-authority') : str; // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    authority = jwtDecode(authorityString).user_claims.currentAuthority;
  } catch (e) {
    authority = authorityString;
  }

  return authority;
}
export function setAuthority(authority) {
  return localStorage.setItem('antd-pro-authority', authority);
}

export function getRefreshAuthority() {
  return localStorage.getItem('refresh-authority');
}

export function setRefreshAuthority(authority) {
  return localStorage.setItem('refresh-authority', JSON.stringify(authority));
}

export function getUserId() {
  const authorityString = localStorage.getItem('antd-pro-authority');
  if (authorityString != 'undefined') {
    return jwtDecode(authorityString).user_claims.id;
  }
  return undefined;
}
