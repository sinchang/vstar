<template>
  <div id="app" class="section">
    <template>
      <github-badge slug="sinchang/vstar" />
    </template>
    <div class="columns">
      <div class="column is-half">
        <h1 class="g-title">vstar</h1>
        <label class="label">GitHub Name:</label>
        <p class="control">
          <input class="input" type="text" v-model="name">
        </p>
        <label class="label">Thresh: (Only show repos above this threshold)</label>
        <p class="control">
          <input class="input" type="text" v-model="thresh">
        </p>
        <label class="label">Limit: (Only show this many repos)</label>
        <p class="control">
          <input class="input" type="text" v-model="limit">
        </p>
        <p class="control">
          <button class="button is-primary" @click="fetchUser">Search</button>
        </p>
      </div>
    </div>
    <div class="data has-text-centered">
      <p class="total" v-if="vTotal">total: <span class="total-number" v-text="vTotal"></span>  ⭐</p>
      <ul class="rank has-text-left">
        <li v-for="item in vRepos" v-if="vRepos"><a :href="item.url" target="_blank"><span class="name">{{item.name}}</span></a>{{item.star}}  ⭐</li>
      </ul>
      <div class="block share" v-if="vRepos">
        <social-sharing :url="link" :title="title" inline-template>
        <div>
            <span>Share to:</span>
            <network network="facebook">
              <i class="fa fa-facebook"></i> Facebook
            </network>
            <network network="twitter">
              <i class="fa fa-twitter"></i> Twitter
            </network>
            <network network="googleplus">
              <i class="fa fa-google-plus"></i> Google +
            </network>
            <network network="pinterest">
              <i class="fa fa-pinterest"></i> Pinterest
            </network>
            <network network="reddit">
              <i class="fa fa-reddit"></i> Reddit
            </network>
            <network network="linkedin">
              <i class="fa fa-linkedin"></i> LinkedIn
            </network>
            <network network="whatsapp">
              <i class="fa fa-whatsapp"></i> Whatsapp
            </network>
        </div>
      </social-sharing>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import { isEmptyObject, getSessionStorage, setSessionStorage } from '../util/util'
  import NProgress from 'nprogress'
  import queryString from 'query-string'
  import GitHubBadge from 'vue-github-badge'

  const fixRate = '?client_id=60d16794dabd9b52de64&client_secret=5a60e7ab2dd5135ab1cf28bf43482e1f3d15b8a5';

  export default {
    name: 'app',
    data() {
      return {
        name: '',
        limit: 10,
        thresh: 1,
        total: 0,
        vTotal: null,
        repos: [],
        vRepos: [],
        link: '',
        title: ''
      }
    },
    created() {
      var parsed = queryString.parse(location.search)

      if (isEmptyObject(parsed)) {
        return
      }

      this.limit = parsed.limit
      this.thresh = parsed.thresh
      this.name = parsed.name
      this.fetchUser()
    },
    methods: {
      fetchUser() {
        this.repos = []
        this.vRepos = []
        this.vTotal = null;
        this.total = 0
        if (!this.name) {
          this.errorHandler('Your GitHub name is empty!')
          return
        }

        if (getSessionStorage(this.name)) {
          this.repos = getSessionStorage(this.name)
          this.filter(this.repos)
          return
        }

        // start ajax progresss
        NProgress.inc()

        axios.get(`https://api.github.com/users/${this.name}${fixRate}`)
        .then((response) => {
          var totalRepos = response.data.public_repos
          if (!totalRepos) {
            this.errorHandler('Repo is empty!')
            NProgress.done()
            return
          }
          var pages = Math.ceil( totalRepos / 100)
          while(pages--) {
            this.fetchRepos(pages + 1)
          }
        })
        .catch((error) => {
          NProgress.done()
          this.errorHandler()
        });
      },
      fetchRepos(page) {
        axios.get(`https://api.github.com/users/${this.name}/repos${fixRate}&per_page=100&page=${page}`)
        .then((response) => {
          this.saveReposData(response.data)
          if (page === 1) {
            this.filter(this.repos)
            this.vTotal = this.total
            this.title = document.title = `😎 WOW, ${this.name} got a total of ${this.vTotal} GitHub stars`
            this.link = location.origin + `?name=${this.name}&limit=${this.limit}&thresh=${this.thresh}`
            setSessionStorage(this.name, this.repos) // save data to SessionStorage
            NProgress.done()
          }
        })
        .catch((error) => {
          NProgress.done()
          this.errorHandler()
        });
      },
      saveReposData(repos) {
        repos.forEach((repo) => {
          this.total += repo.stargazers_count
          this.repos.push({
            name: repo.name,
            star: repo.stargazers_count,
            url: repo.html_url
          })
        })
      },
      filter(arr) {
        var newArr = arr.filter((value) => {
          return value.star >= this.thresh
        })

        newArr.sort((a, b) => {
          return b.star - a.star
        })

        this.vRepos = newArr.slice(0, this.limit)
      },
      errorHandler(text) {
        text = text || "Something wrong, Please try again!"
        this.$toasted.show(text, {
          theme: "bubble",
          position: "top-center",
          duration : 1000
        });
      }
    },
    components: {
      'github-badge': GitHubBadge
    }
  }
</script>

<style lang="scss">
  @import '../../node_modules/nprogress/nprogress.css';

  html, body, #app {
    height: 100%;
  }
  body {
    background-color: #fff;
    margin: 0;
  }
  * {
    box-sizing: border-box;
  }
  #app {
    max-width: 800px;
    &.section {
      margin: 0 auto;
      padding-top: 0;
    }
    .column {
      margin: 0 auto;
    }
  }
  .rank {
    max-width: 285px;
    margin: 0 auto;
    li {
      margin: 10px 0;
    }
    .name {
      display: inline-block;
      min-width: 70%;
    }
  }
  #nprogress {
    .bar {
      background: #00c4a7;
    }
    .peg {
      box-shadow: 0 0 10px #00c4a7, 0 0 5px #00c4a7
    }
  }
  .share {
    margin-top: 80px;
    span {
      cursor: pointer;
    }
  }
  .g-title {
    font-family: billabong, 'billabongregular';
    text-align: center;
    font-weight: 100;
    font-size: 100px;
    margin: 20px 0;
    letter-spacing: -1px;
    text-shadow: 0px 4px 0 rgba(18, 86, 136, 0.11);
    a {
      color: blue;
      text-decoration: none;
      &:focus {
        outline: 0;
      }
    }
  }

  @font-face {
      font-family: 'billabongregular';
      src: url('https://cdn.rawgit.com/milktronics/beaglegr.am/master/public/fonts/billabong-webfont.eot');
      src: url('https://cdn.rawgit.com/milktronics/beaglegr.am/master/public/fonts/billabong-webfont.eot?#iefix') format('embedded-opentype'),
          url('https://cdn.rawgit.com/milktronics/beaglegr.am/master/public/fonts/billabong-webfont.woff') format('woff'),
          url('https://cdn.rawgit.com/milktronics/beaglegr.am/master/public/fonts/billabong-webfont.ttf') format('truetype'),
          url('https://cdn.rawgit.com/milktronics/beaglegr.am/master/public/fonts/billabong-webfont.svg#billabongregular') format('svg');
      font-weight: normal;
      font-style: normal;

  }
</style>
