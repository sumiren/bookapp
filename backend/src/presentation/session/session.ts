import express from "express";
import { Environment } from "../../util/environment";

export class Session {
  private req: express.Request;

  private res: express.Response;

  private environment: Environment;

  private constructor(
    req: express.Request,
    res: express.Response,
    environment: Environment
  ) {
    this.req = req;
    this.res = res;
    this.environment = environment;
  }

  static of(
    req: express.Request,
    res: express.Response,
    environment: Environment
  ) {
    return new Session(req, res, environment);
  }

  authenticate(user: User) {
    this.req.session.authenticated = true;
    this.req.session.user = user;
    this.res.cookie("loggedIn", true, {
      secure: this.environment.cookieSecure(),
      maxAge: 1000 * 60 * 30,
    });
  }

  destroy() {
    console.log(
      `before destroy: authenticated = ${this.isAuthenticated().toString()}`
    );
    this.req.session.destroy(() => {
      // do nothing when destroyed
    });
    this.res.clearCookie("connect.sid");
    this.res.clearCookie("loggedIn");
    console.log(
      `after destroy: authenticated = ${this.isAuthenticated().toString()}`
    );
  }

  isAuthenticated() {
    return this.req.session.authenticated === true;
  }

  get user(): User {
    if (this.req.session.user == undefined) {
      throw Error("not authenticated");
    }
    return this.req.session.user;
  }
}

interface User {
  userId: string;
}

declare module "express-session" {
  interface SessionData {
    authenticated: boolean;
    user: User;
  }
}
