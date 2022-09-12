import { Droppable } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { ITodo, IToDoState, toDoState } from "../atoms";
import DragabbleCard from "./DragabbleCard";

const Wrapper = styled.div`
    width: 300px;
    padding-top: 10px;
    border-radius: 5px;
    background-color: ${(props) => props.theme.boardColor};
    min-height: 300px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
`;

const Header = styled.div`
    display: flex;
    padding: 0 20px;
    align-items: baseline;
    justify-content: space-between;
`;

const Title = styled.div`
    font-weight: 600;
    margin-bottom: 10px;
    font-size: 10px;
`;

const Button = styled.button`
    border: none;
    background: transparent;
    cursor: pointer;
`;

interface IAreaProps {
    isDraggingOver: boolean;
    isDraggingFromThis: boolean;
}

const Area = styled.div<IAreaProps>`
    background-color: ${(props) =>
        props.isDraggingOver
            ? "#dfe6e9"
            : props.isDraggingFromThis
            ? "#b2bec3"
            : "transparent"};
    flex-grow: 1;
    transition: background-color 0.3s ease-in-out;
    padding: 20px;
`;

const Form = styled.form`
    width: 100%;
    input {
        width: 100%;
    }
`;

interface IBoardProps {
    toDos: ITodo[];
    boardId: string;
}

interface IForm {
    toDo: string;
}

function Board({ toDos, boardId }: IBoardProps) {
    const setToDos = useSetRecoilState(toDoState);
    const { register, setValue, handleSubmit } = useForm<IForm>();
    const onValid = ({ toDo }: IForm) => {
        const newToDo = {
            id: Date.now(),
            text: toDo,
        };
        setToDos((allBoards) => {
            return {
                ...allBoards,
                [boardId]: [...allBoards[boardId], newToDo],
            };
        });
        setValue("toDo", "");
    };

    const deleteBoard = (boardId: IBoardProps["boardId"]) => {
        setToDos((allBoards) => {
            const tmp: IToDoState = {};
            for (let key in allBoards) {
                if (key === boardId) {
                    continue;
                }
                tmp[key] = allBoards[key];
            }
            return tmp;
        });
    };

    return (
        <Wrapper>
            <Header>
                <div></div>
                <Title>{boardId}</Title>
                <Button onClick={() => deleteBoard(boardId)}>❌</Button>
            </Header>
            <Form onSubmit={handleSubmit(onValid)}>
                <input
                    {...register("toDo", { required: true })}
                    type="text"
                    placeholder={`Add task on ${boardId}`}
                />
            </Form>
            <Droppable droppableId={boardId}>
                {(magic, snapshot) => {
                    return (
                        <Area
                            isDraggingOver={snapshot.isDraggingOver}
                            isDraggingFromThis={Boolean(
                                snapshot.draggingFromThisWith
                            )}
                            ref={magic.innerRef}
                            {...magic.droppableProps}
                        >
                            {toDos.map((toDo, index) => (
                                <DragabbleCard
                                    key={toDo.id}
                                    index={index}
                                    toDoId={toDo.id}
                                    toDoText={toDo.text}
                                />
                            ))}
                            {magic.placeholder}
                        </Area>
                    );
                }}
            </Droppable>
        </Wrapper>
    );
}

export default Board;
