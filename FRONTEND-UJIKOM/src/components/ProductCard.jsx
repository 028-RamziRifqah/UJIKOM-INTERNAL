export default function ProductCard({ product }) {
  return (
    <div className="border rounded-lg p-3 text-center hover:border-accent">
      <p className="font-semibold">{product.diamond_amount} 💎</p>
      <p className="text-sm">Rp {product.price}</p>
    </div>
  );
}