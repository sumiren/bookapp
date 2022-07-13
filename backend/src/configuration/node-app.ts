import exp, { Express } from "express";
import cors from "cors";
import { Environment } from "../util/environment";
import { BookRouter } from "../presentation/router/book-router";
import { DynamoBookStore } from "../infra/dynamo-book-store";
import { Session } from "../presentation/session/session";
import { AuthRouter } from "../presentation/router/auth-router";
import { StringMatcher } from "../util/string-matcher";

import session from "express-session";

import connect_dynamodb from "connect-dynamodb";

const DynamoDBStore = connect_dynamodb(session);

export class NodeApp {
  static app(): any {
    console.log("環境変数", process.env);
    const app = exp();
    const environment = Environment.fromEnvironmentVariable();

    this.useCommonWebMiddlewares(app);
    this.useCors(app, environment);
    this.useSession(app, environment);
    this.useAuthFilter(app, environment);
    this.useRouters(app, environment);

    return app;
  }

  private static useCommonWebMiddlewares(app: Express) {
    app.use(exp.json());
  }

  private static useCors(app: Express, environment: Environment) {
    const corsOptions = {
      origin: (origin: any, callback: any) => {
        const originString: string | undefined = origin;
        if (
          originString == undefined ||
          [process.env.ASSET_DOMAIN_NAME_WITH_SCHEME].indexOf(origin) != -1
        ) {
          // @ts-ignore
          console.log(
            `CORS NO PROBLEM: ${originString ? originString : "undefined"}`
          );
          callback(null, true);
        } else {
          if (!environment.isProd()) {
            console.warn(
              `WARN: request from origin which is not allowed by CORS setting. Allowed because of Dev env. ORIGIN: ${originString}`
            );
            callback(null, true);
            return;
          }
          callback(new Error(`Not allowed by CORS. ORIGIN:${originString}`));
        }
      },
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      preflightContinue: false,
      credentials: true,
      optionsSuccessStatus: 204,
    };
    app.use(cors(corsOptions));
    app.use((req, res, next) => {
      if (environment.isProd()) {
        res.setHeader(
          "Access-Control-Allow-Origin",
          process.env.ASSET_DOMAIN_NAME_WITH_SCHEME!
        );
        res.setHeader("Access-Control-Allow-Methods", "*");
      }
      next();
    });
  }

  private static useAuthFilter(app: Express, environment: Environment) {
    app.use((req, res, next) => {
      const session = Session.of(req, res, environment);

      const publicEndpoints = [
        StringMatcher.same("/auth/login"),
        StringMatcher.same("/auth/am-i-authenticated"),
      ];
      if (
        session.isAuthenticated() ||
        publicEndpoints.some((matcher) => matcher.matches(req.url))
      ) {
        next();
        return;
      }

      res.status(401);
      res.send("unauthorized");
    });
  }

  private static useSession(app: Express, environment: Environment) {
    app.use(
      session({
        store: new DynamoDBStore({
          table: environment.sessionTableName(),
          hashKey: "id",
          prefix: "sess",
          client: environment.createDynamoDb(),
        }),
        secret: environment.sessionSecret(),
        resave: false,
        saveUninitialized: false,
        cookie: {
          httpOnly: true,
          secure: environment.cookieSecure(),
          maxAge: 1000 * 60 * 30,
        },
      })
    );
  }

  private static useRouters(app: Express, environment: Environment) {
    const dynamoStore = DynamoBookStore.create(environment);

    app.use("/books", BookRouter.create(dynamoStore, environment));
    app.use("/auth", AuthRouter.create(environment));
  }
}
