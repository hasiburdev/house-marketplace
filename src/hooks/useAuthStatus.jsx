import { useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const useAuthStatus = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const isMounted = useRef(true);

  useEffect(() => {
    if (isMounted) {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setIsLoggedIn(true);
        }
        setIsCheckingStatus(false);
      });
      return () => {
        isMounted.current = false;
      };
    }
  }, [isMounted]);
  return { isLoggedIn, isCheckingStatus };
};

export default useAuthStatus;
