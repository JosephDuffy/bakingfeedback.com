const hostname = window && window.location && window.location.hostname;

const apiBaseURL = (() => {
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:13515';
  } else {
    return 'https://api.bakingfeedback.com';
  }
})();

export {
  apiBaseURL,
};
