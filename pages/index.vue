<template>
  <div class="container">
    <div class="d-flex flex-column align-content-center justify-content-center">
      <h1 class="mt-3">Products</h1>
      <div v-if="products && products.length > 0" class="row">
        <div v-for="product in products" :key="product.id" class="col-md-4 mb-2">
          <b-card :title="product.attributes.name" img-alt="Product image" img-top>
            <b-card-text>
              Name: {{ product.attributes.name }}
            </b-card-text>
            <b-card-text>
              Price: {{ product.attributes.price }}
            </b-card-text>
            <b-button
              :class="productCount(product) > 0 ? 'btn-success': 'btn-info'"
              @click="addToCart(product)">Add to cart</b-button>
            <span v-if="productCount(product) > 0">
              x {{productCount(product)}}
              <b-button pill variant="outline-danger" @click="removeFromCart(product)">-</b-button>
            </span>
          </b-card>
        </div>
      </div>
      <div class="d-flex flex-column align-content-center justify-content-center mt-3">
        <b-pagination
          v-if="!loading"
          class="d-flex align-content-center justify-content-center"
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          pills
          @change="changePage"
        >
        </b-pagination>
      </div>
      <b-button variant="secondary" class="basket-icon" @click="$router.push('/cart')">
        <b-icon-basket-fill></b-icon-basket-fill>
        <b-badge variant="light">{{ cartLength }}</b-badge>
      </b-button>

    </div>
  </div>
</template>

<script>
import {ref, onMounted} from 'vue'
import {useRoute, useRouter, useFetch} from "@nuxtjs/composition-api"
import { useCartStore } from '~/stores/cart'
import { storeToRefs } from 'pinia'

import axios from 'axios'

export default {
  setup() {
    const cartStore = useCartStore()
    const { cart, cartLength, cartTotal } = storeToRefs(cartStore)
    const route = useRoute();
    const router = useRouter();
    const loading = ref(false)
    const products = ref({})
    const currentPage = ref(Number(route.value.query.page) || 1)
    const perPage = ref(25)
    const totalRows = ref(0)
    let params = {
      page:Number(route.value.query.page) || 1
    }
    const updateRouterQuery = () => {
      if(Number(Number(route.value.query.page) !== currentPage.value)){
        const query = {
          page: currentPage.value,
        }
        router.replace({ query })
      }
    }
    const getProducts = async () => {
      loading.value = true;
      axios.get(`https://demo.spreecommerce.org/api/v2/storefront/products?page=${params.page}`)
        .then(response => {
          products.value = response.data.data
          totalRows.value = response.data.meta['total_count']
          currentPage.value = params.page
          updateRouterQuery()
          scrollToTop()
        })
        .catch(error => {
          console.error(error)
        })
        .finally(() => {
          loading.value = false
        })
    }
    const changePage = async (page) => {
      params.page = page
      await getProducts()
    }
    const addToCart = (product) => {
      cartStore.addToCart(product)
    }
    const removeFromCart = (product) => {
      cartStore.removeFromCart(product)
    }
    const productCount = (product) => {
      return cartStore.productCount(product)
    }
    const scrollToTop =()=> {
      window.scrollTo({top: 0, behavior: 'smooth'});
    }

    // getProducts();
    const { fetch } = useFetch(async () => {
      await getProducts()
    })
    fetch();

    onMounted(() => {
      cartStore.loadCart()
    })

    return {
      cart,
      cartLength,
      cartTotal,
      loading,
      products,
      currentPage,
      perPage,
      totalRows,
      changePage,
      addToCart,
      removeFromCart,
      productCount,
      scrollToTop,
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
