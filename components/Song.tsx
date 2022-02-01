import PlaylistTrackObject = SpotifyApi.PlaylistTrackObject;
import useSpotify from "../hooks/useSpotify";
import millisToMinutes from '../lib/time';
import {useRecoilState} from "recoil";
import {currentTrackState, isPlayingState} from "../atoms/songAtom";
import SpotifyWebApi from "spotify-web-api-node";

interface ISongProps {
    order: number,
    track: PlaylistTrackObject;
}

const Song = (props:ISongProps) => {

    const {order, track} = props;
    const spotifyApi = useSpotify();

    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

    const playSong = () => {
        setCurrentTrackId(+track.track.id);
        setIsPlaying(true);
        spotifyApi.play({
            uris: [track.track.uri]
        }).catch((e:SpotifyApi.ErrorObject) => {
            console.log(e.status);
            console.log(e.message);
        })
    }

    return (
        <div className="grid grid-cols-2 text-gray-500 py-4 px-5 hover:bg-gray-900 rounded-lg"
             onClick={playSong}>
            <div className="flex items-center space-x-4">
                <p>{order+1}</p>
                <img className="w-10 h10" src={track.track.album.images[0].url} alt=""/>
                <div>
                    <p className="w-36 lg:w-64 truncate text-white">{track.track.name}</p>
                    <p className="w-40">{track.track.artists[0].name}</p>
                </div>
            </div>
            <div className="flex items-center justify-between ml-auto md:ml-0">
                <p className="w-40 hidden md:inline">{track.track.album.name}</p>
                <p>{millisToMinutes(track.track.duration_ms)}</p>
            </div>
        </div>
    )

}

export default Song;