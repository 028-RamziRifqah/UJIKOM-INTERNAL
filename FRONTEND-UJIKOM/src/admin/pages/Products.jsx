import { useEffect, useState } from "react"
import api from "../../services/api"
import AdminLayout from "../components/AdminLayout"

export default function Products() {
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [editId, setEditId] = useState(null)

    const [form, setForm] = useState({
        category_id: "",
        diamond_amount: "",
        price: "",
        image: null,
    })

    const fetchData = async () => {
        const prodRes = await api.get("/products")
        const catRes = await api.get("/categories")

        setProducts(prodRes.data.data || prodRes.data || [])
        setCategories(catRes.data.data || catRes.data || [])
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target

        setForm({
        ...form,
        [name]: ["category_id", "diamond_amount", "price"].includes(name)
            ? Number(value)
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
        formData.append("diamond_amount", Number(form.diamond_amount))
        formData.append("price", Number(form.price))
        if (form.image) formData.append("image", form.image)

        if (editId) {
            await api.put(`/products/${Number(editId)}`, formData)
            setEditId(null)
        } else {
            await api.post("/products", formData)
        }

        setForm({
            category_id: "",
            diamond_amount: "",
            price: "",
            image: null,
        })

        fetchData()
        } catch (err) {
        console.error(err.response?.data || err)
        alert("Gagal menyimpan produk")
        }
    }

    const handleEdit = (p) => {
        setEditId(p.id)
        setForm({
        category_id: Number(p.category_id),
        diamond_amount: Number(p.diamond_amount),
        price: Number(p.price),
        image: null,
        })
    }

    const handleDelete = async (id) => {
        if (!confirm("Hapus produk ini?")) return

        try {
        await api.delete(`/products/${Number(id)}`)
        fetchData()
        } catch (err) {
        console.error(err.response?.data || err)
        alert("Produk gagal dihapus (cek relasi transaksi)")
        }
    }

    return (
        <AdminLayout title="Products">
        {/* FORM */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-6">
            <select
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            className="border p-2"
            required
            >
            <option value="">Pilih Kategori</option>
            {categories.map((c) => (
                <option key={c.id} value={c.id}>
                {c.name}
                </option>
            ))}
            </select>

            <input
            name="diamond_amount"
            type="number"
            value={form.diamond_amount}
            onChange={handleChange}
            placeholder="Jumlah Diamond"
            className="border p-2"
            required
            />

            <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Harga"
            className="border p-2"
            required
            />

        <input type="file" accept="image/*" onChange={handleFile} className="border p-2" />

            <button className="md:col-span-4 bg-navy text-white py-2 rounded">
            {editId ? "Update Produk" : "Tambah Produk"}
            </button>
        </form>

        {/* TABLE */}
        <table className="w-full border">
            <thead className="bg-gray-100">
            <tr>
                <th className="border p-2">Kategori</th>
                <th className="border p-2">Diamond</th>
                <th className="border p-2">Harga</th>
                <th className="border p-2">Gambar</th>
                <th className="border p-2">Aksi</th>
            </tr>
            </thead>
            <tbody>
            {products.map((p) => (
                <tr key={p.id}>
                <td className="border p-2">
                    {categories.find(c => c.id === p.category_id)?.name || "-"}
                </td>
                <td className="border p-2">{p.diamond_amount}</td>
                <td className="border p-2">Rp {p.price}</td>
                <td className="border p-2">
                    {p.image && (
                    <img
                        src={`http://localhost:3000/uploads/${p.image}`}
                        className="w-16 rounded"
                    />
                    )}
                </td>
                <td className="border p-2 space-x-2">
                    <button onClick={() => handleEdit(p)} className="bg-yellow-400 px-2 rounded">
                    Edit
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="bg-red-500 text-white px-2 rounded">
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