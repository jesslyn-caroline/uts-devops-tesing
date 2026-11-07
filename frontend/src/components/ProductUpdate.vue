<template>
  <div>
    <form>
      <div class="mb-5">
        <label
          for="product-name"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >Product Name</label
        >
        <input
          type="text"
          id="product-name"
          v-model="product_name"
          class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
          required
        />
      </div>
      <div class="mb-5">
        <label
          for="product-price"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >Product Price</label
        >
        <input
          type="number"
          id="product-price"
          v-model="product_price"
          class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
          required
        />
      </div>
      <button
        class="w-fit h-fit px-4 py-2 rounded-md bg-emerald-300 text-white text-md font-semibold"
        @click="updateProduct()"
      >
        Save
      </button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "ProductUpdate",

  data() {
    return {
      product_name: "",
      product_price: "",
    };
  },

  created: function() {
    this.getProductById();
  },

  methods: {
    async getProductById() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/products/${this.$route.params.id}`
        );
        this.product_name = response.data[0].product_name;
        this.product_price = response.data[0].product_price;
        console.log(this.product_name);
      } catch (err) {
        console.log(err);
      }
    },
    async updateProduct() {
      try {
        event.preventDefault();
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/products/${this.$route.params.id}`,
          {
            product_name: this.product_name,
            product_price: this.product_price,
          }
        );
        this.product_name = "";
        this.product_price = "";
        this.$router.push("/");
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style></style>
