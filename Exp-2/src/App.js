import React from 'react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import PostComposer from './components/PostComposer';
import DraftList from './components/DraftList';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <div style={{ maxWidth: '600px', margin: '20px auto', fontFamily: 'sans-serif' }}>
        <h2>Centralized State Management System (Redux Toolkit)</h2>
        <PostComposer />
        <DraftList />
      </div>
    </Provider>
  );
}

export default App;