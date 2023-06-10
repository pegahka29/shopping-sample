import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const cart = ref([])

  function addToCart(product) {
    const productCartIndex = isInCart(product)
    if(productCartIndex !== false){
      cart.value[productCartIndex].count += 1;
    }
    else{
      cart.value.push({...product, ...{count: 1}})
    }
    localStorage.setItem('cart', JSON.stringify(cart.value))
  }
  function removeFromCart(product) {
    const productCartIndex = isInCart(product)
    if(productCartIndex !== false && cart.value[productCartIndex].count > 1){
      cart.value[productCartIndex].count -= 1;
    }
    else{
      cart.value = cart.value.filter(p => p.id !== product.id)
    }
    localStorage.setItem('cart', JSON.stringify(cart.value))
  }
  function removeFromCartComplete(product) {
    cart.value = cart.value.filter(p => p.id !== product.id)
    localStorage.setItem('cart', JSON.stringify(cart.value))
  }
  function loadCart() {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      cart.value = JSON.parse(savedCart)
    }
  }
  function isInCart(product) {
    const productIndex = cart.value.findIndex(item => item.id === product.id)
    return productIndex === -1 ? false : productIndex
  }

  function productCount(product) {
    const foundProduct = cart.value.find(item => item.id === product.id)
    return foundProduct ? foundProduct.count : 0
  }

  const cartLength = computed(() => cart.value.length)
  const cartTotal = computed(() => {
    return cart.value.reduce((sum, product) => sum + parseFloat(product.attributes.price * product.count), 0)
  })


  return { cart, addToCart, removeFromCart, removeFromCartComplete, loadCart, productCount, cartLength, cartTotal }
})
