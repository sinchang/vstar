<template>
  <div id="app" class="section">
    <template>
      <github-badge slug="sinchang/vstar"/>
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
          <button class="button is-primary" @click="fetchData">Search</button>
        </p>
      </div>
    </div>
    <div class="data has-text-centered" v-if="repos.length">
      <p class="total">
        total:
        <span class="total-number" v-text="total"></span> ⭐
      </p>
      <ul class="rank has-text-left">
        <li v-for="(item, index) in repos" :key="index">
          <span>{{ (index + 1)}}.</span>
          <a :href="item.url" target="_blank">
            <span class="name">{{item.name}}</span>
          </a>
          {{item.stars}} ⭐
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { getSessionStorage, setSessionStorage } from "./util";
import NProgress from "nprogress";
import queryString from "query-string";
import GitHubBadge from "vue-github-badge";

const KEY = "vstar";

export default {
  name: "app",
  data() {
    return {
      name: "",
      limit: 10,
      thresh: 1,
      total: 0,
      repos: []
    };
  },
  async created() {
    const { name, limit = 10, thresh = 1 } = queryString.parse(location.search);

    if (!name) {
      return;
    }

    this.limit = limit;
    this.thresh = thresh;
    this.name = name;
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.total = 0;
      this.repos = [];
      const data = getSessionStorage(KEY);
      if (this.name === data.name) {
        this.total = data.total;
        this.repos = this.format(data.repos);
        return;
      }

      NProgress.inc();

      try {
        const pages = await this.getPages();
        const { repos, total } = await this.fetchRepos(pages);
        this.total = total;
        this.repos = this.format(repos);
        setSessionStorage(KEY, { total, repos: this.repos, name: this.name });
        NProgress.done();
      } catch (e) {
        this.showMessage(e.message);
        NProgress.done();
      }
    },
    async getPages() {
      if (!this.name) {
        throw new Error("GitHub name is empty!");
      }

      const {
        data: { public_repos: publicRepos }
      } = await axios.get(`http://api.github.com/users/${this.name}`);

      if (publicRepos === 0) {
        throw new Error("Repo is empty!");
      }

      return Math.ceil(publicRepos / 100);
    },
    async fetchRepo(page) {
      return axios(
        `http://api.github.com/users/${
          this.name
        }/repos?per_page=100&page=${page}`
      );
    },
    async fetchRepos(page) {
      const repos = [];
      let total = 0;

      while (page > 0) {
        const { data } = await this.fetchRepo(page);
        data.forEach((item) => {
          total += item.stargazers_count;
          repos.push({
            name: item.name,
            url: item.html_url,
            stars: item.stargazers_count
          });
        });
        page--;
      }

      return { repos, total };
    },
    format(arr) {
      return arr
        .filter((value) => value.stars >= this.thresh)
        .sort((a, b) => b.stars - a.stars)
        .slice(0, this.limit);
    },
    showMessage(text) {
      this.$toasted.show(text, {
        theme: "bubble",
        position: "top-center",
        duration: 2000
      });
    }
  },
  components: {
    "github-badge": GitHubBadge
  }
};
</script>

<style src="nprogress/nprogress.css"></style>

<style lang="less">
html,
body,
#app {
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
    box-shadow: 0 0 10px #00c4a7, 0 0 5px #00c4a7;
  }
}
.share {
  margin-top: 80px;
  span {
    cursor: pointer;
  }
}
.g-title {
  font-family: billabong, "billabongregular";
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
  font-family: "billabongregular";
  src: url("https://cdn.rawgit.com/milktronics/beaglegr.am/master/public/fonts/billabong-webfont.eot");
  src: url("https://cdn.rawgit.com/milktronics/beaglegr.am/master/public/fonts/billabong-webfont.eot?#iefix")
      format("embedded-opentype"),
    url("https://cdn.rawgit.com/milktronics/beaglegr.am/master/public/fonts/billabong-webfont.woff")
      format("woff"),
    url("https://cdn.rawgit.com/milktronics/beaglegr.am/master/public/fonts/billabong-webfont.ttf")
      format("truetype"),
    url("https://cdn.rawgit.com/milktronics/beaglegr.am/master/public/fonts/billabong-webfont.svg#billabongregular")
      format("svg");
  font-weight: normal;
  font-style: normal;
}
</style>
