import { useSelector } from "../../Data";

export const useIdentity = (): any => useSelector(state => state.user.identity)