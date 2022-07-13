import { initializeApp } from "firebase-admin/app";
import { credential } from "firebase-admin";
import { getAuth, Auth as AuthInFirebaseAdmin } from "firebase-admin/auth";
import { Request } from "express";
import { Environment } from "../util/environment";

export abstract class Auth {
  abstract verifyAuthenticationRequest(
    req: Request
  ): Promise<VerificationResult>;

  static prod(environment: Environment): Auth {
    return new FirebaseAuth(environment.firebaseServiceAccountKey());
  }

  static dev(): Auth {
    return new DummyAuth();
  }
}

export interface VerificationResult {
  verified(): boolean;
  userId(): string;
}

class FirebaseAuth extends Auth {
  private static _authAdmin: AuthInFirebaseAdmin;

  constructor(firebaseServiceAccountKey: string) {
    super();
    if (FirebaseAuth._authAdmin == null) {
      const app = initializeApp({
        credential: credential.cert(
          // environment.tsに含める
          JSON.parse(firebaseServiceAccountKey)
        ),
      });
      FirebaseAuth._authAdmin = getAuth(app);
    }
  }

  async verifyAuthenticationRequest(req: Request): Promise<VerificationResult> {
    const { authorization } = req.headers;
    if (!authorization?.startsWith("Bearer ")) {
      return {
        verified: () => false,
        userId: () => {
          throw new Error("Not Implemented");
        },
      };
    }

    const idToken = authorization.substring("Bearer ".length);
    const decodedToken = await FirebaseAuth._authAdmin.verifyIdToken(idToken);
    console.log(
      `id token...${idToken} and decoded token...${JSON.stringify(
        decodedToken
      )}`
    );
    return { verified: () => true, userId: () => decodedToken.uid };
  }
}

class DummyAuth extends Auth {
  verifyAuthenticationRequest(req: Request): Promise<VerificationResult> {
    const { authorization } = req.headers;
    if (!authorization?.startsWith("Dev ")) {
      return Promise.resolve({
        verified: () => false,
        userId: () => {
          throw new Error("Not Implemented");
        },
      });
    }

    const userId = authorization.substring("Dev ".length);
    console.log(`id...${userId}`);
    return Promise.resolve({ verified: () => true, userId: () => userId });
  }
}
