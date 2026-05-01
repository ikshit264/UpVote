export const syncMonkFeedLogin = (user: any) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('monkfeed:login', { detail: user }));
  }
};

export const syncMonkFeedLogout = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('monkfeed:logout'));
  }
};
