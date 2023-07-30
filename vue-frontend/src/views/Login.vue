<template>
    <!-- <div class="w-100">
        <h1 class="text-lg text-gray-600 font-weight-bold leading-tight mt-12">Log in to your account</h1>
        <button type="button"
            class="w-100 btn btn-outline-primary mt-4 hover:bg-gray-50 duration-300 font-weight-semibold rounded-lg px-4 py-3 border border-gray-300">
            <div class="d-flex items-center justify-content-center gap-4">
                <Icn name="google" class="w-5 h-5" />
                <span class="text-gray-600">Log in with Google</span>
            </div>
        </button>
        <div class="my-6 bg-gray-200 w-100 h-px position-relative">
            <div class="position-absolute text-sm px-3 rounded center_label font-weight-medium bg-white text-gray-500">OR
            </div>
        </div>
        <form @submit.prevent="login()" class="mt-6">
            <div>
                <label class="text-gray-700">Email Address</label>
                <input type="email" v-model="user.email" id="email" name="email" placeholder="Enter Email Address"
                    class="w-100 form-control rounded-lg bg-gray-50 mt-2 border border-gray-100 focus:border-indigo-500 focus:bg-white focus:outline-none"
                    required>
                <small v-if="errors.email" class="text-danger text-xs px-2"> {{ errors.email | t }} </small>
            </div>
            <div class="mt-4">
                <label class="text-gray-700">Password</label>
                <input type="password" name="password" v-model="user.password" placeholder="Enter Password" minlength="6"
                    class="w-100 form-control rounded-lg bg-gray-50 mt-2 border border-gray-100 focus:border-indigo-500 focus:bg-white focus:outline-none"
                    required>
                <small v-if="errors.password" class="text-danger text-xs px-2"> {{ errors.password | t }} </small>
            </div>

            <div class="text-right mt-2">
                <div to="/recovery"
                    class="text-sm font-weight-medium text-gray-700 hover:text-indigo-700 focus:text-indigo-700">
                    Forgot Password?
                </div>
            </div>

            <button type="submit" :disabled="loading.submit"
                class="w-100 btn btn-primary disabled:opacity-50 font-weight-semibold rounded-lg px-4 py-3 mt-6">
                Log In
            </button>
            <small v-if="errors.global" class="text-danger text-xs px-2"> {{ errors.global | t }} </small>
        </form>
        <div class="mt-8 text-sm text-gray-500">
            Need an account?
            <RouterLink class="text-indigo-600 hover:text-indigo-700 font-weight-semibold" to="/register">Create an account
            </RouterLink>
        </div>
    </div> -->
    <div class="vh-100" style="background-color: #508bfc;">
        <div class="container py-5 h-100">
            <div class="row d-flex justify-content-center align-items-center h-100">
                <div class="col-12 col-md-8 col-lg-6 col-xl-5 bg-white">
                    <div class="p-5 d-flex flex-column gap-3">

                        <div class="form-group mb-10">
                            <label for="exampleInputEmail1">Email address</label>
                            <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" v-model="user.email">
                        </div>

                        <div class="form-group mb-10">
                            <label for="exampleInputPassword1">Password</label>
                            <input type="password" class="form-control" id="exampleInputPassword1" v-model="user.password">
                        </div>
                        <div class="py-2 w-100">
                            <button type="submit" class="w-100 btn btn-primary" @click="login">Sing in</button>
                        </div>
                        <div class="py-2" @click="$router.push({ name: 'register'})">
                            <p>Don't have an account? <span class="fw-bold text-primary" style="cursor: pointer;">Sign Up</span> </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            loading: {
                submit: false
            },
            user: {
                email: undefined,
                password: undefined
            },
            errors: {}
        }
    },
    mounted() { },
    methods: {
        async login() {
            this.$store.dispatch('setLoadingOverlay', true)
            this.loading.submit = true;
            this.errors = {};
            this.alert = undefined;
            if (this.validatForm(this.user)) {
                try {
                    const resp = await this.$http.post("/users/login", this.user);
                    if (resp.status) {
                        this.$store.dispatch('setUser', resp.data.user);
                        window.localStorage.setItem("x-auth-token", resp.data.accessToken);
                        window.localStorage.setItem("x-refresh-token", resp.data.refreshToken);
                        this.$router.push({ name: "home"});
                    }
                } catch (error) {
                    console.log(error);
                    this.loading.submit = false;
                }

            }
        },
        validatForm(user) {
            let valid = true;
            if (!user.password || user.password && user.password.length < 3) {
                this.errors.password = "invalid_password";
                valid = false;
            }
            if (!user.email || user.email && user.email.length < 3) {
                this.errors.email = "invalid_email";
                valid = false;
            }
            return valid;
        },
    },
}
    //login
</script>