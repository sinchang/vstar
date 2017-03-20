import Vue from 'vue'
import App from 'components/App'
import bulma from 'bulma'
import Toasted from 'vue-toasted'
import SocialSharing from 'vue-social-sharing'
import ga from 'vue-ga'

ga(collect => {
  window.onhashchange = () => {
    collect(location.pathname + location.hash)
  }
}, 'UA-41610509-8')

Vue.use(SocialSharing)
Vue.use(Toasted)

new Vue({
  el: '#app',
  render: h => h(App)
})
