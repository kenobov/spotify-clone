import {
    HomeIcon,
    SearchIcon,
    LibraryIcon,
    PlusCircleIcon,
    HeartIcon
} from "@heroicons/react/outline";
import {signOut, useSession} from "next-auth/react";
import {useEffect, useState} from "react";
import useSpotify from "../hooks/useSpotify";
import {useRecoilState} from "recoil";
import {playlistIdState} from "../atoms/playlistAtom";

const Sidebar = () => {
    const spotifyApi = useSpotify();

    const { data: session, status } = useSession();
    const [playlists, setPlaylists] = useState([]);
    const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);

    useEffect(() => {
        if(spotifyApi.getAccessToken()) {
            spotifyApi.getUserPlaylists().then((data:any) => {
                setPlaylists(data.body.items)
            })
        }
    },[session, spotifyApi]);

    return (
        <div className="text-gray-500 p-5 text-xs
            border-r border-gray-900
            overflow-y-scroll h-screen scrollbar-hide
            lg:text-sm sm:max-w-[12rem] lg:max-w-[15rem]
            hidden md:inline-flex pb-36
        ">
            <div className="space-y-4">

                <button className="flex item-center space-x-2 hover:text-white">
                    <HomeIcon className="w-5 h-5" />
                    <p>Главная</p>
                </button>

                <button className="flex item-center space-x-2 hover:text-white">
                    <SearchIcon className="w-5 h-5" />
                    <p>Поиск</p>
                </button>

                <button className="flex item-center space-x-2 hover:text-white">
                    <LibraryIcon className="w-5 h-5" />
                    <p>Медиатека</p>
                </button>

                <hr className="border-t-[0.1px] border-gray-900"/>

                <button className="flex item-center space-x-2 hover:text-white">
                    <PlusCircleIcon className="w-5 h-5" />
                    <p>Создать плейлист</p>
                </button>

                <button className="flex item-center space-x-2 hover:text-white">
                    <HeartIcon className="w-5 h-5" />
                    <p>Любимые треки</p>
                </button>

                <hr className="border-t-[0.1px] border-gray-900"/>

                {
                    playlists.map((item:any) => (
                        <p key={item.id}
                           onClick={()=>setPlaylistId(item.id)}
                           className="cursor-pointer hover:text-white">
                            {item.name}
                        </p>
                    ))
                }


            </div>
        </div>
    )
    
}

export default Sidebar;