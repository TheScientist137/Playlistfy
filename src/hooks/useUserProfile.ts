import { getUserProfile } from "../services/spotifyApi";
import { useState, useEffect } from "react";
import type { UserProfileType } from "../types/spotify";

export default function useUserProfile() {
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setProfile(data);
      } catch (error) {
        setError("Failed to load profile");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { profile, loading, error };
}
