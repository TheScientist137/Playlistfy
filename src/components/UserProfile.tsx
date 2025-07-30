import type { SpotifyUser } from "../types/spotify";

interface UserProfileProps {
  profile: SpotifyUser | null,
  onLogout: () => void,
}

export default function UserProfile({ profile, onLogout }: UserProfileProps) {
   if (!profile) return <p>Loading...</p>

   return (
    <div>
      <p>Welcome back {profile.display_name}!</p>
      {profile.images?.[0]?.url ? (
        <img
          src={profile.images[0].url}
          alt="avatar" width={64}
          style={{ borderRadius: '50%' }} />
      ) : (
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: '#ccc',
            display: 'inline-block',
          }}
        />
      )}
      <button onClick={() => onLogout()}>Log out</button>
    </div>
  )
}
