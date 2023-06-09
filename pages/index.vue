<template>
  <div class="container">
    <h1 class="mt-3">Products</h1>
    <div v-if="products && products.length > 0" class="row">
      <div v-for="product in products" :key="product.id" class="col-md-4 mb-2">
        <b-card :title="product.name" img-alt="Product image" img-top>
          <b-card-text>
            Name: {{ product.attributes.name }}
          </b-card-text>
          <b-card-text>
            Price: {{ product.attributes.price }}
          </b-card-text>
          <b-button variant="primary">Add to cart</b-button>
        </b-card>
      </div>
    </div>
    <b-button variant="primary" class="basket-icon" @click="$router.push('/card')">
      <b-icon-basket-fill></b-icon-basket-fill>
      <b-badge variant="light"></b-badge>
    </b-button>
  </div>
</template>

<script>
import {ref, onMounted} from 'vue'
import axios from 'axios'

export default {
  setup() {
    const products = ref({})

    onMounted(() => {
      axios.get('https://demo.spreecommerce.org/api/v2/storefront/products')
        .then(response => {
          products.value = response.data.data
        })
        .catch(error => {
          console.error(error)
        })
    })
    return {
      products,
    }
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
