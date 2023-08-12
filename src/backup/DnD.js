import React from "react";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import "../App.css";
import DATA from "../data.js"
import { Link ,useLocation} from "react-router-dom";


export default function DnD() {
    
    // const roundPlus = async () => {
    //     var round = parseInt(localStorage.getItem("round"))||0;
    //     localStorage.setItem("round", ++round);
    // }
    
    // const {cluster_ids,column_limit} = useLocation().state;

    
    const handleDragAndDrop = () => {

    };

    return (

        <div class="">
            {/* <div className="header">
                <h4>selected cluster:{cluster_ids}</h4>
            </div>
            <div>
                <Link to='/display' >
                <button onClick={roundPlus}>submit this round</button>
                </Link>
            </div> */}
            <div class="card">
                <DragDropContext onDragEnd={handleDragAndDrop}>
                    {DATA.items.map((item) => (
                        <Droppable droppableId={item.id}>
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                    <div class="semantic-header">
                                        <h3>{item.cluster_id}</h3>
                                    </div>

                                    <div class="patches-container">
                                        {item.patches.map((patch, index) => (
                                            <Draggable draggableId={patch.img_id} index={index} key={patch.img_id}>
                                                {(provided) => (
                                                    <div
                                                        class="patch-container"
                                                        {...provided.dragHandleProps}
                                                        {...provided.draggableProps}
                                                        ref={provided.innerRef}
                                                    >
                                                        {patch.url}
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





                </DragDropContext>
            </div>
        </div>

    )

}