function ProductCard({ title, price, photo }) {
    return (
      <div className="rounded-lg border border-white-200 bg-white p-6 shadow-sm">
      <div className="h-56 w-full">
        <a href="#">
          <img  className="mx-auto hidden h-full dark:block" src={photo} alt="" />
        </a>
      </div>
      <div className="pt-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center justify-end gap-1"> 
          </div>
        </div>

        <a href="#" className="text-lg font-semibold leading-tight text-black-900">{title}</a>

        <div className="mt-4 flex items-center justify-between gap-4">
          <p className="text-2xl font-extrabold leading-tight text-black-900">{price}</p>
        </div>
      </div>
    </div>
    );
  }
   export default ProductCard;