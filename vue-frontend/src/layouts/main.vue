<template>
    <div>
        <!-- Loading Component -->
        <Loading :isActive="loadingOverlay" />
        <!-- Fixed Header -->
        <div id="fixed_header" class="fixed-top">
            <div v-if="showDropdown" @click="toggleDropdown" class="position-fixed top-0 right-0 bottom-0 left-0 z-index-10" style="height: 100vh; width: 100vw;"></div>
            <nav class="navbar navbar-light bg-light">
                <a class="navbar-brand">LOGO</a>
                <div class="d-flex flex-row align-items-center p-2">
                    <div @click="toggleDropdown" style="cursor: pointer;"
                        class=" w-7 h-7 rounded-circle bg-primary d-flex align-items-center justify-content-center shadow">
                        <div class="text-white text-center text-uppercase p-2" v-if="user">
                            {{ `${user.firstname ? user.firstname.charAt(0) : ''}${user.lastname ? user.lastname.charAt(0) : ''}` }}
                        </div>
                        <div v-if="showDropdown" class="position-relative z-index-20">
                            <div class="px-3 py-2 position-absolute logout d-flex align-items-center" @click="logout">            
                                <icn class="fill-current w-6 h-6 " name="logout" />
                                <span class="pl-2"> Logout </span> 
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </div>

        <!-- Main Container -->
        <div id="main_container" class="w-100 pt-5">
            <div id="main_page" class="w-100 position-relative p-2 p-md-4">
                <transition name="fade" mode="out-in">
                    <RouterView />
                </transition>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'main-layout',
    data() {
        return {
            showDropdown: false,
            dropDownMenu: {},
            window: {
                width: window.innerWidth,
                height: window.innerHeight
            },
        }
    },
    computed: {
        loadingOverlay() {
            return this.$store.state.loadingOverlay
        },
        user() {
            return this.$store.state.user
        },
    },
    destroyed() {
        window.removeEventListener('resize', this.handleResize);
    },

    created() {

    },
    methods: {
        toggleDropdown() {
            this.showDropdown = !this.showDropdown;
            console.log(this.showDropdown)
        },
        logout() {
            window.localStorage.removeItem('x-auth-token')
            window.localStorage.removeItem('x-refresh-token')
            this.$store.dispatch('setUser', null)
            this.$router.push({ name: "login"});
        },
    }
}
</script>

<style>
.logout {
    background-color: white;
    border-radius: 10px;
    top: 10px;
    right: 10px;
}
.z-index-10{
    z-index: 10;
}
.z-index-20{
    z-index: 20;
}
</style>