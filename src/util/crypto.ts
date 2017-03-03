import * as bcrypt from "bcrypt";

export class Crypto {
  public hashPassword(plaintext: string, callback: (err: Error, encrypted: string) => void) {
    bcrypt.hash(plaintext, 10, callback);
  }

  public validatePassword(plaintext: string, hashed: string, callback: (err: Error, same: boolean) => void) {
    bcrypt.compare(plaintext, hashed, callback);
  }
}
