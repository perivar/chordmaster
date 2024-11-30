import { onAuthStateChanged, signOut, User } from "firebase/auth";

import { auth } from "./config";
import dayjs from "./dayjs";
import { getItem, removeItem, setItem, storageKey } from "./storage";

const initFirebaseAuth = (): Promise<User | null> => {
  return new Promise(resolve => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      // user Object resolve
      resolve(user);

      // unregister
      unsubscribe();
    });
  });
};

class FirebaseAuth {
  getCurrentUser = () => auth.currentUser;

  reload = () => this.getCurrentUser()?.reload();

  // set session and store user uid and token information to async storage
  setSession = async (refresh = false) => {
    const user = await initFirebaseAuth();
    if (!user) {
      return null;
    }

    await setItem(storageKey.AUTH_UID_KEY, user.uid);

    const result = await user.getIdTokenResult(refresh);

    await setItem(storageKey.AUTH_ID_TOKEN_KEY, result.token);
    await setItem(
      storageKey.AUTH_ID_TOKEN_EXPIRATION_KEY,
      String(result.claims.exp)
    );

    return result.token;
  };

  // get the user token information from async storage
  getIdToken = async () => {
    const idToken = await getItem(storageKey.AUTH_ID_TOKEN_KEY);
    if (!idToken) {
      return null;
    }

    const expiration = await getItem(storageKey.AUTH_ID_TOKEN_EXPIRATION_KEY);

    if (Number(expiration) > dayjs().unix()) {
      return idToken;
    }

    return this.setSession(true);
  };

  // logout and remove user and token information from async storage
  logout = async () => {
    await signOut(auth);

    await removeItem(storageKey.AUTH_UID_KEY);
    await removeItem(storageKey.AUTH_ID_TOKEN_KEY);
    await removeItem(storageKey.AUTH_ID_TOKEN_EXPIRATION_KEY);
  };
}

export default FirebaseAuth;
