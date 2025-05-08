function ProductCard({ title, price, photo }) {
    return (
      <div class="rounded-lg border border-white-200 bg-white p-6 shadow-sm">
      <div class="h-56 w-full">
        <a href="#">
          <img  class="mx-auto hidden h-full dark:block" src={photo} alt="" />
        </a>
      </div>
      <div class="pt-6">
        <div class="mb-4 flex items-center justify-between gap-4">
          <div class="flex items-center justify-end gap-1"> 
          </div>
        </div>

        <a href="#" class="text-lg font-semibold leading-tight text-black-900">{title}</a>

        <div class="mt-4 flex items-center justify-between gap-4">
          <p class="text-2xl font-extrabold leading-tight text-black-900">{price}</p>
        </div>
      </div>
    </div>
    );
  }
   export default ProductCard;