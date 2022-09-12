import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "./atoms";
import Board from "./Components/Board";

const OuterWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    height: 100vh;
    justify-content: center;
    align-items: center;
`;

interface IForm {
    board: string;
}

const Form = styled.form``;

const Wrapper = styled.div`
    display: flex;
    margin: 0 auto;
    justify-content: center;
    align-items: center;
`;

const Boards = styled.div`
    display: flex;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    gap: 10px;
`;

function App() {
    const [toDos, setToDos] = useRecoilState(toDoState);
    const onDragEnd = (info: DropResult) => {
        const { destination, draggableId, source } = info;
        if (!destination) return;
        if (destination.droppableId === source.droppableId) {
            // same board movement.
            setToDos((allBoards) => {
                const boardCopy = [...allBoards[source.droppableId]];
                const obj = boardCopy.splice(source.index, 1)[0];
                boardCopy.splice(destination.index, 0, obj);
                return {
                    ...allBoards,
                    [source.droppableId]: boardCopy,
                };
            });
        }
        if (destination.droppableId !== source.droppableId) {
            // cross board movement
            setToDos((allBoards) => {
                const sourceBoard = [...allBoards[source.droppableId]];
                const destinationBoard = [
                    ...allBoards[destination.droppableId],
                ];
                const obj = sourceBoard.splice(source.index, 1)[0];
                destinationBoard.splice(destination.index, 0, obj);
                return {
                    ...allBoards,
                    [source.droppableId]: sourceBoard,
                    [destination.droppableId]: destinationBoard,
                };
            });
        }
    };

    const { register, setValue, handleSubmit } = useForm<IForm>();
    const onValid = ({ board }: IForm) => {
        setValue("board", "");
        if (Object.keys(toDos).includes(board)) return;
        setToDos((allBoards) => ({
            ...allBoards,
            [board]: [],
        }));
    };
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <OuterWrapper>
                <Form onSubmit={handleSubmit(onValid)}>
                    <input
                        {...register("board", { required: true })}
                        type="text"
                        placeholder="Enter new board name"
                    />
                </Form>
                <Wrapper>
                    <Boards>
                        {Object.keys(toDos).map((boardId) => {
                            return (
                                <Board
                                    boardId={boardId}
                                    key={boardId}
                                    toDos={toDos[boardId]}
                                />
                            );
                        })}
                    </Boards>
                </Wrapper>
            </OuterWrapper>
        </DragDropContext>
    );
}

export default App;
