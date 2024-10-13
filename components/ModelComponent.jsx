import React from 'react'

const ModelComponent = (props) => {
    return (
        <div>
            <label className={props.style} htmlFor={props.modalId}>{props.titleBtn}</label>

            <input className="modal-state" id={props.modalId} type="checkbox" />
            <div className="modal " >
                <label className="modal-overlay"></label>
                <div className="modal-content flex flex-col gap-5 w-full items-center justify-around">
                    <label htmlFor={props.modalId} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</label>
                    <h2 className="text-xl">{props.modelTitle} || {props.tel}</h2>

                    <div className="flex gap-3">
                        {props.children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModelComponent