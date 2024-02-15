const alphabet = "abcdefghijklmnopqrstuvwxyz";
const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export const randomString = (len: number): string => {
  let result = "";
  const alphabetLength = alphabet.length;
  for (let i = 0; i < len; i++) {
    const randomIndex = Math.floor(Math.random() * alphabetLength);
    result += alphabet.charAt(randomIndex);
  }
  return result;
};

export const randomId = () => {
  return randomString(16);
};

export const randomAccount = (len: number): string => {
  const charactersLength = characters.length;
  let result = "";
  for (let i = 0; i < len; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(randomIndex);
  }
  return result;
};

export const randomEmail = () => {
  return `${randomString(8)}@email.com`;
};
