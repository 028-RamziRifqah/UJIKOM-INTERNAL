import { useEffect, useState } from "react"
import api from "../../services/api"
import AdminLayout from "../components/AdminLayout"

export default function Events() {
    const [events, setEvents] = useState([])
    const [categories, setCategories] = useState([])
    const [editId, setEditId] = useState(null)

    const [form, setForm] = useState({
        category_id: "",
        name: "",
        image: null,
    })

    const fetchData = async () => {
        const eveRes = await api.get("/events")
        const catRes = await api.get("/categories")

        setEvents(eveRes.data.data || eveRes.data || [])
        setCategories(catRes.data.data || catRes.data || [])
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target

        setForm({
            ...form,
            [name]: ["category_id", "name"].includes(name)
                ? String(value)
                : value,
        })
    }

    const handleFile = (e) => {
        setForm({ ...form, image: e.target.files[0] })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const formData = new FormData()
            formData.append("category_id", Number(form.category_id))
            formData.append("name", String(form.name))
            if (form.image) formData.append("image", form.image)

            if (editId) {
                await api.put(`/events/${Number(editId)}`, formData)
                setEditId(null)
            } else {
                await api.post("/events", formData)
            }

            setForm({
                category_id: "",
                name: "",
                image: null,
            })

            fetchData()
        } catch (err) {
            console.error(err.response?.data || err)
            alert("Gagal menyimpan acara")
        }
    }

    const handleEdit = (p) => {
        setEditId(p.id)
        setForm({
            category_id: Number(p.category_id),
            name: String(p.name),
            image: null,
        })
    }

    const handleDelete = async (id) => {
        if (!confirm("Hapus acara ini?")) return

        try {
            await api.delete(`/events/${Number(id)}`)
            fetchData()
        } catch (err) {
            console.error(err.response?.data || err)
            alert("Acara gagal dihapus")
        }
    }

    return (
        <AdminLayout title="Events">
            <h1 className="text-3xl font-bold mb-8 text-white">Kelola Acara</h1>

            <div className="bg-navy-800 p-6 rounded-2xl border border-navy-700 shadow-xl mb-8">
                <h2 className="text-xl font-bold text-gray-300 mb-4">{editId ? "Edit Acara" : "Tambah Acara Baru"}</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <select
                        name="category_id"
                        value={form.category_id}
                        onChange={handleChange}
                        className="bg-navy-900 border border-navy-600 text-white p-3 rounded-xl focus:outline-none focus:border-accent"
                        required
                    >
                        <option value="">Pilih Kategori Game</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>

                    <input
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Nama Acara"
                        className="bg-navy-900 border border-navy-600 text-white p-3 rounded-xl focus:outline-none focus:border-accent"
                        required
                    />

                    <div className="relative">
                        <input type="file" accept="image/*" onChange={handleFile} className="hidden" id="file-upload" />
                        <label htmlFor="file-upload" className="flex items-center justify-center w-full h-full bg-navy-900 border border-dashed border-navy-600 rounded-xl cursor-pointer hover:border-accent hover:text-accent transition text-gray-400">
                            {form.image ? "Gambar Dipilih" : "Upload Gambar"}
                        </label>
                    </div>

                    <button className="md:col-span-4 bg-accent hover:bg-accent-hover text-white py-3 rounded-xl font-bold shadow-lg shadow-accent/20 transition-all transform hover:-translate-y-1">
                        {editId ? "Update Acara" : "Simpan Acara"}
                    </button>
                </form>
            </div>

            <div className="bg-navy-800 rounded-xl shadow-xl overflow-hidden border border-navy-700">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-navy-900 text-gray-400">
                            <tr>
                                <th className="p-4">Kategori</th>
                                <th className="p-4">Nama acara</th>
                                <th className="p-4">Gambar</th>
                                <th className="p-4">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-navy-700">
                            {events.map((p) => (
                                <tr key={p.id} className="hover:bg-navy-700/50 transition-colors">
                                    <td className="p-4 text-white font-medium">
                                        {categories.find(c => c.id === p.category_id)?.name || "-"}
                                    </td>
                                    <td className="p-4">{p.name}</td>
                                    <td className="p-4">
                                        {p.image && (
                                            <img
                                                src={`http://localhost:3000/uploads/${p.image}`}
                                                className="w-12 h-12 rounded-lg object-cover border border-navy-600"
                                            />
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEdit(p)} className="bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500 hover:text-white px-3 py-1.5 rounded-lg transition-all text-sm border border-yellow-500/30">
                                                Edit
                                            </button>
                                            <button onClick={() => handleDelete(p.id)} className="bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-lg transition-all text-sm border border-red-500/30">
                                                Hapus
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {events.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        Belum ada acara.
                    </div>
                )}
            </div>
        </AdminLayout>
    )
}   