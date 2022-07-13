import { Router } from "express";
import * as Express from "express";
import { Session } from "../session/session";
import { Environment } from "../../util/environment";

export class AuthRouter {
  public static create(environment: Environment): Router {
    const router = Express.Router();
    router.post(
      "/login",
      async (req: Express.Request, res: Express.Response) => {
        const auth = environment.getAuth();
        const verificationResult = await auth.verifyAuthenticationRequest(req);
        if (!verificationResult.verified()) {
          res.status(401).send("invalid authorization request");
          return;
        }

        const session = Session.of(req, res, environment);
        session.authenticate({
          userId: verificationResult.userId(),
        });
        res.status(200);
        res.send();
        console.log("login succeeded");
      }
    );

    return router;
  }
}
