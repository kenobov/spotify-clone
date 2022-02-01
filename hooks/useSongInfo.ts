import useSpotify from "./useSpotify";
import {useRecoilState} from "recoil";
import {currentTrackState} from "../atoms/songAtom";
import {useEffect, useState} from "react";
import TrackObjectFull = SpotifyApi.TrackObjectFull;

export default function useSongInfo():TrackObjectFull | null {

    const spotifyApi = useSpotify();
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackState);

    const [songInfo, setSongInfo] = useState<TrackObjectFull| null>(null);

    useEffect(() => {
        const fetchSongInfo = async () => {
            if(currentTrackId) {
                const trackInfo = await fetch(
                    `https://api.spotify.com/v1/tracks/${currentTrackId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${spotifyApi.getAccessToken()}`
                        }
                    }
                ).then(res => res.json());

                setSongInfo(trackInfo);
            }
        }

        fetchSongInfo();
    }, [currentTrackId, spotifyApi]);

    return songInfo;

}