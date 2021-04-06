<template>
    <div class="container">
        <div class="mb-3">
            <h1>Create</h1>
            <p>Would you like to create a new author or use existing?</p>
            <button class="btn btn-primary me-1" @click="createNew">Create New</button>
            <button class="btn btn-primary" @click="useExisting">Use Existing</button>
        </div>

        <div v-if="createNewAlley">
            <div class="mb-3">
                <label for="authorsName" class="form-label">Authors Name:</label>
                <input type="text" class="form-control" v-model="newAuthor">
            </div>
            <button class="btn btn-primary" @click="createNewAuthor">Create</button>
        </div>

        <div v-else-if="useExistingAlley">
            <div class="btn-group btn-group-sm mb-3" role="group" aria-label="Basic example">
                <button type="button" class="btn btn-outline-primary" v-for="author in authors" :key="author.id" @click="setCurrentAuthor(author)">{{author.name}}</button>
            </div>

            <div v-if="currentAuthor">
                <div class="mb-3">
                    <label for="authorsName" class="form-label">Authors Name:</label>
                    <input type="text" class="form-control" :value="this.currentAuthor.name" disabled>
                </div>
                <div class="mb-3">
                    <label for="authorsName" class="form-label">Title:</label>
                    <input type="text" class="form-control" v-model="title">
                </div>
                <div class="mb-3">
                    <label class="form-label" for="inputGroupFile01">Cover Photo:</label>
                    <input type="file" class="form-control" name="photo" @change="setFile">
                </div>
                <div class="mb-3">
                    <textarea class="form-control" placeholder="Add cool content..." v-model="content"></textarea>
                </div>
                <div class="mb-3">
                    <label for="authorsName" class="form-label">Tag:</label>
                    <input type="text" class="form-control" v-model="tag">
                </div>
                <button type="button" class="btn btn-primary" @click="createArticle">Create</button>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import moment from 'moment';

    export default {
        name: 'Create',

        data() {
            return {
                createNewAlley: null,
                useExistingAlley: null,

                newAuthor: '',
                authors: [],
                currentAuthor: '',
                title: '',
                file: null,
                content: '',
                tag: ''
            }
        },

        created() {
            this.getAuthors();
        },

        methods: {
            createNew() {
                this.createNewAlley = true;
                this.useExistingAlley = false;
                this.currentAuthor = null;
                this.title = '';
                this.file = null;
                this.content = '';
                this.tag = '';
            },

            async createNewAuthor() {
                if (this.newAuthor === '') {  return  }
                try {
                    await axios.post('/api/authors', {  name: this.newAuthor  });
                    this.getAuthors();
                    this.newAuthor = '';
                } catch (error) {  console.log(error);  }
            },

            useExisting() {
                this.createNewAlley = false;
                this.useExistingAlley = true;
                this.newAuthor = '';
            },

            async getAuthors() {
                try {
                    let response = await axios.get('/api/authors');
                    this.authors = response.data;
                } catch (error) {  console.log(error);  }
            },

            setCurrentAuthor(author) {
                this.currentAuthor = author;
            },

            setFile(event) {
                this.file = event.target.files[0];
            },

            async createArticle() {
                try {
                    let formData = new FormData();
                    formData.append('photo', this.file, this.file.name);
                    let responseOne = await axios.post('/api/photos', formData);
                    await axios.post(`/api/authors/${this.currentAuthor._id}/articles`, {
                        title: this.title,
                        path: responseOne.data.path,
                        content: this.content,
                        tag: this.tag,
                        timestamp: moment().format('MMMM Do YYYY')
                    });
                    this.title = '';
                    this.path = null;
                    this.content = '';
                    this.tag = '';
                } catch (error) {  console.log(error);  }
            }
        }
    }
</script>

<style scoped>

</style>