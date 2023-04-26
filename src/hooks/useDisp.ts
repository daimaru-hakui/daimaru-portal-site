import { User } from "../../types";
import { useAuthStore } from "../../store/useAuthStore";
export const useDisp = () => {
  const users = useAuthStore((state) => state.users);

  const getUserName = (uid: string = "") => {
    const userName = users.find((user: User) => {
      if (user.uid === uid) return true;
    });
    return userName?.name;
  };

  return { getUserName };
};
