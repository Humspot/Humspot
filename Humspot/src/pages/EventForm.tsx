import React, { useState } from 'react';

const EventForm = (props) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        location: '',
        addedByUserID: '', // This will likely come from the logged-in user
        date: '',
        time: '',
        latitude: '',
        longitude: '',
        organizer: '',
        tags: '',
        photoUrls: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Send the data to the server or admin for review
        console.log(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Name:</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} />
            </div>
            <div>
                <label>Description:</label>
                <textarea name="description" value={formData.description} onChange={handleChange}></textarea>
            </div>
            <div>
                <label>Location:</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} />
            </div>
            <div>
                <label>Date:</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} />
            </div>
            <div>
                <label>Time:</label>
                <input type="time" name="time" value={formData.time} onChange={handleChange} />
            </div>
            <div>
                <label>Latitude:</label>
                <input type="number" name="latitude" step="any" value={formData.latitude} onChange={handleChange} />
            </div>
            <div>
                <label>Longitude:</label>
                <input type="number" name="longitude" step="any" value={formData.longitude} onChange={handleChange} />
            </div>
            <div>
                <label>Organizer:</label>
                <input type="text" name="organizer" value={formData.organizer} onChange={handleChange} />
            </div>
            <div>
                <label>Tags (comma-separated):</label>
                <input type="text" name="tags" value={formData.tags} onChange={handleChange} />
            </div>
            <div>
                {/* This is a simple input. In reality, you might want to have a file upload for photos */}
                <label>Photo URLs (comma-separated):</label>
                <input type="text" name="photoUrls" value={formData.photoUrls} onChange={handleChange} />
            </div>
            <div>
                <button type="submit">Submit</button>
            </div>
        </form>
    );
};

export default EventForm;

