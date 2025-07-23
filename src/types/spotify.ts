export interface UserImage {
  height: number,
  url: string,
  width: number
}

export interface SpotifyUser {
  id: string,
  display_name: string,
  email: string,
  images: UserImage[]
}