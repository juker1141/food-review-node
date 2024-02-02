import bcrypt from "bcryptjs";

export const hashedPassword = (password: string): string => {
  const salt = bcrypt.genSaltSync(10);
  const hashedPw = bcrypt.hashSync(password, salt);
  return hashedPw;
};

export const checkPassword = (password: string, hashedPw: string) => {
  return bcrypt.compareSync(password, hashedPw);
};
