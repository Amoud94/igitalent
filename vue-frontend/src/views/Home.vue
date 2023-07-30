<template>
    <div class="d-flex flex-column">
        <div class="w-100 d-flex align-items-center justify-content-center pt-4">
            <h1 class="text-lg text-gray-600 font-bold leading-tight">Welcome {{ user.firstname + ' ' +
                user.lastname.toUpperCase() }}</h1>
        </div>
        <div class="w-100 d-flex flex-column flex-md-row mt-4">
            <div class="w-100 align-self-stretch card mr-md-2 mb-2">
                <div class="card-header">
                    Personal Information :
                </div>
                <div class="card-body">
                    <form>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="firstName">First name</label>
                                <input type="text" class="form-control" id="firstName" :value="user.firstname" disabled>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="lastName">Last name</label>
                                <input type="text" class="form-control" id="lastName" :value="user.lastname" disabled>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="username">Email</label>
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">@</span>
                                </div>
                                <input type="text" class="form-control" id="email" :value="user.email" disabled>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="email">Phone number</label>
                            <input type="email" class="form-control" id="phone" :value="user.phone" disabled>
                        </div>

                        <div class="mb-3">
                            <label for="username">Address</label>
                            <input type="text" class="form-control" id="address" :value="user.address" disabled>
                        </div>


                        <hr class="mb-4">

                    </form>

                </div>
            </div>

            <div class="w-100 align-self-stretch card ml-md-2 mb-2">
                <div class="card-header">
                    Login history :
                </div>
                <div class="card-body">
                    <line-chart :chart-data="chartData" :chart-options="chartOptions"></line-chart>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import LineChart from "@/components/charts/Line.vue";

export default {
    name: 'home-page',
    components: { LineChart },
    data() {
        return {
            user: null,
            chartData: {},
            chartOptions: {}
        }
    },

    created() {
        this.init()
    },

    methods: {
        init() {

            this.user = this.$store.getters['getUser']
            const groupedData = this.groupDataByTime(this.user.loginHistory);
            const labels = Object.keys(groupedData);
            const data = Object.values(groupedData);

            this.chartData = {
                labels: labels,
                datasets: [
                    {
                        label: "Logins",
                        borderColor: "rgba(75, 192, 192, 1)",
                        backgroundColor: "rgba(75, 192, 192, 0.2)",
                        data: data,
                    },
                ],
            };

            this.chartOptions = {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        offset: true,
                        beginAtZero: true
                    }
                },
            };
            this.$store.dispatch('setLoadingOverlay', false)
        },
        groupDataByTime(data) {
            const groupedData = {};
            data.sort((a, b) => this.$moment(a.time).diff(this.$moment(b.time))).forEach((item) => {
                const time = item.time.split("T")[0];
                if (groupedData[time]) {
                    groupedData[time]++;
                } else {
                    groupedData[time] = 1;
                }
            });
            return groupedData;
        },
    },
}
</script>