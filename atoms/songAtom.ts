import {atom} from "recoil";

export const currentTrackState = atom<number | null>({
    key: "currentTrackState",
    default: null
});

export const isPlayingState = atom<boolean>({
    key: "isPlayingState",
    default: false
});