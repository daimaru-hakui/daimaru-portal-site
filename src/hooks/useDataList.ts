import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuthStore } from "../../store/useAuthStore";
import { Request, User } from "../../types";
import { useRecruitmentStore } from "../../store/useRecruitmentStore";

export const useDataList = () => {
  const setUsers = useAuthStore((state) => state.setUsers);
  const setRequests = useRecruitmentStore((state) => state.setRequests);

  const getUsers = async () => {
    const usersCollectionRef = collection(db, "authority");
    const q = query(usersCollectionRef, orderBy("rank", "asc"));
    onSnapshot(q, (querySnapshot) => {
      setUsers(
        querySnapshot.docs.map(
          (doc) =>
            ({
              ...doc.data(),
              id: doc.id,
            } as User)
        )
      );
    });
  };

  return { getUsers };
};
