'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const GetJob = () => {
    const { data: session, status } = useSession();
    const [machines, setMachines] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter()

    useEffect(()=>{
        fetchMachines();
    },[])

    const fetchMachines = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/machine');
            if (!response.ok) {
                throw new Error('Failed to fetch machines');
            }
            const data = await response.json();
            setMachines(data);
        } catch (error) {
            console.error('Error fetching machines:', error);
            setError('Failed to load machines. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectMachine = async (machine) => {
        if (status !== "authenticated") {
            setError('Please log in to select a machine.');
            return;
        }
        if (!machine) {
            setError('Invalid machine selected.');
            return;
        }

        try {
            const response = await fetch('/api/task', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    taskname: machine.name,
                    task_status: 'pending',
                    machineId: machine.id,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create task');
            }

            const result = await response.json();
            if (result.success) {
                setMachines(machines.filter(m => m.id !== machine.id))
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
                            <span>{machine.name}</span>
                            <button
                                onClick={() => handleSelectMachine(machine)}
                                className="btn btn-primary"
                                disabled={status !== "authenticated"}
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