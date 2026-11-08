<template>
  <div class="flex flex-col space-y-1.5">
    <router-link
      to="/create"
      class="w-fit h-fit px-4 py-2 rounded-md bg-emerald-300 text-white text-md font-semibold"
      >Add New Edit</router-link
    >
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table
        class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
      >
        <thead
          class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
        >
          <tr>
            <th scope="col" class="px-6 py-3">Product name</th>
            <th scope="col" class="px-6 py-3">Product Price</th>
            <th scope="col" class="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in items"
            :key="item.product_id"
            class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
          >
            <th
              scope="row"
              class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              {{ item.product_name }}
            </th>
            <td class="px-6 py-4">{{ item.product_price }}</td>
            <td class="px-6 py-4 space-x-2.5">
              <router-link
                :to="`/update/${item.product_id}`"
                class="w-fit h-fit px-4 py-2 rounded-md bg-emerald-300 text-white text-md font-semibold"
                >Edit</router-link
              >
              <button
                class="w-fit h-fit px-4 py-2 rounded-md bg-emerald-300 text-white text-md font-semibold"
                @click="deleteProduct(item.product_id)"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ProductList",
  data() {
    return {
      items: [],
    };
  },
  created() {
    this.getProducts();
  },
  methods: {
    async getProducts() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
        this.items = response.data;
        console.log(this.items);
      } catch (err) {
        console.log("Error fetching products:", err);
      }
    },
    async deleteProduct(id) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
        this.getProducts();
      } catch (err) {
        console.log("Error deleting product:", err);
      }
    },
  },
};
</script>
