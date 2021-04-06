<template>
    <div class="container">
        <div class="mb-3">
            <h1>Home</h1>
            <p>Choose your favorite author to view their work.</p>
            <div class="btn-group mb-3" role="group" aria-label="Basic example">
                <button type="button" class="btn btn-outline-primary" v-for="author in authors" :key="author.id" @click="setCurrentAuthor(author)">{{author.name}}</button>
            </div>
        </div>

        <div v-if="currentAuthor">
            <div v-if="this.articles.length != 0">
                <div class="blog-post-wrapper" v-for="article in articles" :key="article.id">
                    <article class="blog-post">
                        <h2>{{article.title}}</h2>
                        <p class="text-muted">{{article.timestamp}} by {{article.author.name}}</p>
                        <img :src="article.path" class="img-fluid rounded mx-auto d-block" alt="...">
                        <p>{{article.content}}</p>
                        <span class="badge capitalize bg-primary">{{article.tag}}</span>
                    </article>
                    <hr>
                </div>
            </div>
            <div v-else>
                <p>{{this.currentAuthor.name}} has not written an article yet.</p>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        name: 'Home',

        data() {
            return {
                authors: [],
                currentAuthor: null,
                articles: []
            }
        },

        created() {
            this.getAuthors();
        },

        methods: {
            async getAuthors() {
                try {
                    let response = await axios.get('/api/authors');
                    this.authors = response.data;
                } catch (error) {  console.log(error);  }
            },

            setCurrentAuthor(author) {
                this.currentAuthor = author;
                this.getCurrentArticles(author);
            },

            async getCurrentArticles(author) {
                try {
                    let response = await axios.get(`/api/authors/${author._id}/articles`);
                    this.articles = response.data;
                } catch (error) {  console.log(error);  }
            }
        }
    }
</script>

<style scoped>
.blog-post-wrapper {
    margin-bottom: 64px;
}

img {
    margin-bottom: 36px;
}
</style>