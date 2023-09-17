import React from "react";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import "../css/dnd.css"
import { Link, useLocation } from "react-router-dom";
import useAxiosPrivate from "../hook/useAxiosPrivate";
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import LinearProgressWithLabel from "./LinearProgressWithLabel";
import ReplyIcon from '@mui/icons-material/Reply';
import { useNavigate } from "react-router-dom";

export default function DnD() {
    const { cluster_ids, column_limit } = useLocation().state;
    const [items, setItems] = useState();
    let round = parseInt(localStorage.getItem("round")) || 0;
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const displayAlert = (message) => {
        setAlertMessage(message);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 4000);
    };

    const [data, error, loading, axiosFetch] = useAxiosPrivate();
    const getPatch = () => {
        // in case of refresh
        const oldItems = localStorage.getItem(`old_items_${round}`);
        axiosFetch({
            method: 'post',
            url: '/patches',
            requestConfig: {
                cluster_ids: cluster_ids,
                limit: column_limit
            }
        });
    }

    useEffect(() => {
        getPatch();
    }, []);

    useEffect(() => {
        if (!loading && !error && data?.data) {
            // console.log(data.data);
            setItems(data.data.items);
            localStorage.setItem(`old_items_${round}`, JSON.stringify(data.data.items));  
        }
    }, [data, loading, error]);

    // ...

    const navigate = useNavigate();

    const roundPlus = async () => {   
        let old_items = JSON.parse(localStorage.getItem(`old_items_${round}`));
        if (!old_items||JSON.stringify(old_items) === JSON.stringify(items)) {
            // displayAlert("You didn't move anything, please carefully check and move it.");
                displayAlert("操作がないようです。よく観察して、アイテムをドラッグ＆ドロップしてみてください。");
            return; // 阻止跳转
        }
        round++;
        localStorage.setItem("round", round);
        // try {
        //     const response = await axiosPrivate.post('/patches-update',
        //         JSON.stringify({ "old_items": old_items, "new_items": items }),
        //         {
        //             headers: { 'Content-Type': 'application/json' },
        //             withCredentials: true
        //         }
        //     );
        //     console.log(response.data);
        // } catch (err) {
        //     console.error(err);
        // }
        navigate('/display');
    }

    const handleDragAndDrop = (result) => {
        if (!result.destination) return;

        const sourceId = result.source.droppableId;
        const destinationId = result.destination.droppableId;

        const sourceItems = Array.from(items.find(item => item.id === sourceId).patches);
        const [removed] = sourceItems.splice(result.source.index, 1);
        if (sourceItems.length === 0) {
            // alert('Cannot move the last item from the list');
            displayAlert("１つのグループに少なくとも１枚の画像が含まれている必要があります。");
            return;
        }

        const destinationItems = sourceId === destinationId ? sourceItems : Array.from(items.find(item => item.id === destinationId).patches);
        destinationItems.splice(result.destination.index, 0, removed);

        setItems(items.map(item => {
            if (item.id === sourceId || item.id === destinationId) {
                return { ...item, patches: item.id === sourceId ? sourceItems : destinationItems };
            }
            return item;
        }));
    };

    return (
        <div>
            <div className="dnd-header" >
                <Typography variant="h6">選択されたグループ: &nbsp;
                    {cluster_ids.map((id, index) => (
                        <Chip key={index} label={<Typography variant="body1">{`グループ ${id}`}</Typography>} variant="outlined" />
                    ))}
                </Typography>

                <button onClick={roundPlus} >
                <ReplyIcon/>並べ替え完了</button>

            </div>
            <LinearProgressWithLabel round={round * 25 + 12.5} />
            {showAlert && <Alert severity="warning">{alertMessage}</Alert>}
            {items?.length ? (
                <div className="dnd-display">
                    <DragDropContext onDragEnd={handleDragAndDrop}>
                        <div className="list-grid">
                            {items.map((item,index) => (
                                <div className="each-grid"  key={item.cluster_id}>
                                    <div className="semantic-header">
                                        <h3>{item.cluster_id}</h3>
                                    </div>
                                <Droppable droppableId={item.id} key={item.id} index={item.id} >
                                    {(provided,snapshot) => (
                                      <div className={`drop-column ${snapshot.isDraggingOver ? 'dragging-over' : ''} ${snapshot.isDraggingFrom ? 'dragging-from' : ''}`} {...provided.droppableProps} ref={provided.innerRef}>
                                            <div className="patches-container">
                                                {item.patches.map((patch, index) => (
                                                    <Draggable draggableId={patch.img_id} index={index} key={patch.img_id}>
                                                        {(provided,snapshot) => (
                                                            <div className={`patch-solo ${snapshot.isDragging ? 'dragging' : ''}`} {...provided.dragHandleProps}  {...provided.draggableProps}
                                                            ref={provided.innerRef} >
                                                                <img src={patch.url} style={{ height: "100%", width: "100%", objectFit: "cover" }}></img>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        </div>
                                    )}
                                </Droppable>
                                </div>
                            ))}
                        </div>
                    </DragDropContext>
                </div>)
                :
                <img style={{ width: '7rem', display: 'block', margin: 'auto', marginTop: '70px', }} src={require('../loading.gif')}
                ></img>}
        </div>

    )


}