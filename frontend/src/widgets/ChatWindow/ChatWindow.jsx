import React, { useState } from 'react';
import cl from './ChatWindow.module.scss';

function ChatWindow({ onSubmit, onClose }) {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [messages, setMessages] = useState([]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const imagePreviewURL = image ? URL.createObjectURL(image) : null;

    const newMessage = {
      description,
      image: imagePreviewURL,
      result: "Обработка...",
      sender: "user"
    };

    setMessages([...messages, newMessage]);

    const formData = new FormData();
    formData.append('description', description);
    if (image) {
      formData.append('image', image);
    }

    const result = await onSubmit(formData);
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages];
      updatedMessages[updatedMessages.length - 1] = {
        ...newMessage,
        result: result.result.toString(),
        sender: "ai"
      };
      return updatedMessages;
    });

    setDescription('');
    setImage(null);
  };

  return (
    <div className={cl.chatWindow}>
      <div className={cl.chatWindow__header}>
        <h3>AI Suggestions</h3>
        <button onClick={onClose}>X</button>
      </div>
      
      <div className={cl.chatWindow__messages}>
        {messages.map((msg, index) => (
          <div key={index} className={cl.chatWindow__message}>
            <p><strong>{msg.sender === "user" ? "Вы" : "AI"}</strong> {msg.description}</p>
            {msg.image && <img src={msg.image} alt="Attached" />}
            <p><strong>AI:</strong> {msg.result}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className={cl.chatForm}>
        <textarea 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="Опишите ситуацию..." 
          required 
        />

        <div className={cl.formControls}>
          <label htmlFor="fileInput" className={cl.fileLabel}>
            📎
            <input 
              id="fileInput" 
              type="file" 
              onChange={handleImageChange} 
              accept="image/*" 
              style={{ display: 'none' }} 
            />
          </label>
          
          <button type="submit">Отправить</button>
        </div>
      </form>
    </div>
  );
}

export default ChatWindow;
