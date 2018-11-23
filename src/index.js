import Vue from 'vue'
import App from 'components/App'
import Toasted from 'vue-toasted'
import SocialSharing from 'vue-social-sharing'

Vue.use(SocialSharing)
Vue.use(Toasted)

new Vue({
  el: '#app',
  render: h => h(App)
})
