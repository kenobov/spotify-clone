import {useRecoilState, useRecoilValue} from "recoil";
import {playlistAtomState} from "../atoms/playlistAtom";
import PlaylistObjectFull = SpotifyApi.PlaylistObjectFull;
import PlaylistTrackObject = SpotifyApi.PlaylistTrackObject;
import Song from "./Song";

const Songs = () => {
    // @ts-ignore
    const playlist:PlaylistObjectFull = useRecoilValue<PlaylistObjectFull>(playlistAtomState);

    return (
        <div className="px-8 flex flex-col space-y-1 pb-28 text-white">
            {
                playlist?.tracks.items.map((track:PlaylistTrackObject, i:number) => (
                    <Song key={track.track.id} order={i} track={track}/>
                ))
            }
        </div>
    )
}

export default Songs;