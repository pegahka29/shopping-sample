<template>
  <div class="container">
    <h1>Cart</h1>
    <div v-if="cart.length > 0">
      <b-table striped hover :items="cart" :fields="fields">
        <template #cell(name)="data">
          {{ data.item.attributes.name }}
        </template>
        <template #cell(price)="data">
          {{ data.item.attributes.price }}
        </template>
        <template #cell(change-value)="data">
          <b-button pill variant="outline-danger" @click="removeFromCart(data.item)">-</b-button>
          {{data.item.count}}
          <b-button pill variant="outline-success" @click="addToCart(data.item)">+</b-button>
        </template>
        <template #cell(total-price)="data">
          {{ data.item.attributes.price * data.item.count }}
        </template>
        <template #cell(remove)="data">
          <b-button variant="danger" @click="removeFromCartComplete(data.item)">Remove</b-button>
        </template>
      </b-table>
      <p>Total: {{ cartTotal }}</p>
    </div>
    <div v-else>
      <p>Your cart is empty.</p>
    </div>
  </div>
</template>

<script>
import { useCartStore } from '~/stores/cart'
import { storeToRefs } from 'pinia'
import {onMounted} from "vue";
export default {
  setup() {
    const fields = ['name', 'price', 'change-value', 'total-price', 'remove']
    const cartStore = useCartStore()
    const { cart, cartTotal } = storeToRefs(cartStore)

    const addToCart = (product) => {
      cartStore.addToCart(product)
    }
    const removeFromCart = (product) => {
      cartStore.removeFromCart(product)
    }
    const removeFromCartComplete = (product) => {
      cartStore.removeFromCartComplete(product)
    }

    onMounted(() => {
      cartStore.loadCart()
    })

    return {
      fields,
      cart,
      cartTotal,
      addToCart,
      removeFromCart,
      removeFromCartComplete,
    }
  }
}
</script>
