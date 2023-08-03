<template>
    <div class="vh-100" style="background-color: #508bfc;">
        <div class="container py-5 h-100">
            <div class="row d-flex justify-content-center align-items-center h-100">
                <div class="col-12 col-md-8 col-lg-6 col-xl-5 bg-white">
                    <div class="p-5 d-flex flex-column gap-3">

                        <div class=" mb-10">
                            <label>Email address</label>
                            <input type="email"  class="form-control" v-model="email" @focus="clearValidation('email')">
                            <div v-if="errors.email" class="text-danger text-xs py-2"> {{ errors.email }} </div>

                        </div>

                        <div class=" mb-10">
                            <label>Password</label>
                            <input type="password" class="form-control" v-model="password" @focus="clearValidation('password')">
                            <div v-if="errors.password" class="text-danger text-xs py-2"> {{ errors.password }} </div>
                        </div>
                        <div class="py-2 w-100">
                            <button type="submit" class="w-100 btn btn-primary" @click="login">Sing in</button>
                        </div>
                        <div class="py-2" @click="$router.push({ name: 'register' })">
                            <p>Don't have an account? <span class="fw-bold text-primary" style="cursor: pointer;">Sign  Up</span> </p>
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
            email: undefined,
            password: undefined,
            errors: {
                email: undefined,
                password: undefined
            }
        }
    },
    watch:{
        "errors.email": function(newVal, oldVal){
            newVal != undefined ?  this.$toast.error(newVal, {
                            position: "top-center",
                            timeout: 5000,
                        }) : ''
        },
        "errors.password": function(newVal, oldVal){
            newVal != undefined ?  this.$toast.error(newVal, {
                            position: "top-center",
                            timeout: 5000,
                        }) : ''
        }
    },
    methods: {
        validateEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },
        async login() {
            const _valid = this.isValid()
            if (_valid) {
                try {
                    this.$store.dispatch('setLoadingOverlay', true)
                    const resp = await this.$http.post("/users/login", { email : this.email, password: this.password });
                    if (resp.status) {
                        this.$store.dispatch('setUser', resp.data.user);
                        window.localStorage.setItem("x-auth-token", resp.data.accessToken);
                        window.localStorage.setItem("x-refresh-token", resp.data.refreshToken);
                        this.$router.push({ name: "home" });
                    }
                } catch (error) {
                    console.log(error)
                    this.$store.dispatch('setLoadingOverlay', false)
                    if (typeof error?.response == "object") {
                        this.$toast.error(error?.response?.data, {
                            position: "top-center",
                            timeout: 5000,
                        });
                    }
                }

            }
        },
        clearValidation(key) {
            this.errors[key] = undefined
        },
        isValid() {
            let valid = true;
            if (this.password == '' || !this.password || this.password == null || (this.password && this.password.length < 3)) {
                this.$set(this.errors, 'password', 'password required');
                valid = false;
            }
            if (this.email == '' || this.email == null || !this.email) {
                this.$set(this.errors, 'email', 'Email required');
                valid = false;
            }
            return valid;
        },
    },
}
    //login
</script>