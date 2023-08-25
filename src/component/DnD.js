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
import submit from "../submit.png";

export default function DnD() {
    const { cluster_ids, column_limit } = useLocation().state;
    const [items, setItems] = useState();
    let round = parseInt(localStorage.getItem("round")) || 0;


    const [data, error, loading, axiosFetch] = useAxiosPrivate();
    const getPatch = () => {
        // in case of refresh
        const oldItems = localStorage.getItem(`old_items_${round}`);
        if (oldItems) {
            setItems(JSON.parse(oldItems));
        } else {
            axiosFetch({
                method: 'post',
                url: '/patches',
                requestConfig: {
                    cluster_ids: cluster_ids,
                    limit: column_limit    
                }
            });
        }
    }
    
    useEffect(() => {
        getPatch();
    }, []);
    
    useEffect(() => {
        if (!loading && !error && data?.data ) {
            console.log(data.data);
            if (!localStorage.getItem(`old_items_${round}`)) {
                setItems(data.data.items);
                localStorage.setItem(`old_items_${round}`, JSON.stringify(data.data.items));
            }
        }
    }, [data, loading, error]);

    const roundPlus = async () => {
        round++;
        localStorage.setItem("round", round);
        let old_items = localStorage.getItem("old_items")
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
    }

    const handleDragAndDrop = (result) => {
        if (!result.destination) return;

        const sourceId = result.source.droppableId;
        const destinationId = result.destination.droppableId;

        const sourceItems = Array.from(items.find(item => item.id === sourceId).patches);
        const [removed] = sourceItems.splice(result.source.index, 1);
        if (sourceItems.length === 0) {
            alert('Cannot move the last item from the list');
            <Alert severity="warning">Cannot move the last item from the list'</Alert>
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
                <Typography variant="h6">selected cluster: &nbsp;
                    {cluster_ids.map((id, index) => (
                        <Chip key={index} label={<Typography variant="body1">{`Topic ${id}`}</Typography>} variant="outlined" />
                    ))}
                </Typography>
                <Link to='/display'>
                    <button onClick={roundPlus}>
                        <img src={submit} alt="Submit" style={{ marginRight: '10px', width: '1.4rem', verticalAlign: 'middle' }} />
                        submit this round</button>
                </Link>
            </div>
            <LinearProgressWithLabel round={round * 25 + 12.5} />
            {items?.length ? (
                <div className="dnd-display">
                    <DragDropContext onDragEnd={handleDragAndDrop}>
                        <div className="list-grid">
                            {items.map((item) => (
                                <Droppable droppableId={item.id}>
                                    {(provided) => (
                                        <div className="drop-column" {...provided.droppableProps} ref={provided.innerRef}>
                                            <div className="semantic-header">
                                                <h3>{item.cluster_id}</h3>
                                            </div>

                                            <div className="patches-container">
                                                {item.patches.map((patch, index) => (
                                                    <Draggable draggableId={patch.img_id} index={index} key={patch.img_id}>
                                                        {(provided) => (
                                                            <div className="patch-solo"  {...provided.dragHandleProps}  {...provided.draggableProps}
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