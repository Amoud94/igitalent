<template>
    <div class="min-vh-100" style="background-color: #508bfc;">
        <div class="container py-5 h-100">
            <div class="row d-flex justify-content-center align-items-center h-100">
                <div class="col-12 col-md-8 bg-white p-4 rounded">
                    <h3 class="text-lg text-gray-600 font-bold leading-tight pb-4">Create new account</h3>
                    <form>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="firstName">First name</label>
                                <input type="text" class="form-control" id="firstName" placeholder="Firstname"
                                    v-model="user.firstname" @focus="clearValidation('firstname')">
                                <small v-if="errors.firstname" class="text-danger text-xs py-2"> {{ errors.firstname }} </small>

                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="lastName">Last name</label>
                                <input type="text" class="form-control" id="lastName" placeholder="Lastname"
                                    v-model="user.lastname" @focus="clearValidation('lastname')">
                                <small v-if="errors.lastname" class="text-danger text-xs py-2"> {{ errors.lastname }} </small>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="username">Email</label>
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">@</span>
                                </div>
                                <input type="text" class="form-control" id="email" placeholder="Email" v-model="user.email" @focus="clearValidation('email')">
                            </div>
                            <small v-if="errors.email" class="text-danger text-xs py-2"> {{ errors.email }} </small>
                        </div>

                        <div class="mb-3">
                            <label for="email">Phone number</label>
                            <input type="email" class="form-control" id="phone" placeholder="Phone number"
                                v-model="user.phone" @focus="clearValidation('phone')">
                            <small v-if="errors.phone" class="text-danger text-xs py-2"> {{ errors.phone }} </small>
                        </div>

                        <div class="mb-3">
                            <label for="username">Address</label>
                            <input type="text" class="form-control" id="address" placeholder="Addresss"
                                v-model="user.address" @focus="clearValidation('address')">
                            <small v-if="errors.address" class="text-danger text-xs py-2"> {{ errors.address }} </small>
                        </div>

                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="firstName">Password</label>
                                <input class="form-control" id="password" type="password" placeholder="Enter Password"
                                    v-model="user.password" @focus="clearValidation('password')">
                                <small v-if="errors.password" class="text-danger text-xs py-2"> {{ errors.password }} </small>

                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="lastName">Confirm Password</label>
                                <input class="form-control" id="confirmed_password" type="password"
                                    placeholder="Confirm Password" v-model="user.confirmedPassword" @focus="clearValidation('confirmedPassword')">
                                <small v-if="errors.confirmedPassword" class="text-danger text-xs py-2"> {{ errors.confirmedPassword }} </small>

                            </div>
                        </div>
                        <small v-if="errors.missMatching" class="text-danger text-xs py-2"> {{ errors.missMatching }} </small>

                        <hr class="mb-4">

                    </form>

                    <p class="mt-8 text-sm text-gray-500"> You have already acounts ?
                        <RouterLink class="text-indigo-600 hover:text-indigo-700 font-semibold" to="/">Login in
                        </RouterLink>
                    </p>

                    <div @click="register">
                        <button type="submit" class="w-100 btn btn-primary">Register</button>
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
                countries: true,
                submit: false
            },
            countries: [],
            user: {
                firstname: undefined,
                lastname: undefined,
                email: undefined,
                phone: undefined,
                address: undefined,
                password: undefined,
                confirmedPassword: undefined,
            },
            errors: {}
        }
    },
    created() {
    },
    methods: {
        validateEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },
        async register() {
            this.loading.submit = true;
            this.errors = {};
            try {
                const _valid = this.isValid()
                if(_valid){
                    const resp = await this.$http.post("/users/register", this.user);
                    this.$store.dispatch('setUser', resp.data.user);
                    window.localStorage.setItem("x-auth-token", resp.data.accessToken);
                    window.localStorage.setItem("x-refresh-token", resp.data.refreshToken);
                    this.loading.submit = false;
                    this.$router.push({name:'home'})
                    this.$store.dispatch('setLoadingOverlay', true)
                }else{
                    this.$toast.error('Please make sure to fill all the required fields', {
                        position: "top-center",
                        timeout: 5000,
                    });
                }
            } catch (error) {
                console.log(error);
                if (typeof error?.response?.data == "object"){
                    this.$toast.error(error?.response?.data, {
                        position: "top-center",
                        timeout: 5000,
                    });
                }
            }
        },
        clearValidation(key){
            this.errors[key] = undefined
        },  
        isValid() {
            let valid = true
            if (this.user.firstname == '' || this.user.firstname == null || !this.user.firstname) {
                this.$set(this.errors, 'firstname', 'Firstname required');
                valid = false;
            }
            if (this.user.lastname == '' || this.user.lastname == null || !this.user.lastname ) {
                this.$set(this.errors, 'lastname', 'Lastname required');
                valid = false;
            }
            if (this.user.phone == '' || this.user.phone == null) {
                this.$set(this.errors, 'phone', 'Phone required');
                valid = false;
            }
            if (this.user.email == '' || this.user.email == null || !this.validateEmail(this.user.email) || !this.user.email ) {
                this.$set(this.errors, 'email', 'Email required');
                valid = false;
            }
            if (this.user.address == '' || this.user.address == null || !this.user.address) {
                this.$set(this.errors, 'address', 'Address required');
                valid = false;
            }
            if (this.user.password == '' || this.user.password == null || !this.user.password) {
                this.$set(this.errors, 'password', 'Password required');
                valid = false;
            }
            if (this.user.confirmedPassword == '' || this.user.confirmedPassword == null || !this.user.confirmedPassword) {
                this.$set(this.errors, 'confirmedPassword', 'Confirmed password required');
                valid = false;
            }
            if (this.user.confirmedPassword && this.user.password && this.user.confirmedPassword != this.user.password) {
                this.$set(this.errors, 'missMatching', 'Passwords does not match');
                valid = false;
            }
            return valid
        }
    },
}
</script>