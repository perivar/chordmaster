import { useEffect, useRef, useState } from "react";

import * as AppleAuthentication from "expo-apple-authentication";
import {
  AppleAuthenticationCredentialState,
  Subscription,
} from "expo-apple-authentication";
import { CryptoDigestAlgorithm, digestStringAsync } from "expo-crypto";
import {
  AuthCredential,
  AuthError,
  createUserWithEmailAndPassword,
  deleteUser,
  EmailAuthProvider,
  OAuthProvider,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithCredential,
  signInWithEmailAndPassword,
  updateEmail,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

import { debug } from "../utils/debug";

import { auth, db } from "../firebase/config";
import deleteUserFiles from "../firebase/deleteUserFiles";
import FirebaseAuth from "../firebase/firebaseAuth";
import { IAuthUser, loginUser, logoutUser } from "../redux/slices/auth";
import { useAppDispatch } from "../redux/store/hooks";

export interface UserCredentials extends IAuthUser {
  createdAt?: Timestamp;
  updatedAt: Timestamp;
}

export type UseFirebaseAuth = ReturnType<typeof useFirebaseAuth>;

const firebaseAuth = new FirebaseAuth();

const useFirebaseAuth = () => {
  const dispatch = useAppDispatch();
  const [authSetup, setAuthSetup] = useState(false);
  const [authError, setAuthError] = useState<AuthError | undefined>(undefined);
  const [authSuccess, setAuthSuccess] = useState<string | undefined>(undefined);

  // apple credential methods
  const [appleCredentialState, setAppleCredentialState] = useState<
    string | undefined
  >(undefined);
  const [appleAuthTokenRevoked, setAppleAuthTokenRevoked] =
    useState<boolean>(false);
  const authCredentialListener = useRef<Subscription>();

  const createOrUpdateUser = async (userInfo: IAuthUser) => {
    try {
      const id = userInfo.uid;
      const now = serverTimestamp() as Timestamp;

      debug("Create or update firebase user: ", id);

      const userRef = doc(db, "users", id);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        debug(
          "User already exist, updating uid, updatedAt, avatar and apple credentials..."
        );

        await updateDoc(userRef, {
          updatedAt: now,
          // also include avatar and uid
          avatar: userInfo.avatar,
          uid: userInfo.uid,

          // and include apple credential variables
          appleAuthorizationCode: userInfo.appleAuthorizationCode,
          appleUser: userInfo.appleUser,
        });

        debug("Successfully updated user");
      } else {
        debug("User does not exist, creating ...");

        const userCredentials: UserCredentials = {
          ...userInfo,
          createdAt: now,
          updatedAt: now,
        };

        await setDoc(userRef, userCredentials);

        debug("Successfully added user");
      }
    } catch (err) {
      debug("createOrUpdateUser failed: ", err);
      setAuthError(err as AuthError);
    }
  };

  const firebaseLoginWithCredentials = async (
    credential: AuthCredential,
    data?: {
      email?: string;
      displayName?: string;
      authorizationCode?: string;
      user?: string;
    }
  ) => {
    debug("useFirebaseAuth - firebaseLoginWithCredentials", credential, data);

    const result = await signInWithCredential(auth, credential).catch(err => {
      debug("firebaseLoginWithCredentials:", err);
      setAuthError(err as AuthError);
    });

    if (result) {
      console.log("Signed in with credential. Updating profile details...");

      debug(
        "useFirebaseAuth - firebaseLoginWithCredentials - result.user:",
        result.user
      );

      debug(
        "useFirebaseAuth - firebaseLoginWithCredentials - result.user.providerData:",
        result.user.providerData
      );

      const { user } = result;

      // if passed data, update email and profile
      // data is only passed for apple authentication and email and password signup
      if (data && data.email && !user.email) {
        await updateEmail(user, data.email);
      }

      // if passed data, update email and profile
      // data is only passed for apple authentication and email and password signup
      if (data && data.displayName && !user.displayName) {
        await updateProfile(user, { displayName: data.displayName });
      }

      const userInfo: IAuthUser = {
        uid: user.uid,
        displayName:
          user.providerData[0]?.displayName ??
          user.displayName ??
          data?.displayName ??
          "",

        email: user.email ?? data?.email ?? "",
        avatar: user.photoURL ?? undefined,

        // apple credential variables
        appleAuthorizationCode: data?.authorizationCode,
        appleUser: data?.user,
      };

      dispatch(loginUser(userInfo));

      // make sure to create or update the user object as well
      await createOrUpdateUser(userInfo);
    }

    return await firebaseAuth.setSession(true);
  };

  // https://dev.to/haydenbleasel/implementing-google-and-apple-login-hooks-with-expo-43-and-firebase-v9-pjm
  const onAppleLogin = async () => {
    const state = Math.random().toString(36).substring(2, 15);
    const rawNonce = Math.random().toString(36).substring(2, 10);
    const requestedScopes = [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ];

    try {
      const nonce = await digestStringAsync(
        CryptoDigestAlgorithm.SHA256,
        rawNonce
      );

      const appleCredential = await AppleAuthentication.signInAsync({
        requestedScopes,
        state,
        nonce,
      });
      debug("useFirebaseAuth - onAppleLogin:", appleCredential);

      // AppleAuthenticationCredential fields:
      // [identityToken]
      // A JSON Web Token (JWT) that securely communicates information about the user to your app.
      // [authorizationCode]
      // A short-lived session token used by your app for proof of authorization
      // when interacting with the app's server counterpart.
      // Unlike user, this is ephemeral and will change each session.
      // [user]
      // An identifier associated with the authenticated user.
      // You can use this to check if the user is still authenticated later.
      // This is stable and can be shared across apps released under the same development team.
      // The same user will have a different identifier for apps released by other developers.
      const { identityToken, email, fullName, authorizationCode, user } =
        appleCredential;

      if (!identityToken) {
        throw new Error("No identity token provided.");
      }

      const provider = new OAuthProvider("apple.com");

      provider.addScope("email");
      provider.addScope("fullName");

      const credential = provider.credential({
        idToken: identityToken,
        rawNonce,
      });

      const displayName = fullName
        ? `${fullName.givenName} ${fullName.familyName}`
        : undefined;

      firebaseLoginWithCredentials(credential, {
        email: email ?? undefined,
        displayName: displayName,
        authorizationCode: authorizationCode ?? undefined,
        user,
      });
    } catch (err) {
      debug("onAppleLogin error:", err);
      setAuthError(err as AuthError);
    }
  };

  const onAppleGetCredentialState = async (user: IAuthUser) => {
    try {
      if (!user.appleUser) throw new Error("Missing apple user");

      AppleAuthentication.getCredentialStateAsync(user.appleUser).then(
        state => {
          switch (state) {
            case AppleAuthenticationCredentialState.AUTHORIZED:
              // Handle the authorised state
              debug("AppleAuthenticationCredentialState.AUTHORIZED");
              setAppleCredentialState("AUTHORIZED");
              break;
            case AppleAuthenticationCredentialState.REVOKED:
              // The user has signed out
              debug("AppleAuthenticationCredentialState.REVOKED");
              setAppleCredentialState("REVOKED");
              break;
            case AppleAuthenticationCredentialState.NOT_FOUND:
              // The user id was not found
              debug("AppleAuthenticationCredentialState.NOT_FOUND");
              setAppleCredentialState("NOT_FOUND");
              break;
            case AppleAuthenticationCredentialState.TRANSFERRED:
              // The authentication has been transferred
              debug("AppleAuthenticationCredentialState.TRANSFERRED");
              setAppleCredentialState("TRANSFERRED");
              break;
          }
        }
      );
    } catch (err) {
      debug("onGetCredentialStateAsync error:", err);
    }
  };

  const onEmailAndPasswordSignup = async (
    name: string,
    email: string,
    password: string
  ) => {
    try {
      // Notice Firebase automatically signs user in when their account is created
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Notice Firebase automatically signs user in when their account is created
      // so dispatch loginUser is not needed
      debug("useFirebaseAuth - onEmailAndPasswordSignup:", result);

      // User account created & signed in!
      // login using OAuthCredential, and create user if it doesn't exist
      const credential = EmailAuthProvider.credential(email, password);

      firebaseLoginWithCredentials(credential, { displayName: name });
    } catch (err) {
      debug("onEmailAndPasswordSignup error:", err);
      setAuthError(err as AuthError);
    }
  };

  const onEmailAndPasswordLogin = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);

      // User account created & signed in!
      // login using OAuthCredential, and create user if it doesn't exist
      const credential = EmailAuthProvider.credential(email, password);

      firebaseLoginWithCredentials(credential);
    } catch (err) {
      debug("onEmailAndPasswordLogin error:", err);
      setAuthError(err as AuthError);
    }
  };

  const onSendPasswordResetEmail = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      setAuthError(undefined);
      setAuthSuccess(
        "Please check your email to finish resetting your password"
      );
    } catch (err) {
      debug("onEmailAndPasswordReset error:", err);
      setAuthError(err as AuthError);
    }
  };

  const onUpdatePassword = async (password: string) => {
    try {
      const currentUser = firebaseAuth.getCurrentUser();
      if (currentUser) {
        await updatePassword(currentUser, password);
        setAuthError(undefined);
        setAuthSuccess("Password updated successfully");
      }
    } catch (err) {
      debug("onUpdatePassword error:", err);
      setAuthError(err as AuthError);
    }
  };

  const onSendEmailVerification = async () => {
    try {
      const currentUser = firebaseAuth.getCurrentUser();
      if (currentUser) {
        await sendEmailVerification(currentUser);
        setAuthError(undefined);
        setAuthSuccess("Please check your email for verification email");
      }
    } catch (err) {
      debug("onSendEmailVerification error:", err);
      setAuthError(err as AuthError);
    }
  };

  const onLogout = async () => {
    await firebaseAuth.logout();
    dispatch(logoutUser());
  };

  const onDeleteAccount = async () => {
    try {
      const currentUser = firebaseAuth.getCurrentUser();

      if (currentUser) {
        await deleteUserFiles("songs", currentUser, "user.uid");
        await deleteUserFiles("playlists", currentUser, "user.uid");
        await deleteUserFiles("users", currentUser, "uid");

        debug("deleting current user: ", currentUser.displayName);

        // this auto logouts the users since the subscribeToUserChange is triggered
        await deleteUser(currentUser);

        setAuthSuccess("Successfully deleted account!");

        await onLogout();
      }
    } catch (err) {
      debug("onDeleteAccount error:", err);
      setAuthError(err as AuthError);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, _ => {
      // debug('useFirebaseAuth - onAuthStateChanged');
      setAuthSetup(true);
    });

    return () => unsubscribe();
  }, []);

  // https://github.com/invertase/react-native-apple-authentication/issues/99
  useEffect(() => {
    // initialize revoke listener
    authCredentialListener.current = AppleAuthentication.addRevokeListener(
      async () => {
        // Handle the token being revoked
        console.warn(
          "If this function executes, Apple User Credentials have been Revoked"
        );
        setAppleAuthTokenRevoked(true);
        setAppleCredentialState("REVOKED");
      }
    );

    return () => {
      // remove revoke listener
      if (authCredentialListener && authCredentialListener.current) {
        if (authCredentialListener.current.remove !== undefined) {
          authCredentialListener.current.remove();
        }
      }
    };
  }, []);

  return {
    authSetup,
    authError,
    authSuccess,

    // special functions used by auth-providers
    setAuthError,
    firebaseLoginWithCredentials,

    // authentication functions

    // apple
    onAppleLogin,
    onAppleGetCredentialState,
    appleCredentialState,
    appleAuthTokenRevoked,

    // email
    onEmailAndPasswordSignup,
    onEmailAndPasswordLogin,
    onSendPasswordResetEmail,
    onSendEmailVerification,
    onUpdatePassword,

    onLogout,
    onDeleteAccount,
  };
};

export default useFirebaseAuth;
