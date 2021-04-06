<template>
    <div id="app">
        <div id="nav" class="container">
            <router-link to="/">Home</router-link> |
            <router-link to="/create">Create</router-link> |
            <router-link to="/edit">Edit</router-link>
        </div>
    <router-view/>
    <footer class="footer mt-auto py-3 bg-light">
        <div class="container text-center">
            <span class="text-muted"><a href="https://github.com/logankimbs/cp4" target="blank">GitHub</a></span>
        </div>
    </footer>
    </div>
</template>

<style>
#app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}

#nav {
    padding: 30px 12px;
}

#nav a {
    color: #2c3e50;
    text-decoration: none;
}

#nav a.router-link-exact-active {
    color: #007bff;
}
</style>
