import React from "react";
import { useParams } from "react-router";

export default function AINotebook(){
    const params = useParams();
    console.log(params.id);
    return (
        <></>
    )
}