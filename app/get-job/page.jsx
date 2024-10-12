'use client';

// import React, { useState, useEffect } from 'react';

// const GetJob = () => {
//     const [tasks, setTasks] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         fetchTasks();
//     }, []);

//     const fetchTasks = async () => {
//         try {
//             setIsLoading(true);
//             const response = await fetch('/api/machine');
//             if (!response.ok) {
//                 throw new Error('Failed to fetch machine');
//             }
//             const data = await response.json();
//             // กรองข้อมูลให้แสดงเฉพาะงานที่มีสถานะ pending
//             const pendingTasks = data.filter(task => task.task_status === 'pending');
//             setTasks(pendingTasks);
//         } catch (error) {
//             console.error('Error fetching tasks:', error);
//             setError('Failed to load tasks. Please try again later.');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleSelectMachine = async (task) => {
//         try {
//             const response = await fetch('/api/task/fixing', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     machineId: task.machineId
//                 }),
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to update task status');
//             }

//             const result = await response.json();
//             if (result.success) {
//                 setTasks(tasks.filter(t => t.id !== task.id));
//                 alert('Task status updated to fixing successfully!');
//             } else {
//                 throw new Error(result.message || 'Failed to update task status');
//             }
//         } catch (error) {
//             console.error('Error updating task status:', error);
//             setError('Failed to update task. Please try again.');
//         }
//     };

//     if (isLoading) {
//         return <div className="text-center mt-10">Loading tasks...</div>;
//     }

//     return (
//         <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-lg shadow">
//             <h2 className="text-2xl font-bold mb-4">Select a Machine to Get a Job</h2>
//             {error && (
//                 <div className="alert alert-error mb-4">
//                     <p>{error}</p>
//                 </div>
//             )}
//             {tasks.length === 0 ? (
//                 <p>No tasks available</p>
//             ) : (
//                 <ul className="space-y-4">
//                     {tasks.map((task) => (
//                         <li key={task.id} className="flex justify-between items-center p-4 border rounded hover:bg-gray-100">
//                             <span>{task.machine?.name || 'Unknown Machine'}</span>
//                             <button
//                                 onClick={() => handleSelectMachine(task)}
//                                 className="btn btn-primary"
//                             >
//                                 Select
//                             </button>
//                         </li>
//                     ))}
//                 </ul>
//             )}
//         </div>
//     );
// };

// // export default GetJob;

import React, { useState, useEffect } from 'react';

const GetJob = () => {
    const [machines, setMachines] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMachines();
    }, []);

    const fetchMachines = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/machine');
            if (!response.ok) {
                throw new Error('Failed to fetch machines');
            }
            const data = await response.json();
            // กรองข้อมูลให้แสดงเฉพาะเครื่องที่มีสถานะ pending
            const pendingMachines = data.filter(machine => 
                machine.tasks.length === 0 || 
                machine.tasks.every(task => task.task_status === 'pending')
                // machine.machine_status === 'pending'
            );
            
            
            setMachines(pendingMachines);


        } catch (error) {
            console.error('Error fetching machines:', error);
            setError('Failed to load machines. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };
    

    const handleSelectMachine = async (machine) => {
        try {
            const response = await fetch('/api/task', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    taskname : machine.name,
                    machineId: machine.id,
                    task_status: 'fixing'
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create task');
            }

            const result = await response.json();
            if (result.success) {
                // ลบเครื่องที่ถูกเลือกออกจากรายการ
                setMachines(machines.filter(m => m.id !== machine.id));
                alert('Task created successfully!');
            } else {
                throw new Error(result.message || 'Failed to create task');
            }
        } catch (error) {
            console.error('Error creating task:', error);
            setError('Failed to create task. Please try again.');
        }
    };

    if (isLoading) {
        return <div className="text-center mt-10">Loading machines...</div>;
    }

    return (
        <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Select a Machine to Get a Job</h2>
            {error && (
                <div className="alert alert-error mb-4">
                    <p>{error}</p>
                </div>
            )}
            {machines.length === 0 ? (
                <p>No machines available</p>
            ) : (
                <ul className="space-y-4">
                    {machines.map((machine) => (
                        <li key={machine.id} className="flex justify-between items-center p-4 border rounded hover:bg-gray-100">
                            <span>{machine.name || 'Unknown Machine'}</span>
                            <button
                                onClick={() => handleSelectMachine(machine)}
                                className="btn btn-primary"
                            >
                                Select
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default GetJob;
