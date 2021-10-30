function identity(input: string) {
  return input;
}

export default function createResource(callback: (id: string) => Promise<{id: string; name: string}>, hash = identity) {
  const cache = new Map();

  function load(input: string) {
    const key = hash(input);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const promise = callback(input);

    cache.set(key, {
      status: "pending",
      value: promise,
    });

    promise.then(
      (data) => {
        cache.set(key, {
          status: "resolved",
          value: data,
        });
      },
      (error: any) => {
        cache.set(key, {
          status: "rejected",
          value: error,
        });
      });

    return {
      status: "pending",
      value: promise,
    };
  }

  return {
    read(input: string) {
      const { status, value } = load(input);

      switch (status) {
        case "pending": throw value;
        case "rejected": throw value;
        case "resolved": return value;
        default: throw new Error(`invalid status '${status}'`);
      }
    },

    preload(input: string) {
      load(input);
    },

    cancel(input: string) {
      const key = hash(input);
      cache.delete(key);
    },
  };
}
