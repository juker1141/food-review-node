import { randomString } from "../util/random";
import { hashedPassword, checkPassword } from "../util/password";

test("Test Password Hash & Compare", () => {
  const password1 = randomString(8);
  const hashedPw1 = hashedPassword(password1);

  expect(hashedPw1).not.toBe("");
  expect(hashedPw1).not.toEqual(password1);

  const isEqual = checkPassword(password1, hashedPw1);
  expect(isEqual).toBeTruthy();

  const password2 = randomString(8);
  const isNotEqual = checkPassword(password2, hashedPw1);
  expect(isNotEqual).toBeFalsy();
});
