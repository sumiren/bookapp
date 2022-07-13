import { NodeApp } from "./node-app";

import serverlessExpress from "@vendia/serverless-express";

require("source-map-support/register");
exports.handler = serverlessExpress({ app: NodeApp.app() });
