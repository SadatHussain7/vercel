// A function that randomly generates an id

const MAX_LEN = 10;

export function generate() {
  let id = "";
  const subset =
    "abcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < MAX_LEN; i++) {
    id += subset[Math.floor(Math.random() * subset.length)];
  }
  return id;
}
