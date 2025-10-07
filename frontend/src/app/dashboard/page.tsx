'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { getToken } from '../../lib/auth';
import Header from '@/components/Header';

type Note = {
  id: number;
  title: string;
  description: string;
  user_id: number;
};

export default function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push('/login');
      return;
    }
    fetchNotes(token);
  }, [router]);

  const fetchNotes = async (token: string) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/notes/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(response.data);
    } catch (err) {
      router.push('/login');
    }
  };

  const handleCreate = async () => {
    const token = getToken();
    if (!token) return;
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/notes/`,
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle('');
      setDescription('');
      fetchNotes(token);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = async (note: Note) => {
    const token = getToken();
    if (!token) return;
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/notes/${note.id}`,
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingNote(null);
      setTitle('');
      setDescription('');
      fetchNotes(token);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (noteId: number) => {
    const token = getToken();
    if (!token) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/${noteId}`, {
        headers: { Authorization: `Bearer ${token}` } },
      );
      fetchNotes(token);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
    <Header />
    <div className="min-h-screen p-8 bg-gray-700">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="mb-8">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <button
          onClick={editingNote ? () => handleEdit(editingNote) : handleCreate}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          {editingNote ? 'Update Note' : 'Create Note'}
        </button>
        {editingNote && (
          <button
            onClick={() => {
              setEditingNote(null);
              setTitle('');
              setDescription('');
            }}
            className="ml-4 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        )}
      </div>
      <div className="bg-gray-700 rounded shadow-md">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-500">
              <th className="p-2">Title</th>
              <th className="p-2">Description</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {notes.map((note) => (
              <tr key={note.id} className="border-t">
                <td className="p-2">{note.title}</td>
                <td className="p-2">{note.description}</td>
                <td className="p-2">
                  <button
                    onClick={() => {
                      setEditingNote(note);
                      setTitle(note.title);
                      setDescription(note.description);
                    }}
                    className="bg-yellow-500 text-white p-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="bg-red-500 text-white p-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
}