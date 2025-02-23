import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "./Firebase";

const userExists = async (email: string) => {
  const usersCollection = collection(firestore, "users");
  const q = query(usersCollection, where("email", "==", email));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

const addUser = async (email: string, name: string) => {
  if (await userExists(email)) {
    return "User already exists";
  } else {
    try {
      await addDoc(collection(firestore, "users"), {
        email: email,
        name: name,
      });
      return "User added successfully";
    } catch (e) {
      return e as string;
    }
  }
};
export { userExists, addUser };
