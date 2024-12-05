import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faSave, faTimes, faSearch } from "@fortawesome/free-solid-svg-icons";
import axiosInstance from "./axiosInstance";

const List = () => {
  const [data2, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 
  const [editingNote, setEditingNote] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [editedColor, setEditedColor] = useState("#f7e1d7");
  const [searchTitle, setSearchTitle] = useState(""); 

  useEffect(() => {
    getList();
  }, []);

  const user = JSON.parse(sessionStorage.getItem("user")); 
  const getList = async () => {
    try {
      const resp = await axiosInstance.get("/notes");
      setData(
        resp.data.map((note) => ({ ...note, isLoading: false })) 
      );
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteNote = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this note?");
    if (confirmed) {
      try {
        await axiosInstance.delete(`/notes/${id}`);
        setData(data2.filter((note) => note.id !== id));
      } catch (error) {
        console.error("Error deleting note:", error);
      }
    }
  };

  const startEdit = (note) => {
    setEditingNote(note.id);
    setEditedTitle(note.title);
    setEditedContent(note.content);
    setEditedColor(note.color || "#f7e1d7");
  };

  const cancelEdit = () => {
    setEditingNote(null);
  };

  const updateNote = async (id) => {
    const confirmed = window.confirm("Are you sure you want to save changes to this note?");
    if (!confirmed) return;

    setData(data2.map((note) => (note.id === id ? { ...note, isLoading: true } : note)));

    try {
      await axiosInstance.put(`/notes/${id}`, {
        title: editedTitle,
        content: editedContent,
        color: editedColor,
      });
      setData(
        data2.map((note) =>
          note.id === id
            ? { ...note, title: editedTitle, content: editedContent, color: editedColor, isLoading: false }
            : note
        )
      );
      setEditingNote(null);
    } catch (error) {
      console.error("Error updating note:", error);
      setData(data2.map((note) => (note.id === id ? { ...note, isLoading: false } : note)));
    }
  };

  const filteredNotes = data2.filter((note) =>
    note.title.toLowerCase().includes(searchTitle.toLowerCase())
  );

  const getInitials = (firstName, lastName) => {
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  };

  return (
    <>
    <h1 className="bigtitle">ALL NOTES</h1>
     <div className="header">

<div className="user-header">
  <h2>你好   {user ? `${user.first_name} ${user.last_name}` : "Guest"} <img src="hii.png" alt="" /></h2>
</div>

<div className="search-container">
<div className="search-wrapper">
  <input
    type="text"
    className="search-input"
    placeholder="Search by title"
    value={searchTitle}
    onChange={(e) => setSearchTitle(e.target.value)}
  />
  <FontAwesomeIcon icon={faSearch} className="search-icon" />
</div>

</div>
</div>
    <div className="notes-container">
           
      {isLoading ? (
        <div className="loading-text">
        <span className="dot-1">.</span>
          <span className="dot-2">.</span>
          <span className="dot-3">.</span>
        </div>
      ) : (
        filteredNotes.map((note) => (
          <div
            key={note.id}
            className={`note-card ${editingNote === note.id ? "editing" : ""}`}
            style={{ backgroundColor: editingNote === note.id ? editedColor : note.color || "#f7e1d7" }}
          >
            {note.isLoading ? (
              <div className="card-loading">
                <FontAwesomeIcon icon={faSave} spin />
              </div>
            ) : (
              <>
                {editingNote === note.id ? (
                  <>
                    <input
                      type="text"
                      className="note-title-input styled-input"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                    />
                    <textarea
                      className="note-content-input styled-input"
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                    ></textarea>

                    <div className="color-picker">
                   
                      <input
                      className="color"
                        type="color"
                        value={editedColor}
                        onChange={(e) => setEditedColor(e.target.value)}
                      />
                    </div>

                    <div className="note-update">
                      <button
                        onClick={() => updateNote(note.id)}
                        className="save-btn"
                        disabled={note.isLoading}
                      >
                        <FontAwesomeIcon icon={faSave} spin={note.isLoading}/> 
                      </button>
                      <button onClick={cancelEdit} className="cancel-btn" disabled={note.isLoading}>
                        <FontAwesomeIcon icon={faTimes} /> 
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                       
                          <div className="top">
                        <p className="note-date">
                        <strong>
{new Date(note.date).toLocaleDateString("fr-MA", {
  year: "numeric",
  month: "long",
  day: "numeric",
})}{" "}
{new Date(note.date).toLocaleTimeString("fr-MA", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
})}</strong>

                    </p>
                    <div className="note-actions">
                      <button onClick={() => startEdit(note)} className="edit-btn">
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button onClick={() => deleteNote(note.id)} className="delete-btn">
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                      </div>
                    </div>
                    <p className="note-title">{note.title || "Untitled"}</p>
                    <hr />
                    <p className="note-content">{note.content || "No content available"}</p>
                  

                    <div className="note-shared-by">
                      <strong></strong>
                      {note.shared_with.map((share, index) => {
                        const initials = getInitials(share.first_name, share.last_name);
                        return (
                          <span
                            key={index}
                            title={`${share.first_name} ${share.last_name}`}
                            className="shared-user-initials"
                          >
                            {initials}
                          </span>
                        );
                      })}
                    </div>

              
                  </>
                )}
              </>
            )}
          </div>
        ))
      )}
    </div></>
  );
};

export default List;
