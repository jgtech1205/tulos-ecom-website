import { currentUser } from "";
import { redirect } from "next/navigation";

export const requiredUser = async () => {
    const user = await currentUser();
    if (!user) {
        return redirect("/");
    }
};
