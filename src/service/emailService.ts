import * as config from "config";

export class EmailService {
  constructor() {
  }

  public mailActivationLink(token: string, email: string) {
    console.log("Sending activation email to " + email + " with " + config.get("url") + "/login/activate/" + token);
  }

  public mailResetLink(token: string, email: string) {
    console.log("Sending reset email to " + email + " with " + config.get("url") + "/login/reset/" + token);
  }
}
