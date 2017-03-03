import * as jwt from "jsonwebtoken";
import {AppUser} from "../model/app_user";

const jwtConfig = require("../config/jwt.json");

export class JwtService {
  public decode(token: string): AppUser {
    const decoded: AppUser = jwt.verify(token, jwtConfig.jwt.secret);

    return decoded;
  }
}
