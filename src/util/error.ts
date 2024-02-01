export const errorResponse = (error: any) => {
  return { error: error };
};

export const errorMsgRequired = (key: string) => {
  return `${key} is required`;
};

export const errorMsgUsername = (key: string) => {
  return `${key} must only contain Chinese characters, English letters, or spaces`;
};

export const errorMsgAccount = (key: string) => {
  return `${key} must contain English letters, digits`;
};

export const errorMsgEmail = (key: string) => {
  return `Valid ${key} format required`;
};

export const errorMsgConfirmPassword = (key: string) => {
  return `${key} must be the same as password`;
};

export const errorMsgLength = (
  key: string,
  { min, max }: { min?: number; max?: number }
) => {
  if (min && max) {
    return `${key} must contain from ${min}-${max} characters`;
  } else if (min) {
    return `${key} must contain more than ${min} characters`;
  } else if (max) {
    return `${key} must contain fewer than ${max} characters`;
  }
  return "";
};
