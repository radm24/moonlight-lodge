import supabase, { supabaseUrl } from "./supabase";

const AVATARS_PATH = `${supabaseUrl}/storage/v1/object/public/avatars/`;

export async function signup({ fullName: full_name, email, password }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name,
        avatar: "",
      },
    },
  });

  if (error.code === "signup_disabled")
    throw new Error("Creation of new users is disabled");

  if (error) throw new Error(error.message);

  return data;
}

export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  return data;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function getCurrentUser() {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return null;

  const { data, error } = await supabase.auth.getUser();
  if (error) throw new Error(error);

  return data?.user;
}

export async function updateCurrentUser({
  fullName,
  newAvatar,
  currentAvatar,
  password,
}) {
  // Disabling account updates on client
  throw new Error("Profile updates are not allowed");

  let updateData;
  // 1. Update password or full name with avatar
  if (password) updateData = { password };
  if (fullName) updateData = { data: { full_name: fullName } };

  // 2. Update avatar if it is needed (it's not updated if we update only password)
  let avatar;
  if (newAvatar || currentAvatar) {
    // 2.1 Delete old avatar if it exists
    if (currentAvatar) {
      const currentAvatarPath = currentAvatar.replace(AVATARS_PATH, "");

      const { error: avatarDeleteError } = await supabase.storage
        .from("avatars")
        .remove([currentAvatarPath]);

      if (avatarDeleteError) {
        console.log(avatarDeleteError);
        throw new Error("User account not be updated");
      }

      avatar = "";
    }

    // 2.2 Upload new avatar to the storage if it was added
    if (newAvatar) {
      const newAvatarName = `${Math.random()}-${newAvatar.name}`.replaceAll(
        "/",
        ""
      );
      const newAvatarPath = AVATARS_PATH + newAvatarName;

      const { error: avatarUploadError } = await supabase.storage
        .from("avatars")
        .upload(newAvatarName, newAvatar);

      if (avatarUploadError) {
        console.log(avatarUploadError);
        throw new Error("User account could not be updated");
      }

      avatar = newAvatarPath;
    }
  }

  if (avatar !== undefined) updateData.data.avatar = avatar;

  // 3. Update user data
  const { data: updatedUser, error } =
    await supabase.auth.updateUser(updateData);

  if (error) throw new Error(error.message);

  return updatedUser;
}
