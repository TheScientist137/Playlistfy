import { useStore } from "../stores/useStore";

export default function Playlists() {
  const { playlists, loadingPlaylists } = useStore();

  if (loadingPlaylists) return <p>Loading playlists...</p>;
  if (!playlists?.items?.length) return <p>No playlists found</p>;

  return (
    <div>
      <h2>Your Playlists</h2>
      {playlists && (
        <ul>
          {playlists.items.map((item) => (
            <li key={item.id}>
              <img src={item.images[0]?.url} className="size-24" />
              <p>{item.name}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
