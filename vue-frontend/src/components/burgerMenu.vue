<template>
    <div class="sidebar text-xs relative" v-if="window.width < 480">
        <div class="flex flex-wrap">
            <div @click="isMenuOpen = !isMenuOpen" class="flex items-center gap-2 duration-200 hover:bg-gray-50 py-1 px-1 rounded">
                <Icn class="w-7 h-7 fill-current text-[#03A9F4]" :class="[isMenuOpen ? 'rotate-45' : '']"  :name="isMenuOpen ? 'plus' : 'menu'" />
                <div class="text-[#03A9F4] text-lg font-medium"> Menu </div>
            </div>
        </div>
        <div v-show="isMenuOpen" @click="isMenuOpen = false" class="fixed inset-0 h-full bg-black opacity-5 w-full z-10"></div>
        <div class="absolute bg-white border-0 border-t border-gray-100 -top-2 -left-2 overflow-hidden duration-200"
            style="z-index: 300;height: 100vh;" :style="{ width: isMenuOpen ? '16rem' : '0px' }">
            <div class="w-full h-full flex flex-col justify-between overflow-hidden">
                <div class="w-full flex flex-col gap-1 p-5">
                    <div @click="isMenuOpen = !isMenuOpen" class="flex items-center w-full justify-between border-0 border-b border-gray-300 mb-5 pb-3">
                        <div class="w-full whitespace-nowrap text-[#03A9F4] text-base font-bold"> Menu </div>

                        <div class="flex">
                            <Icn name="plus" class="fill-current rotate-45 w-7 h-7 text-[#03A9F4]" />
                        </div>
                    </div>
                    <span v-for="(menuItem, index) in menuItems" :key="index"  @click="toggleMenu( menuItem )"> 
                        <li>
                            <a class="relative " :class="[isSelectedMenu(menuItem) ? 'text-[#03A9F4]' : 'text-gray-500']">
                                <span>
                                    <icn :name="menuItem.icon" class="fill-current icn" />
                                </span>
                                <span class="links_name" @click="menuItem === showSubMenu ? (showSubMenu = null) : (showSubMenu = menuItem)">
                                    {{ menuItem.name }}
                                </span>
                                <span class="absolute right-2"
                                    @click="menuItem === showSubMenu ? (showSubMenu = null) : (showSubMenu = menuItem)" v-if="isMenuOpen">
                                    <icn name="chevron" :class="menuItem === showSubMenu && 'rotate-180'" class="w-3 h-3 fill-current" />
                                </span>
                            </a>
                            <div class="pl-2" v-if="isMenuOpen">
                                <ul class="flex flex-col text-gray-500 " :class="[{ 'hidden': menuItem !== showSubMenu }]">
                                    <li v-for="(child, index) in menuItem.children" :key="index" @click="path = child.link"
                                        v-if="checkPermission(child.permission)">
                                        <RouterLink class="pl-6 py-2" active-class="active"
                                            :class="[path === child.link ? 'text-[#03A9F4] border-l-2 border-[#03A9F4]' : 'text-gray-500 border-l border-gray-500']"
                                            :to="child.link">
                                            {{ child.name }}
                                        </RouterLink>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </span>
                </div>
                <div @click="logout()" class="flex  px-3 py-2 bg-white items-center text-gray-500 gap-2 duration-200 hover:bg-gray-100 border-0 border-gray-200 border-t">
                    <icn name="exit" class="h-4 w-4 fill-current" /> 
                    <span class="text-xs font-medium leading-6">déconnexion</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default{
        name:'burger-menu-mobile',
        data(){
            return {
                window: {
                    width: window.innerWidth,
                    height: window.innerHeight
                },
                menuItem: null,
                path: null,
                showSubMenu: {},
                isMenuOpen : false,
                menuItems:[
                    {
                        name: 'Dashboard',
                        icon: 'dashboard-n',
                        permission: 'dashboard',
                        children: [
                            {
                                link: '/admin/dashboard/driver',
                                name: 'Agent',
                                permission: 'Dashboard_Chauffeur',
                            },
                            {
                                link: '/admin/dashboard/customer',
                                name: 'Client',
                                permission: 'Dashboard_Client',
                            },
                        ]
                    },
                    {
                        name: 'Utilisateur',
                        icon: 'users-n',
                        children: [
                            {
                                link: '/admin/registration/agents',
                                name: 'Nouveaux inscrits : Agents',
                                permission: 'Utilisateur_Agent_Nouveau_inscrit'
                            },
                            {
                                link: '/admin/registration/clients',
                                name: 'Nouveaux inscrits : Clients',
                                permission: 'Utilisateur_Client_Nouveau_inscrit'
                            },
                        ]
                    },
                    {
                        name: 'Support',
                        icon: 'support-n',
                        children: [
                            {
                                link: '/admin/support/complaints',
                                name: 'Réclamation',
                                permission: 'Support_Réclamation'
                            },
                            {
                                link: '/admin/support/sos',
                                name: 'Appel SOS',
                                permission: 'Support_Appel_SOS'
                            },
                            {
                                link: '/admin/support/chats',
                                name: 'Chat',
                                permission: 'Support_Chat'
                            }
                        ]
                    },
                ]
            }
        },
        created() {
            this.path = this.$route.path
            window.addEventListener('resize', this.handleResize);

        },
        destroyed() {
            window.removeEventListener('resize', this.handleResize);
        },

        methods:{
            logout() {
                window.localStorage.removeItem('x-auth-token')
                window.localStorage.removeItem('x-refresh-token')
                this.$router.push({ name: "login"});
            },
            toggleMenu(value){
                this.menuItem === value ? (this.isMenuOpen = false , this.menuItem = null, this.showSubMenu = null) : (this.isMenuOpen = true , this.menuItem = value, this.showSubMenu = value)
            },
            checkChildren(payload){
                if(this.$store.state.user.type === 'SOUS_ADMIN'){
                    let check = payload.children.some(el => {
                        return this.$store.state.user.role.permissions.includes(el.permission)
                    })
                    return check
                }
                return true   
            },
            isSelectedMenu(value) {
                return value.children.filter(el => this.path.includes(el.link)).length > 0 ?  true : false
            },
            handleResize() {
                this.window.width = window.innerWidth;
                this.window.height = window.innerHeight;
            },
        }
    }
</script>
<style scoped>
.sidebar li a {
    display: flex;
    justify-items: center ;
    gap: 10px;
    height: 100%;
    width: 100%;
    align-items: center;
    text-decoration: none;
    transition: all 0.2s ease;
    background: white;
}
.sidebar li {
    position: relative;
    /* margin: 5px 0; */
    list-style: none;
}

.sidebar li .links_name {
    font-weight: 400;
    white-space: nowrap;
    transition: all 0.2s ease;
}

.sidebar.open li .links_name {
    opacity: 1;
}


.sidebar li i,
.icn {
    height: 50px;
    line-height: 50px;
    /* font-size: 18px; */
    border-radius: 12px;
}
</style>