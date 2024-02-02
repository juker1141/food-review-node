const alphabet = "abcdefghijklmnopqrstuvwxyz";

export const randomString = (len: number): string => {
  let result = "";
  const alphabetLength = alphabet.length;
  for (let i = 0; i < len; i++) {
    const randomIndex = Math.floor(Math.random() * alphabetLength);
    result += alphabet.charAt(randomIndex);
  }
  return result;
};
