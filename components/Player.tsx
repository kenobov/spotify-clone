import useSpotify from "../hooks/useSpotify";
import {useSession} from "next-auth/react";
import {useRecoilState} from "recoil";
import {debounce} from 'lodash';
import {currentTrackState, isPlayingState} from "../atoms/songAtom";
import {useCallback, useEffect, useState} from "react";
import useSongInfo from "../hooks/useSongInfo";
import {
    HeartIcon, VolumeUpIcon as VolumeDownIcon
} from "@heroicons/react/outline";
import {
    PlayIcon, FastForwardIcon, PauseIcon, ReplyIcon, VolumeUpIcon, RewindIcon, SwitchHorizontalIcon
} from "@heroicons/react/solid";

export default function Player () {

    const spotifyApi = useSpotify();
    const {data: session, status} = useSession();

    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

    const [volume, setVolume] = useState(50);
    const songInfo = useSongInfo();

    const fetchCurrentSong = () => {
        if(!songInfo) {
            spotifyApi.getMyCurrentPlayingTrack()
                .then((data:any) => {
                    setCurrentTrackId(+data?.body?.item.id ?? 0);

                    spotifyApi.getMyCurrentPlaybackState()
                        .then((data: any) => setIsPlaying(data.body?.is_playing))
                })
        }
    }

    const handlePlayPause = () =>{
        spotifyApi.getMyCurrentPlaybackState()
            .then((data:any) => {
                if(data.body.is_playing) {
                    spotifyApi.pause();
                    setIsPlaying(false);
                }else {
                    spotifyApi.play();
                    setIsPlaying(true);
                }
            })
    }

    const debouncedAdjustVolume = useCallback(
        debounce((volume) => {
            spotifyApi.setVolume(volume).catch(() => {})
        }, 500), []
    );

    useEffect(() => {
        if(spotifyApi.getAccessToken() && !currentTrackId) {
            fetchCurrentSong();
            setVolume(50);
        }
    },[currentTrackId,spotifyApi,session]);

    useEffect(() => {
        if(volume > 0 && volume < 100){
            debouncedAdjustVolume(volume);
        }
    }, [volume]);

    return (
        <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3
                        text-xs md:text-base px-2 md:px-8">
            <div className="flex items-center space-x-4">
                <img className="hidden md:inline h-10 w-10"
                    src={songInfo?.album.images?.[0].url ?? 'https://miro.medium.com/max/2400/0*QbRrRLbPsyVLEoBa.png'} alt=""/>
                <div>
                    <h3>{songInfo?.name ?? '?????????? ???? ??????????????'}</h3>
                    <p>{songInfo?.artists?.[0].name ?? '???????????? ???? ????????????'}</p>
                </div>
            </div>

            <div className="flex items-center justify-evenly">
                <SwitchHorizontalIcon className="button" />
                <RewindIcon
                    // onClick={() => spotifyApi.skipToPrevious()}  --- Spotify API doesn't work
                    className="button" />

                {
                    isPlaying
                        ? <PauseIcon className="button w-10 h-10" onClick={handlePlayPause} />
                        : <PlayIcon className="button w-10 h-10" onClick={handlePlayPause} />
                }

                <FastForwardIcon
                    // onClick={() => spotifyApi.skipToNext()}  --- Spotify API doesn't work
                    className="button" />
                <ReplyIcon className="button" />
            </div>

            <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
                <VolumeDownIcon className="button" onClick={() => volume>0 && setVolume(volume-10)}/>
                <input className="w-14 md:w-20"
                       type="range"
                       min={0} max={100}
                       value={volume}
                       onChange={e => setVolume(Number(e.target.value))}
                />
                <VolumeUpIcon className="button" onClick={() => volume<100 && setVolume(volume+10)}/>
            </div>
        </div>
    )

}