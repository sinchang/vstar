import Vue from 'vue'
import App from 'components/App'
import bulma from 'bulma'
import Toasted from 'vue-toasted'
import SocialSharing from 'vue-social-sharing'
import VueAnalytics from 'vue-analytics'

Vue.use(VueAnalytics, {
  id: 'UA-41610509-8'
})
Vue.use(SocialSharing)
Vue.use(Toasted)

new Vue({
  el: '#app',
  render: h => h(App)
})
