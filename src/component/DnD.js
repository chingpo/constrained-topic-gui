import React from "react";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import "../css/dnd.css"
import { Link, useLocation } from "react-router-dom";
import useAxiosPrivate from "../hook/useAxiosPrivate";
import Alert from '@mui/material/Alert';

import LinearProgressWithLabel from "./LinearProgressWithLabel";
import submit from "../submit.png";

export default function DnD() {
    const { cluster_ids, column_limit } = useLocation().state;
    const [items, setItems] = useState();
    let round = parseInt(localStorage.getItem("round")) || 0;


    const axiosPrivate = useAxiosPrivate();
    // use effect set items
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        const getPatch = async () => {
            try {
                const response = await axiosPrivate.post('/patches',
                    JSON.stringify({ "cluster_ids": cluster_ids, "limit": column_limit }),
                    {
                        headers: { 'Content-Type': 'application/json' },
                        withCredentials: true,
                        signal: controller.signal
                    }
                );
                console.log(response.data.data.items);
                isMounted && setItems(response.data.data.items);
                localStorage.setItem("old_items", response.data.data.items);
            } catch (err) {
                console.error(err);
            }
        }
        getPatch();
        return () => {
            isMounted = false;
            controller.abort();
        }


    }, [])

    const roundPlus = async () => {
        round++;
        localStorage.setItem("round", round);
        console.log(items);
        let old_items = localStorage.getItem("old_items")
        try {
            const response = await axiosPrivate.post('/patches-update',
                JSON.stringify({ "old_items": old_items, "new_items": items }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(response.data);
        } catch (err) {
            console.error(err);
        }
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
                <h4>selected cluster:{cluster_ids}</h4>
                <Link to='/display'>
                    <button onClick={roundPlus}>
                        <img src={submit} alt="Submit" style={{ marginRight: '10px' ,width:'1.4rem',verticalAlign: 'middle' }} />
                        submit this round</button>
                </Link>
            </div>
            <LinearProgressWithLabel round={round*25+12.5} />
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
                <img style={{ width: '7rem', display: 'block' ,margin:'auto',marginTop: '70px',}} src={require('../loading.gif')}
                ></img>}
        </div>

    )


}