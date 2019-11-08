// 主页页面的页面路径
// 关联功能：打开的页面只有一个的时候右上角自动显示返回首页按钮，下面这个数组是排除显示返回首页的页面。
// 主页使用场景：小程序分享出去的页面，用户点击开是分享页面，很多情况下是没有返回首页按钮的
// const mainPagePath = ["pages/navList"];
//返回首页的地址
// const homePath = "/pages/navList";
//白色表达值
const whiteList = ['#FFF', '#FFFFFF', 'white', 'rgb(255,255,255)', 'rgba(255,255,255,1)'];
Vue.component("nav-bar", {
    template: `
<div class="my-nav-head">
    <div class="header"
        :class="{ fixed: navFixed, absolute: type == 'transparent', line: navLine, colorWhite: isWhite,themeBgColor:themeBgColor }"
        :style="{ background: navBgColor, color: navFontColor, opacity: transparentValue }">
        <div class="left_box">
            <slot name="left">
                <div class="left_info" :class="{ btnMongol: isTwoBtn }" v-if="back || $slots.left || home">
                    <div class="back" v-if="back && !firstPage" @click="onBackPage">
                        <van-icon name="arrow-left" />
                    </div>
                    <span v-if="isTwoBtn"></span>
                    <div class="home" v-if="(firstPage && back) || home" @click="onBackHome"></div>
                </div>
            </slot>
            <div class="title" :class="{ center: titleCenter, color: navFontColor }" v-if="$slots.default || navTitle">
                <slot>{{ navTitle }}</slot>
            </div>
        </div>
        <div class="right_info">
            <slot name="right">
             <van-icon name="ellipsis"/>
            </slot>
        </div>
    </div>
    <div class="header transparentFixed fixed" :class="{ colorWhite: isWhite }" v-if="type == 'transparentFixed'"
        :style="{ color: navTransparentFixedFontColor, opacity: 1 - transparentValue, zIndex: transparentValue < 0.3 ? 100 : 90 }">
        <div class="left_box">
            <div class="left_info" v-if="back || $slots.left || home">
                <slot name="transparentFixedLeft">
                    <div class="back" v-if="back && !firstPage" @click="onBackPage">
                        <van-icon name="arrow-left" />
                    </div>
                    <span v-if="isTwoBtn"></span>
                    <div class="home" v-if="(firstPage && back) || home" @click="onBackHome"></div>
                </slot>
            </div>
            <div class="title" :class="{ center: titleCenter }" v-if="$slots.default || navTitle">
                <slot name="transparentFixed">{{ navTitle }}</slot>
            </div>
        </div>
        <div class="right_info">
            <slot name="transparentFixedRight">
                 <van-icon name="ellipsis"/>
            </slot>
        </div>
    </div>
    <div v-if="type == 'fixed'" class="station"></div>
</div>
    `,
    props: {
        //是否显示返回按钮
        // 1000 显示返回按钮
        // 2000 不显示返回按钮
        // 3000 自定义返回按钮方法，点击返回箭头后会发送一个backClick事件
        backState: {
            default: function () {
                return 1000;
            }
        },
        //是否显示返回首页按钮
        home: {
            type: Boolean,
            default: function () {
                return false;
            }
        },
        //导航背景色，bg为false的时候导航通透
        bgColor: {
            type: String,
            default: function () {
                return '#FFF';
            }
        },
        //导航字体颜色，字体颜色为白色的时候会把手机状态栏设置为白色，否则为黑色
        fontColor: {
            type: String,
            default: function () {
                return '#000';
            }
        },
        //标题是否居中
        titleCenter: {
            type: Boolean,
            default: function () {
                return true;
            }
        },
        //标题
        title: {
            type: String,
            default: function () {
                return '';
            }
        },
        //类型 fixed为固定 默认
        // ordinary 普通的 不固定
        // transparent 透明不固定的
        //transparentFixed  透明固定的
        type: {
            type: String,
            default: function () {
                return 'fixed';
            }
        },
        //透明固定的时候字体颜色
        transparentFixedFontColor: {
            type: String,
            default: function () {
                return '#000';
            }
        }
    },
    data() {
        return {
            //当前页面是否是第一个页面
            firstPage: false,
            //透明度值
            transparentValue: 1,
            //标题
            navTitle: '',
            //字体色
            navFontColor: '#000',
            //背景色
            navBgColor: '#FFF',
            //透明底字体色
            navTransparentFixedFontColor: '#000',
            // 是否使用
            themeBgColor: false
        };
    },
    computed: {
        back() {
            return this.backState == 1000 || this.backState == 3000;
        },
        //导航固定
        navFixed() {
            if (this.type == 'transparentFixed' || this.type == 'fixed') {
                return true;
            } else {
                return false;
            }
        },
        //导航底部线是否显示
        navLine() {
            return this.type !== 'transparent' && whiteList.includes(this.navBgColor);
        },
        //导航字体是否是白色颜色
        isWhite() {
            return whiteList.includes(this.navFontColor);
        },
        //右上角是否有两个按钮
        isTwoBtn() {
            return (this.backState == 1000 || this.backState == 3000) && this.home && !this.firstPage;
        }
    },
    watch: {
        title(val) {
            this.navTitle = val;
        },
        fontColor(val) {
            this.navFontColor = val;
            this.settingColor();
        },
        bgColor(val) {
            if (val == "themeBgColor") {
                this.themeBgColor = true;
                this.navBgColor = "";
            } else {
                this.navBgColor = val;
            }
        },
        transparentFixedFontColor(val) {
            this.navTransparentFixedFontColor = val;
        }
    },
    //第一次加载
    created() {
        this.navTitle = this.title;
        this.navFontColor = this.fontColor;
        if (this.bgColor == "themeBgColor") {
            this.themeBgColor = true;
            this.navBgColor = "";
        } else {
            this.navBgColor = this.bgColor;
        }
        this.navTransparentFixedFontColor = this.transparentFixedFontColor;
        const _this = this;

        console.log(this.navTransparentFixedFontColor,this.navFontColor)

        if (this.type == 'transparentFixed') {
            this.transparentValue = 0;
        }
        this.settingColor();
        //监听页面滚动，type为transparentFixed的时候页面向下滚动的时候导航逐渐变白
        if (this.type == 'transparentFixed') {

            window.onscroll = function (e) {
                let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                _this.$emit('scroll', {
                    scrollTop: scrollTop
                });
                if (scrollTop > 180) {
                    _this.transparentValue = 1;
                } else {
                    _this.transparentValue = scrollTop / 180;
                }
            };
        }
    },
    //方法
    methods: {
        //返回上一页面
        onBackPage() {
            if (this.backState == 3000) {
                this.$emit("backClick");
            } else {
                // uni.navigateBack();
            }
        },
        //返回首页
        onBackHome() {
            // uni.switchTab({
            //     url: homePath
            // });
        },
        settingColor() {

        }
    }
});