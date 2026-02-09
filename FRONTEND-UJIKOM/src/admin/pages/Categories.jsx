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
            <h1 className="text-3xl font-bold mb-8 text-white">Kategori Game 🕹️</h1>

            <div className="bg-navy-800 p-6 rounded-2xl border border-navy-700 shadow-xl mb-8">
                <h2 className="text-xl font-bold text-gray-300 mb-4">{editId ? "Edit Kategori" : "Tambah Kategori Baru"}</h2>
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="flex-1 bg-navy-900 border border-navy-600 text-white p-3 rounded-xl focus:outline-none focus:border-accent"
                        placeholder="Nama Game"
                        required
                    />

                    <div className="relative">
                        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="hidden" id="cat-file-upload" />
                        <label htmlFor="cat-file-upload" className="flex items-center justify-center px-4 py-3 bg-navy-900 border border-dashed border-navy-600 rounded-xl cursor-pointer hover:border-accent hover:text-accent transition text-gray-400 h-full">
                            {image ? "Gambar Dipilih" : "Upload Gambar"}
                        </label>
                    </div>

                    <button type="submit" className="bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-accent/20 transition-all transform hover:-translate-y-1">
                        {editId ? "Update" : "Tambah"}
                    </button>
                </form>
            </div>

            <div className="bg-navy-800 rounded-xl shadow-xl overflow-hidden border border-navy-700">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-navy-900 text-gray-400">
                            <tr>
                                <th className="p-4">Nama</th>
                                <th className="p-4">Gambar</th>
                                <th className="p-4">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-navy-700">
                            {categories.map((c) => (
                                <tr key={c.id} className="hover:bg-navy-700/50 transition-colors">
                                    <td className="p-4 text-white font-medium text-lg">{c.name}</td>
                                    <td className="p-4">
                                        {c.image && (
                                            <img
                                                src={`http://localhost:3000/uploads/${c.image}`}
                                                alt={c.name}
                                                className="w-16 h-16 object-cover rounded-xl border border-navy-600"
                                            />
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(c)}
                                                className="bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500 hover:text-white px-3 py-1.5 rounded-lg transition-all text-sm border border-yellow-500/30"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(c.id)}
                                                className="bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-lg transition-all text-sm border border-red-500/30"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {categories.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        Belum ada kategori.
                    </div>
                )}
            </div>
        </AdminLayout>
    )
}