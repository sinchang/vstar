import Vue from 'vue'
import App from 'components/App'
import bulma from 'bulma'
import Toasted from 'vue-toasted'
import SocialSharing from 'vue-social-sharing'

Vue.use(SocialSharing)
Vue.use(Toasted)

// Fundebug 错误监控
Vue.config.errorHandler = function (err, vm) {
  var componentName = Vue.util.formatComponentName(vm),
    propsData = vm.$options.propsData
  fundebug.notifyError(err, {
    metaData: {
      componentName: componentName,
      propsData: propsData
    }
  })
}

new Vue({
  el: '#app',
  render: h => h(App)
})
