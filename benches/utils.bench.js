import { bench, describe } from "vitest";

function fibonacci(n) {
  if (n < 2) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

function flattenObject(obj, prefix = "") {
  return Object.keys(obj).reduce((acc, key) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(acc, flattenObject(obj[key], fullKey));
    } else {
      acc[fullKey] = obj[key];
    }
    return acc;
  }, {});
}

function deepClone(obj) {
  if (obj === null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(deepClone);
  return Object.fromEntries(
    Object.entries(obj).map(([key, val]) => [key, deepClone(val)])
  );
}

describe("fibonacci", () => {
  bench("fibonacci(10)", () => {
    fibonacci(10);
  });

  bench("fibonacci(15)", () => {
    fibonacci(15);
  });
});

describe("flattenObject", () => {
  const nestedObject = {
    user: {
      name: "admin",
      settings: {
        theme: "dark",
        notifications: { email: true, sms: false },
      },
      roles: ["admin", "editor"],
    },
    app: { version: "0.1.0" },
  };

  bench("flattenObject - nested config", () => {
    flattenObject(nestedObject);
  });
});

describe("deepClone", () => {
  const complexObject = {
    users: [
      { id: 1, name: "Alice", permissions: ["read", "write"] },
      { id: 2, name: "Bob", permissions: ["read"] },
    ],
    metadata: { created: "2024-01-01", tags: ["admin", "react"] },
  };

  bench("deepClone - complex object", () => {
    deepClone(complexObject);
  });
});
