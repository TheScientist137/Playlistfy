import { Link } from "react-router";
import { useStore } from "../stores/useStore";

export default function Playlists() {
  const { userPlaylists, loadingPlaylists } = useStore();

  if (loadingPlaylists) return <p>Loading playlists...</p>;
  if (!userPlaylists?.items?.length) return <p>No playlists found</p>;

  return (
    <div>
      <h2>Your Playlists</h2>
      {userPlaylists && (
        <ul>
          {userPlaylists.items.map((item) => (
            <li key={item.id}>
              <Link to={`/playlist/${item.id}`}>
                <div className="flex items-center gap-2">
                  <img src={item.images?.[0]?.url} className="size-24" />
                  <p>{item.name}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
