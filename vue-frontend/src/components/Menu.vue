<template>
    <div>
        <div v-if="isOpened" @click="isOpened = false" class="fixed inset-0 h-full w-full z-10 "></div>
        <div class="sidebar border-r border-gray-200" :class="isOpened ? 'open' : ''">
            <div style="display: flex ; flex-direction:column; justify-content: space-between; flex-grow: 1; max-height: calc(100% - 35px); ">
                <div id="my-scroll" style="margin:10px 14px;">
                    <ul style="overflow: visible;">
                        <span v-for="(menuItem, index) in searchResult" :key="index" @click="toggleMenu(menuItem)">
                            <li v-if="checkChildren(menuItem)">
                                <a class="relative cursor-pointer" :class="[isSelectedMenu(menuItem) ? 'text-[#03A9F4]' : 'text-gray-500']">
                                    <span>
                                        <icn :name="menuItem.icon" class="icn fill-current" />
                                    </span>

                                    <span v-if="menuItem.link">
                                        <RouterLink active-class="footer-active" :class="[path === menuItem.link ? 'text-[#03A9F4]' : 'text-gray-500']" :to="menuItem.link">
                                            <span @click="path = menuItem.link, $store.dispatch('setLoadingValue', true)" class="links_name">
                                                {{ menuItem.name }}
                                            </span>
                                        </RouterLink>
                                    </span>

                                    <span v-if="menuItem.link === undefined" class="links_name"
                                        @click="menuItem === showSubMenu ? (showSubMenu = null) : (showSubMenu = menuItem)">
                                        {{ menuItem.name }}
                                    </span>

                                    <span class="absolute right-5" @click="menuItem === showSubMenu ? (showSubMenu = null) : (showSubMenu = menuItem)" v-if="isOpened && menuItem.link == undefined">
                                        <icn name="chevron" :class="menuItem === showSubMenu && 'rotate-180'"  class="w-3 h-3 fill-current" />
                                    </span>
                                </a>
                                <div class="pl-6" v-if="isOpened && menuItem.children">
                                    <ul class="flex flex-col text-gray-500 cursor-pointer" :class="[{ 'hidden': menuItem !== showSubMenu }]">
                                        <li v-for="(child, index) in menuItem.children" :key="index"  @click="path = child.link, $store.dispatch('setLoadingValue', true)" v-if="checkPermission(child.permission)">
                                            <RouterLink class="pl-6 py-2 text-sm" active-class="active" :class="[path === child.link ? 'text-[#03A9F4] border-l-2 border-[#03A9F4]' : 'text-gray-500 border-l border-gray-500']" :to="child.link">
                                                {{ child.name }}
                                            </RouterLink>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                        </span>
                    </ul>
                </div>
                <div class="px-6">
                    <hr class="border-gray-700" />
                </div>
                <div style="margin: 0px 14px 0 14px; ">
                    <ul style="overflow: hidden;">
                        <span v-for="(menuItem, index) in footerMenuItems" :key="index" @click="toggleMenu(menuItem)" v-if="checkPermission(menuItem.permission)">
                            <li class="flex items-center cursor-pointer" :class="[menuItem.link.includes(path) ? 'text-[#03A9F4]' : 'text-gray-500']">
                                <span>
                                    <icn :name="menuItem.icon" class="fill-current h-10 w-10 icn" />
                                </span>
                                <RouterLink class="links_name" active-class="footer-active" :to="menuItem.link" v-if="isOpened">
                                    <span @click="path = menuItem.link">{{ menuItem.name }}</span>
                                </RouterLink>
                            </li>
                        </span>
                        <span @click="isOpened = !isOpened">
                            <li class="flex items-center cursor-pointer">
                                <span>
                                    <icn name="logout" class="fill-current h-10 w-10 icn" />
                                </span>
                                <div class="links_name" v-if="isOpened" @click="logout">
                                    <span>Se déconnecter</span>
                                </div>
                            </li>
                        </span>
                    </ul>
                </div>

            </div>
        </div>
    </div>
</template>
  
<script>

