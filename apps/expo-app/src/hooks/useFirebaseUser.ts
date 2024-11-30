import { useEffect, useRef } from "react";

import { onAuthStateChanged } from "firebase/auth";
import { Unsubscribe } from "firebase/firestore";

import useFirebaseAuth from "../hooks/useFirebaseAuth";
import useFirestore from "../hooks/useFirestore";

import { auth } from "../firebase/config";
import { IAuthUser, loginUser } from "../redux/slices/auth";
import { useAppDispatch } from "../redux/store/hooks";

const useFirebaseUser = () => {
  const { subscribeToUserChange } = useFirestore();
  const { onLogout } = useFirebaseAuth();

  const dispatch = useAppDispatch();

  // to store the user subscriber so we can unsubscribe later
  const userSnapShotUnsubscribeRef = useRef<Unsubscribe>();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, authUser => {
      // debug('useFirebaseUser - onAuthStateChanged');
      if (authUser) {
        // provider-specific profile information is stored in the data.user.providerData array
        // use the data.user instead
        // const userData = authUser.providerData[0];
        const userData = authUser;
        const userInfo: IAuthUser = {
          uid: userData.uid,
          displayName: userData.displayName ?? "",
          email: userData.email ?? "",
        };
        dispatch(loginUser(userInfo));

        // subscribe to user change
        const id = userInfo.uid;
        userSnapShotUnsubscribeRef.current = subscribeToUserChange(
          id,
          (userUpdate: IAuthUser) => dispatch(loginUser(userUpdate))
        );
      } else {
        // debug('useFirebaseUser - onAuthStateChanged - no authenticated user!');
        unsubscribe(); // add this here to avoid 'Missing or insufficient permissions' when logging out
        onLogout();

        // when no network - login dummy user
        // const userInfo: User = {
        //   uid: '123456',
        //   displayName: 'Offline User',
        //   email: 'offline@user.com',
        // };
        // dispatch(loginUser(userInfo));
      }
    });
    // unsubscribe both listeners on unmount
    return () => {
      userSnapShotUnsubscribeRef.current?.();
      unsubscribe();
    };
  }, []);
};

export default useFirebaseUser;
