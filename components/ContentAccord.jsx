'use client';

import React, { useEffect, useState } from 'react'

export default function ContentAccord() {
    const [taskSets, setTaskSets] = useState([])

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const res = await fetch('/api/dashboard-list')
                if (res.ok) {
                    const data = await res.json()
                    setTaskSets(Array.isArray(data.getlistfixed) ? data.getlistfixed : []); // ตรวจสอบให้แน่ใจว่าเป็น array
                }
            } catch (error) {
                console.error('Error fetching dashboard stats:', error)
            }
        }

        fetchTask()
    }, [])
    return (
        <div className="accordion-group accordion-group-bordered">
            {taskSets.length === 0 ? (
                <p>No tasks available</p>
            ) : (
                taskSets.map((task) => (
                    <div key={task.id} className='accordion'>
                        <input type="checkbox" id={`toggle-${task.id}`} className="accordion-toggle" />
                        <label htmlFor={`toggle-${task.id}`} className="accordion-title">
                            {task.taskname} {/* ชื่องาน */}
                        </label>

                        <span className="accordion-icon">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                            >
                                <path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z"></path>
                            </svg>
                        </span>

                        <div className="accordion-content text-content2">
                            <div className="min-h-0">
                                <p><strong>รายละเอียดงาน:</strong> {task.machine_des || 'ไม่มีรายละเอียด'}</p> {/* รายละเอียดงาน */}
                                <p><strong>สถานะ:</strong> {task.task_status}</p> {/* สถานะงาน */}
                                <p><strong>วันที่เริ่มงาน:</strong> {new Date(task.createdAt).toLocaleString()}</p> {/* วันที่เริ่มงาน */}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}