export default {
    name: 'SidebarMenu',
    props: {
        //! Menu settings
        isMenuOpen: {
            type: Boolean,
            default: false,
        },
        isPaddingLeft: {
            type: Boolean,
            default: true,
        },
        menuOpenedPaddingLeftBody: {
            type: String,
            default: '270px'
        },
        menuClosedPaddingLeftBody: {
            type: String,
            default: '100px'
        },

        //! Menu items
        menuItems: {
            type: Array,
            default: () => [
                {
                    name: 'Home',
                    icon: 'home',
                    link: '/home',
                    children: []
                },
            ],
        },

        footerMenuItems: {
            type: Array,
            default: () => [

            ],
        }
    },
    data() {
        return {
            menuItem: null,
            path: null,
            isOpened: false,
            searchInput: '',
            showSubMenu: {},
        }
    },
    created() {
        this.path = this.$route.path
        this.isOpened = this.isMenuOpen
    },
    computed: {
        searchResult() {
            let tmp = this.menuItems
            if (this.searchInput != '') {
                tmp = tmp.filter((item) => {
                    let res = item.children.filter(el => el.name.toUpperCase().includes(this.searchInput.toUpperCase()))
                    if (res.length > 0) return item
                })
            }
            return tmp
        },
    },
    watch: {
        '$route.path': {
            handler: function (value) {
                this.path = value
            },
            deep: true,
            immediate: true
        },
        isOpened() {
            document.getElementById('main_page').style.paddingLeft = this.isOpened && this.isPaddingLeft ? this.menuOpenedPaddingLeftBody : this.menuClosedPaddingLeftBody
        }
    },
    methods: {
        logout() {
            window.localStorage.removeItem('x-auth-token')
            window.localStorage.removeItem('x-refresh-token')
            this.$router.push({ name: "login"});
        },
        checkChildren(payload) {
            if (this.$store.state.user.type === 'SOUS_ADMIN') {
                let check = payload.children.some(el => {
                    return this.$store.state.user.role.permissions.find(elm => elm.includes(el.permission)) != undefined ? true : false
                })
                return check
            }
            return true
        },
        isSelectedMenu(value) {
            return value.children.length > 0 ? value.children.filter(el => this.path.includes(el.link)).length > 0 ? true : false : this.path.includes(value.link) ? true : false
        },
        toggleMenu(value) {
            this.menuItem === value ? (this.isOpened = false, this.menuItem = null, this.showSubMenu = null) : (this.isOpened = true, this.menuItem = value, this.showSubMenu = value)
        }
    }
}
</script>
  
<style scoped>
/* Google Font Link */
@import url('https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css');

#main_page {
    transition: all 0.5s ease;
}


.sidebar {
    display: flex;
    flex-direction: column;
    position: absolute;
    height: 97%;
    min-height: min-content;
    width: 78px;
    background: white;
    z-index: 99;
    transition: all 0.2s ease;
}

.sidebar.open {
    width: 200px;
}

.sidebar i,
.icn {
    height: 80px;
    min-width: 50px;
    font-size: 28px;
    text-align: center;
    line-height: 60px;
}


.sidebar li {
    position: relative;
    /* margin: 5px 0; */
    list-style: none;
}

.sidebar input {
    font-size: 15px;
    color: #fff;
    font-weight: 400;
    outline: none;
    height: 50px;
    width: 100%;
    width: 50px;
    border: none;
    border-radius: 12px;
    transition: all 0.2s ease;
    background: #1d1b31;
}

.sidebar.open input {
    padding: 0 20px 0 50px;
    width: 100%;
}

.sidebar .bx-search {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    font-size: 22px;
    background: #1d1b31;
    color: #fff;
}

.sidebar li a {
    display: flex;
    height: 100%;
    width: 100%;
    align-items: center;
    text-decoration: none;
    transition: all 0.2s ease;
    background: white;
}

.sidebar li .links_name {
    font-size: 15px;
    font-weight: 400;
    white-space: nowrap;
    opacity: 0;
    transition: all 0.2s ease;
}

.sidebar.open li .links_name {
    opacity: 1;
}


.sidebar li i,
.icn {
    height: 50px;
    line-height: 50px;
    font-size: 18px;
    border-radius: 12px;
}


#my-scroll {
    overflow-y: auto;
    height: calc(100% - 35px);
}

#my-scroll::-webkit-scrollbar {
    display: none;
}

.footer-active {
    color: #03A9F4
}

.active {
    color: #03A9F4;
    border-left: 2px solid;
    border-color: #03A9F4
}</style>