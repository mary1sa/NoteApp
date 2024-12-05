import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Select from 'react-select';
import axiosInstance from './axiosInstance'; 
import "./Login/Login.scss"
const CreateNote = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [sharedWith, setSharedWith] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [isSubmitting, setIsSubmitting] = useState(false); 

    const navigate = useNavigate();  


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axiosInstance.get('/users'); 
                console.log('API Response:', response);

                if (response.data && Array.isArray(response.data)) {
                    const userOptions = response.data.map(user => ({
                        label: `${user.first_name} ${user.last_name}` || 'Unnamed',
                        value: user.id
                    }));
                    setUsers(userOptions); 
                    console.log('User options:', userOptions);
                } else {
                    console.error('Unexpected data structure:', response.data);
                    setUsers([]);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false); 
            }
        };

        fetchUsers();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        const confirmed = window.confirm("Are you sure you want to add this note?");
        if (!confirmed) return; 

        setIsSubmitting(true);

        const sharedWithIds = sharedWith.map(user => user.value); 
        const noteData = {
            title,
            content,
            shared_with: sharedWithIds
        };

        addNote(noteData);
    };

    const addNote = async (noteData) => {
        try {
            const response = await axiosInstance.post('/notes', noteData); 
            console.log('Note created:', response);

            setTitle('');
            setContent('');
            setSharedWith([]);

            navigate('/notes');
        } catch (error) {
            console.error('Error creating note:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            color: 'black', 
            backgroundColor: state.isSelected ? '#e2e2e2' : 'white', 
            padding: 10,
        }),
        control: (provided) => ({
            ...provided,
            minHeight: '40px',
            borderColor: '#ccc',
            boxShadow: 'none',
            width: '100%',
            minWidth: '300px',
            '&:hover': {
                borderColor: '#999',
            },
            
        }),
        menu: (provided) => ({
            ...provided,
            zIndex: 1000, 
        }),
        multiValue: (provided) => ({
            ...provided,
            display: 'block', 
            marginBottom: '5px',
            backgroundColor: '#f1f1f1', 
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            color: 'black', 
        }),
        multiValueRemove: (provided) => ({
            ...provided,
            color: 'black', 
            cursor: 'pointer',
        }),
    };

    const handleCancel = () => {
        setTitle('');
        setContent('');
        setSharedWith([]);
        navigate('/notes');
    };

    return (
      <div className="bodycenter">

        <div className='all'>
            <h1>Add Note</h1>
            <form className='formlogin' onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                    required
                />
                <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Content"
                    required
                />

                
                <Select 
                    isMulti
                    options={users}       
                    value={sharedWith}      
                    onChange={setSharedWith}  
                    placeholder="Select users to share with"
                    getOptionLabel={(e) => e.label}
                    getOptionValue={(e) => e.value}
                    styles={customStyles}
                    isDisabled={loading}     
                />

                <div className="form-buttons">
                    <button 
                        className='btnform' 
                        type="submit"
                        disabled={loading || isSubmitting}  
                    >
                        {isSubmitting ? "Adding Note..." : "Add Note"}  
                    </button>
                    <button 
                        className='btnform' 
                        type="button" 
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div></div>
    );
};

export default CreateNote;
