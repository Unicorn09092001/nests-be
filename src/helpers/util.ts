import * as bcrypt from 'bcrypt';

const saltRounds = 10;

export const hashPasswordHelper = async (plainPassword: string) => {
    try {
        return await bcrypt.hash(plainPassword, saltRounds);
    } catch (error) {
        console.error("Error hashing password:", error);
    }
}

export const comparePassword = async (plainPassword: string, hashPassword: string) => {
    try {
        return await bcrypt.compare(plainPassword, hashPassword);
    } catch (error) {
        console.error("Error: ", error)
    }
}

export function getPagingMeta(total: number, page: number, pageSize: number) {
  const totalPage = Math.ceil(total / pageSize);

  return {
    total,
    page: Number(page),
    pageSize: Number(pageSize),
    totalPage,
  };
}