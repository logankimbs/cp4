<template>
    <div class="container">
        <h1>Edit</h1>
        <p>Whose article would you like to edit?</p>
        <div class="btn-group mb-3" role="group" aria-label="Basic example">
            <button type="button" class="btn btn-outline-primary" v-for="author in authors" :key="author.id" @click="setCurrentAuthor(author)">{{author.name}}</button>
        </div>

        <div v-if="currentAuthor">
            <div v-if="articles.length != 0">
                <div class="mb-3">
                    <p>Select the article to edit.</p>
                    <button class="btn btn-outline-success btn-sm me-1" @click="setCurrentArticle(article)" v-for="article in articles" :key="article.id">{{article.title}}</button>
                </div>
                <div class="mb-3" v-if="currentArticle">
                    <div class="mb-3">
                        <label for="authorsName" class="form-label">Authors Name:</label>
                        <input type="text" class="form-control" :value="this.currentAuthor.name" disabled>
                    </div>
                    <div class="mb-3">
                        <label for="authorsName" class="form-label">Title:</label>
                        <input type="text" class="form-control" v-model="currentArticle.title">
                    </div>
                    <div class="mb-3">
                        <textarea class="form-control" placeholder="Add cool content..." v-model="currentArticle.content"></textarea>
                    </div>
                    <div class="mb-3">
                        <label for="authorsName" class="form-label">Tag:</label>
                        <input type="text" class="form-control" v-model="currentArticle.tag">
                    </div>
                    <button class="btn btn-primary me-1" @click="editArticle(currentArticle)">Edit</button>
                    <button class="btn btn-danger" @click="deleteArticle(currentArticle)">Delete</button>
                </div>
            </div>
            <div v-else>
                <p class="text-danger"><b>{{this.currentAuthor.name}}</b> has not written an article yet.</p>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        name: 'Edit',

        data() {
            return {
                authors: [],
                currentAuthor: null,
                currentArticle: null,
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
                } catch (error) {  /* console.log(error); */  }
            },

            setCurrentAuthor(author) {
                this.currentAuthor = null;
                this.currentArticle = null;
                this.currentAuthor = author;
                this.getCurrentArticles(author);
            },

            async getCurrentArticles(author) {
                try {
                    let response = await axios.get(`/api/authors/${author._id}/articles`);
                    this.articles = response.data;
                } catch (error) {  /* console.log(error); */  }
            },

            setCurrentArticle(article) {
                this.currentArticle = null;
                this.currentArticle = article;
            },

            async editArticle(currentArticle) {
                try {
                    await axios.put(`/api/authors/${currentArticle.author._id}/articles/${currentArticle._id}`, {
                        title: this.currentArticle.title,
                        description: this.currentArticle.description,
                        content: this.currentArticle.content,
                        tag: this.currentArticle.tag
                    });
                    this.currentAuthor = null;
                    this.currentArticle = null;
                    this.getArticles();
                    return true;
                } catch (error) {  /* console.log(error); */  }
            },

            async deleteArticle(currentArticle) {
                try {
                    await axios.delete(`/api/authors/${currentArticle.author._id}/articles/${currentArticle._id}`);
                    this.currentArticle = null;
                    this.currentAuthor = null;
                    return true;
                } catch (error) { /* console.log(error); */  }
            }
        }
    }
</script>