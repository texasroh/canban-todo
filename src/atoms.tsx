import { atom, selector } from "recoil";
import { recoilPersist } from "recoil-persist";

export interface ITodo {
    id: number;
    text: string;
}

export interface IToDoState {
    [key: string]: ITodo[];
}

const { persistAtom } = recoilPersist({
    key: "canban-todo",
    storage: localStorage,
});

export const toDoState = atom<IToDoState>({
    key: "toDo",
    default: {
        "To Do": [],
        Doing: [],
        Done: [],
        "Do Later": [],
    },
    effects_UNSTABLE: [persistAtom],
});
