import Vue from 'vue'
import App from 'components/App'
import bulma from 'bulma'
import Toasted from 'vue-toasted'

Vue.use(Toasted)

new Vue({
  el: '#app',
  render: h => h(App)
})
