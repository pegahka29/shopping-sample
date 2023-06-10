import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const cart = ref([])

  function addToCart(product) {
    cart.value.push(product)
    localStorage.setItem('cart', JSON.stringify(cart.value))
  }
  function removeFromCart(product) {
    cart.value = cart.value.filter(p => p.id !== product.id)
    localStorage.setItem('cart', JSON.stringify(cart.value))
  }
  function loadCart() {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      cart.value = JSON.parse(savedCart)
    }
  }

  const cartLength = computed(() => cart.value.length)
  const cartTotal = computed(() => {
    return cart.value.reduce((sum, product) => sum + parseFloat(product.attributes.price), 0)
  })


  return { cart, addToCart, removeFromCart, loadCart, cartLength, cartTotal }
})
