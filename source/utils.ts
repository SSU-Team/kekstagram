// todo | how can I point out that I could have different quantity of arguments
const debounce = (f: any, delay: number): () => void => {
  let timeout: any = null;

  return (...args: Array<any>) => {
    timeout && clearTimeout(timeout);

    timeout = setTimeout(() => {
      f.call(null, args);
    }, delay);
  };
};

// todo | that function does not work
const throttle = (f: () => void, delay: number): () => void => {
  let timeout: any = null;
  let allow = true;

  return () => {
    if (allow) {
      f();

      allow = false;

      timeout = setTimeout(() => {
        allow = true;
      }, delay);
    };
  };
};

export { debounce, throttle, };
