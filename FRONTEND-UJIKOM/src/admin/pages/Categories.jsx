import { useEffect, useState } from "react"
import api from "../../services/api"
import AdminLayout from "../components/AdminLayout"

export default function Categories() {
    const [categories, setCategories] = useState([])
    const [name, setName] = useState("")
    const [image, setImage] = useState(null)
    const [editId, setEditId] = useState(null)

    const fetchCategories = async () => {
        const res = await api.get("/categories")
        setCategories(res.data.data || res.data)
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
        const formData = new FormData()
        formData.append("name", name)
        if (image) formData.append("image", image)

        if (editId) {
            await api.put(`/categories/${editId}`, formData)
        } else {
            await api.post("/categories", formData)
        }

        setName("")
        setImage(null)
        setEditId(null)
        fetchCategories()
        } catch (err) {
        alert("Gagal simpan kategori")
        console.error(err)
        }
    }

    const handleEdit = (c) => {
        setEditId(c.id)
        setName(c.name)
    }

    const handleDelete = async (id) => {
        if (confirm("Hapus kategori?")) {
        await api.delete(`/categories/${id}`)
        fetchCategories()
        }
    }

    return (
        <AdminLayout title="Categories">
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
            <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 flex-1"
            placeholder="Nama kategori"
            required
            />

            <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="border p-2"
            />

            <button type="submit" className="bg-blue-600 text-white px-4">
            {editId ? "Update" : "Tambah"}
            </button>
        </form>

        <table className="w-full border">
            <thead className="bg-gray-100">
            <tr>
                <th className="border p-2">Nama</th>
                <th className="border p-2">Gambar</th>
                <th className="border p-2">Aksi</th>
            </tr>
            </thead>
            <tbody>
            {categories.map((c) => (
                <tr key={c.id}>
                <td className="border p-2">{c.name}</td>
                <td className="border p-2">
                    {c.image && (
                    <img
                        src={`http://localhost:3000/uploads/${c.image}`}
                        alt={c.name}
                        className="w-16 h-16 object-cover rounded"
                    />
                    )}
                </td>
                <td className="border p-2 space-x-2">
                    <button
                    onClick={() => handleEdit(c)}
                    className="bg-yellow-400 px-2 rounded"
                    >
                    Edit
                    </button>
                    <button
                    onClick={() => handleDelete(c.id)}
                    className="bg-red-500 text-white px-2 rounded"
                    >
                    Hapus
                    </button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </AdminLayout>
    )
}