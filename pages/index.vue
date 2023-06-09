<template>
  <div class="container">
    <div class="d-flex flex-column align-content-center justify-content-center">
      <h1 class="mt-3">Products</h1>
      <div id="itemList" v-if="products && products.length > 0 && list" class="row">
        <div v-for="product in list" :key="product.id" :per-page="perPage" class="col-md-4 mb-2">
          <b-card :title="product.name" img-alt="Product image" img-top>
            <b-card-text>
              Name: {{ product.attributes.name }}
            </b-card-text>
            <b-card-text>
              Price: {{ product.attributes.price }}
            </b-card-text>
            <b-button variant="primary">Add to card</b-button>
          </b-card>
        </div>
      </div>
      <div class="d-flex flex-column align-content-center justify-content-center mt-3">
        <b-pagination
          class="d-flex align-content-center justify-content-center"
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          pills
          aria-controls="itemList"
        >
        </b-pagination>
        <p class="mt-3 text-center">Current Page: {{ currentPage }}</p>
      </div>
      <b-button variant="primary" class="basket-icon" @click="$router.push('/card')">
        <b-icon-basket-fill></b-icon-basket-fill>
        <b-badge variant="light"></b-badge>
      </b-button>
    </div>
  </div>
</template>

<script>
import {ref, onMounted, computed} from 'vue'
import axios from 'axios'

export default {
  setup() {
    const products = ref({})
    const currentPage = ref(1)
    const perPage = ref(5)

    onMounted(() => {
      axios.get('https://demo.spreecommerce.org/api/v2/storefront/products')
        .then(response => {
          products.value = response.data.data
        })
        .catch(error => {
          console.error(error)
        })
    })
    const totalRows = computed(() => {
      if (products.value)
        return products.value.length
      else return 0
    })
    const list = computed(() => {
      const items = products.value
      return products.value.slice(
        (currentPage.value - 1) * perPage.value,
        currentPage.value * perPage.value
      )
    })
    return {
      products,
      currentPage,
      perPage,
      totalRows,
      list
    }
  },
  lists() {
    const items = this.data;
    // Return just page of items needed
    return items.slice(
      (this.currentPage - 1) * this.perPage,
      this.currentPage * this.perPage
    )
  },
}
</script>

<style scoped>
.basket-icon {
  position: fixed;
  bottom: 20px;
  right: 20px;
}
</style>
