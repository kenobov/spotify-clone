import {signOut, useSession} from "next-auth/react";
import {ChevronDownIcon} from "@heroicons/react/outline";
import {useEffect, useState} from "react";
import {shuffle} from "lodash";
import {useRecoilState, useRecoilValue} from "recoil";
import {playlistAtomState, playlistIdState} from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";
import PlaylistBaseObject = SpotifyApi.PlaylistBaseObject;
import Songs from "./Songs";

const Center = () => {
    const spotifyApi = useSpotify();

    const {data: session} = useSession();
    const [color, setColor] = useState("from-red-500");
    const playlistId = useRecoilValue(playlistIdState);
    const [playlist, setPlaylist] = useRecoilState(playlistAtomState);

    useEffect(() => {
        if(spotifyApi.getAccessToken()) {
           spotifyApi
               .getPlaylist(playlistId)
               .then((data:any) => {
                   setPlaylist(data.body);
               })
               .catch((error) => console.log(error));
        }
    }, [spotifyApi, playlistId]);

    useEffect(() => {
        const randColor = shuffle(colors).pop();
        if(typeof randColor === 'string') setColor(randColor);
    },[playlistId]);

    // @ts-ignore
    const playlistImage = playlist?.images?.[0]?.url;
    // @ts-ignore
    const playlistName = playlist?.name;

    return (
        <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide relative">

            <header className="absolute top-5 right-8">
                <div className="flex items-center bg-black space-x-2 opacity-90
                    hover:opacity-80 cursor-pointer rounded-full p-1 pr-2 text-white"
                     onClick={() => signOut()}
                >
                    <img src={(session && session.user?.image) ?? 'https://sun9-56.userapi.com/impf/c840231/v840231419/492d2/z53nPGRoaNw.jpg?size=125x130&quality=96&sign=c5310a1f8b49116e667381301e6b01b0&c_uniq_tag=t95B9Im5OiqCr-oBlBXJZPM8bTFiBDhJqSiebVMnDgo&type=album'}
                         className="rounded-full w-10 h-10"
                         alt=""/>
                    <h2>
                        {(session && session.user?.name) ?? 'Без имени'}
                    </h2>
                    <ChevronDownIcon className="h-5 w-5" />
                </div>
            </header>

            <section className={`flex items-end space-x-7 bg-gradient-to-b to-black 
                ${color} h-80 text-white p-8`}>
                <img src={playlistImage}
                     className="h-44 w-44 shadow-2xl"
                     alt=""/>
                     <div>
                         <p>
                             PLAYLIST
                         </p>
                         <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">
                             {playlistName}
                         </h1>
                     </div>
            </section>

            <div>
                <Songs />
            </div>

        </div>
    )

}

export default Center;

const colors: string[] = [
    "from-indigo-500",
    "from-blue-500",
    "from-green-500",
    "from-red-500",
    "from-yellow-500",
    "from-pink-500",
    "from-purple-500"
];