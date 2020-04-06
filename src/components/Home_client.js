import React, { Component } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    BackHandler,
    TouchableWithoutFeedback,
    I18nManager,
    Alert,
    Platform,
    ImageBackground, ScrollView, FlatList
} from "react-native";
import {Container, Content, Header, Button, Item, Input, Toast, Icon} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import COLORS from '../../src/consts/colors'
import Swiper from 'react-native-swiper';
import {DrawerActions, NavigationActions, NavigationEvents} from 'react-navigation'
import {DoubleBounce} from "react-native-loader";

import {connect}         from "react-redux";
import { userLogin , profile} from "../actions";
import axios from "axios";
import CONST from "../consts/colors";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import {Notifications} from "expo";
import * as Animatable from 'react-native-animatable';
import StarRating from 'react-native-star-rating';

const height = Dimensions.get('window').height;

class Home_client extends Component {
    constructor(props){
        super(props);

        this.state =
            {
                isLoaded        : false,
                sliders         : [],
                categories      : [],
                products        : [],
                cart_count      : 0,
                lat             : null,
                long            : null,
                is_notification : 0,
                id              : 0,
                show            : true,

                coverUser       : '',
                imgUser         : '',
                nameUser        : '',
                cityUser        : '',
                rateUser        : 0,
                place_id        : '',
                menu_id         : '' ,
            };

            setInterval(()=> {
                this.check();
            }, 100000);

         Animatable.createAnimatableComponent(Home_client);
    }

    componentWillUnmount() {
        this.backHandler.remove()
    }

    handleBackButton = () => {
        Alert.alert(
            i18n.t('need_back'),
            i18n.t('will_need_back'),
            [
                {
                    text:  i18n.t('no') ,
                    onPress: () => console.log("Yes, discard changes"),
                    style: "cancel"
                },
                {
                    text:  i18n.t('yes') ,
                    onPress: () =>  {
                        BackHandler.exitApp();
                        return true;
                    }
                }
            ],
            { cancelable: false }
        );
        return true;
    };

    async componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        Notifications.addListener(this.handleNotification.bind(this));
    }

    handleNotification(notification) {
        if (notification && notification.origin !== 'received') {
            if (notification.data.key === 'price') {
                this.props.navigation.navigate('showPrice_client', {
                    item_id: notification.data.item_id
                });
            }else if (notification.data.key === 'orderUser') {
                this.props.navigation.navigate('followOrder_client' ,{
                    place_id : null,
                    item_id  : notification.data.item_id
                });
            } else {
                this.props.navigation.navigate('notification_client')
            }

        } else if (notification && notification.origin === 'received') {
            if (notification.data.key === 'price') {
                this.props.navigation.navigate('showPrice_client', {
                    item_id: notification.data.item_id
                });
            } else {

            }
        } else {

        }
    }

        static navigationOptions = () => ({
        drawerLabel: i18n.t('home') ,
        drawerIcon: (<Image source={require('../../assets/images/noun_home.png')} style={styles.drawerImg} resizeMode={'contain'} /> )

      });

    _getLocationAsync = async () => {

        this.setState({ isLoaded: true });

        let {status} = await Permissions.askAsync(Permissions.LOCATION);

        if (status !== 'granted') {
            Toast.show({
                text        : 'Permission to access location was denied',
                duration    : 4000,
                type        : 'danger',
                textStyle   : {color: "white", textAlign: 'center'}
            });
            this.setState({ isLoaded: false });
        } else {

            return await Location.getCurrentPositionAsync({
                enableHighAccuracy: false,
                maximumAge        : 15000
            }).then((position) => {
                this.setState({
                    lat           :       position.coords.longitude,
                    long          :       position.coords.latitude
                });

                this.setState({ isLoaded: true });

                axios({
                    method     : 'post',
                    url        :  CONST.url + 'homeScreen',
                    data       :  {
                        lat           :       position.coords.longitude,
                        long          :       position.coords.latitude
                    },
                    headers    : {
                        lang             :   ( this.props.lang ) ?  this.props.lang : 'ar',
                    }
                }).then(response => {

                    if(response.data.status === '0')
                    {
                        Toast.show({ text: response.data.message, duration : 2000 ,
                            type :"danger",
                            textStyle: {
                                color: "white",fontFamily : 'cairoBold' ,textAlign:'center'
                            } });
                    }else{

                        this.setState({
                            sliders         : response.data.data.dataAdvertise,
                            coverUser       : response.data.data.familyData.imageCover,
                            imgUser         : response.data.data.familyData.imageProfile,
                            nameUser        : response.data.data.familyData.placeName,
                            cityUser        : response.data.data.familyData.address,
                            rateUser        : response.data.data.familyData.rating,
                            place_id        : response.data.data.familyData.place_id,
                            categories      : response.data.data.familyData.menus,
                        });

                         this.check();

                        // setTimeout(() => {
                            this.getProducts();
                        // }, 5000);

                    }

                }).catch(error => {

                }).then(()=>{
                    this.setState({ isLoaded: false });
                });
            });
        }
    };

    check(){
        if(this.props.auth !== null &&  this.state.lat &&  this.state.long){
            axios({
                method     : 'post',
                url        :  CONST.url + 'UserSetting',
                data       :  {
                    lat              :             this.state.lat,
                    long             :             this.state.long
                },
                headers    : {
                    lang             :            ( this.props.lang ) ?  this.props.lang : 'ar',
                    user_id          :             this.props.auth.data.user_id,
                }
            }).then(response => {

                if(response.data.status === '0')
                {

                }else{

                    if( response.data.data.authentication !== 'autenticated'){
                        this.logout();
                    }else {
                        this.setState({
                            cart_count            :  response.data.data.binsOrderNumber,
                        });
                        this.setState({
                            is_notification       :  response.data.data.notificationNumber
                        });
                    }

                }
            })
        }
    }

    componentWillMount() {
        this._getLocationAsync();
        this.props.navigation.closeDrawer();
    }

    logout(){

        axios({
            method     : 'post',
            url        :  CONST.url + 'LogOut',
            data       :  {
                device_ID : '000'
            },
            headers    : {
                lang             :    (this.props.lang) ? this.props.lang : 'ar',
                user_id          :    this.props.user.user_id  ,
            }
        }).then(response => {

            if(response.data.status === '0')
            {
                Toast.show({ text: response.data.message, duration : 2000 ,
                    type :"danger",
                    textStyle: {
                        color: "white",fontFamily : 'cairoBold' ,textAlign:'center'
                    } });
            }else{
                this.props.navigation.navigate('user');
                setTimeout(()=>{
                    this.props.logout({ token: this.props.auth.id });
                    this.props.tempAuth();
                },1500)
            }

        }).catch(error => {

        }).then(()=>{
            this.setState({ isLoaded: false });
        });

    }

    onFocus(){
        this.componentWillMount()
    }

    getProducts() {

        this.setState({isLoaded: true});

        axios({
            method     : 'post',
            url        :  CONST.url + 'getProducts',
            data       :  {
                place_id    : this.state.place_id,
                menu_id     : this.state.menu_id
            },
            headers    : {
                lang                 : ( this.props.lang ) ?  this.props.lang : 'ar',
            }
        }).then(response => {
            if(response.data.data.length > 0)
            {
                this.setState({
                    products             : response.data.data,
                    isLoaded             : false
                });
            }else{
                this.setState({
                    products             : [],
                    isLoaded             : false
                });
            }

        }).catch(()=> {
            this.setState({ isLoaded: false });
        });
    }

    _keyExtractor = (item, index) => item.place_id;
    _keyExtractor = (item, index) => item.id;

    renderItems = (item,key) => {
        return(
            <Animatable.View animation={(key % 2 === 0 ) ? 'fadeInDown' : 'fadeInUp'} duration={2000} iterationCount={1}>

                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('productDet_client',{place_id :  item.place_id, product_id : item.product_id})}
                    style={[styles.notiBlock , {padding:5, backgroundColor : '#f8f8f8', borderWidth : 1, borderColor : '#DDD'}]}
                >
                    <Image source={{uri : item.image}} resizeMode={'cover'} style={[styles.restImg, {borderWidth : 1, borderColor : '#DDD'}]}/>
                    <View style={[styles.directionColumn , {flex:1}]}>
                        <View style={[styles.directionRowSpace ]}>
                            <Text style={[styles.boldGrayText , { fontSize : 12, width : 100 } ]} numberOfLines={1} ellipsizeMode='tail'>{item.productName}</Text>
                            <Text style={[styles.boldGrayText, { color : COLORS.yellow, fontSize : 11 } ]}>{ i18n.t('bychoice') }</Text>
                        </View>
                        <View style={[styles.locationView]}>
                            <Text style={[styles.grayText , {writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',fontSize:12} ]}>{item.details}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </Animatable.View>
        );
    }

    renderLoader(){
        if (this.state.isLoaded){
            return(
                <View style={{ alignItems: 'center', justifyContent: 'center', height: '100%' , alignSelf:'center' , backgroundColor: '#fff' , width:'100%' , position:'absolute' , zIndex:99, top : 0, right: 0  }}>
                    <DoubleBounce size={20} color={COLORS.red} />
                </View>
            );
        }
    }

    handleLoadMore = () => {

        if(this.state.products.length > 12){
            this.getResults();
        }

    };

    products(id) {

        this.setState({menu_id : id , isLoaded: true});
        setTimeout(()=> {
            this.getProducts();
        },500)

    }

    render() {
        return (
            <Container>

                <NavigationEvents onWillFocus={() => this.onFocus()} />

                <Content contentContainerStyle={styles.flexGrow} style={{}}>

                    <View style={{ overflow : 'hidden' }}>
                        <Animatable.View animation={'fadeInDown'} duration={2000} iterationCount={3}>
                            <View style={styles.eventswiper}>
                                <Swiper
                                    key={this.state.sliders.length}
                                    dotStyle={styles.eventdoteStyle}
                                    activeDotStyle={styles.eventactiveDot}
                                    containerStyle={{}}
                                    showsButtons={false}
                                    autoplay={true}
                                >
                                    {
                                        this.state.sliders.map((slider , key)=> {
                                            return(
                                                <View key={key} style={styles.swiperimageEvent}>
                                                    <Image source={{uri : slider.image}} style={styles.swiperimage} resizeMode={'cover'}/>
                                                </View>
                                            );
                                        })
                                    }
                                </Swiper>
                            </View>
                        </Animatable.View>
                    </View>

                    <ImageBackground source={{ uri : this.state.coverUser }} resizeMode={'cover'} style={{ width : '100%', height : null, position: 'relative' }}>

                        <View style={{ position: 'relative', backgroundColor:'rgba(0,0,0,0.5)' }}>

                            <View style={[ styles.header, { paddingTop: 0, backgroundColor: 'transparent', height : null } ]}>
                                <View style={styles.directionRow}>
                                    <Button onPress={() => {
                                        if(this.state.lat === null || this.state.long === null)
                                        {
                                            alert(i18n.t('open_gps'));
                                        }else{
                                            this.props.navigation.openDrawer()
                                        }
                                    }} transparent style={styles.headerBtn}>
                                        <Image source={require('../../assets/images/noun_menu.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                                    </Button>
                                    <Button onPress={() => {
                                        if(this.props.auth   !== null && this.props.auth  !== undefined)
                                        {
                                            if(this.state.lat === null || this.state.long === null) {
                                                alert(i18n.t('open_gps'));
                                            }else{
                                                this.props.navigation.navigate('notification_client')
                                            }
                                        }else{
                                            this.props.navigation.navigate('user')
                                        }
                                    }} transparent style={styles.headerBtn}>
                                        {
                                            (this.state.is_notification >  0)
                                                ?
                                                <Image source={require('../../assets/images/notification.png')} style={styles.headerMenu} resizeMode={'contain'} />
                                                :
                                                <Image source={require('../../assets/images/bell.png')} style={styles.headerMenu} resizeMode={'contain'} />
                                        }
                                    </Button>
                                </View>
                                <Text style={[styles.headerText ]}>{ i18n.t('home') }</Text>
                                <View style={styles.directionRow}>
                                    <Button onPress={() => {

                                        if(this.props.auth  !== null &&  this.props.auth  !== undefined)
                                        {
                                            if(this.state.lat === null || this.state.long === null) {
                                                alert(i18n.t('open_gps'));
                                            }else{
                                                this.props.navigation.navigate('cart_client')
                                            }
                                        }
                                        else{  this.props.navigation.navigate('user')}
                                    }} transparent  style={styles.headerBtn}>
                                        <Image source={require('../../assets/images/shopping_basket.png')} style={styles.headerMenu} resizeMode={'contain'} />
                                    </Button>
                                    <View style={styles.cartNum}>
                                        <Text style={styles.cartNumText}>{ this.state.cart_count }</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={[ styles.rowAlgin, { padding : 10, marginVertical: 10 } ]}>
                                <View style={{ width : 55 , height : 55, borderRadius : 50, position: 'relative', overflow : 'hidden', justifyContent:'center' , alignItems:'center', alignSelf : 'center',backgroundColor:'rgba(255,255,255,0.5)'}}>
                                    <Image
                                        style={{resizeMode : 'cover' , width : 50 , height : 50, borderRadius : 50, padding: 5  }}
                                        source={{ uri : this.state.imgUser }}
                                    />
                                </View>
                                <View style={{ paddingHorizontal : 10 }}>
                                    <Text style={{ fontFamily: I18nManager.isRTL ? 'cairo' : 'openSans', fontSize : 14, color : "#FFF" }}>
                                        { this.state.nameUser }
                                    </Text>
                                    <View style={[ styles.rowAlgin ]}>
                                        <Icon type={'FontAwesome5'} name={'map-marker-alt'} style={{ color : COLORS.yellow, fontSize : 12, marginHorizontal : 5 }} />
                                        <Text style={{ fontFamily: I18nManager.isRTL ? 'cairo' : 'openSans', fontSize : 14, color : "#FFF" }}>
                                            { this.state.cityUser }
                                        </Text>
                                    </View>
                                    <View style={{ width : 80 }}>
                                        <StarRating
                                            disabled={true}
                                            maxStars={5}
                                            rating={this.state.rateUser}
                                            selectedStar={(rating) => this.onStarRatingPress(rating)}
                                            fullStarColor={COLORS.yellow}
                                            starSize={13}
                                            starStyle={[styles.starStyle , {color: '#fec106'}]}
                                        />
                                    </View>
                                </View>
                            </View>

                        </View>

                    </ImageBackground>

                    {this. renderLoader()}

                    {
                        (this.state.lat === null && this.state.isLoaded === false)
                            ?
                            <View style={{flex : 1, alignSelf:  'center', marginVertical: 30  , width : '100%'}}>
                                <Image style={{resizeMode : 'contain' , width : 300 , height : 300  }} source={ require('../../assets/images/no_result.png') }/>

                                <TouchableOpacity onPress={ () => this._getLocationAsync()} style={[styles.yellowBtn , styles.mt15, styles.mb10 , {width:'90%' , alignSelf: 'center'}]}>
                                    <Text style={styles.whiteText}>{i18n.t('is_open_gps')}</Text>
                                </TouchableOpacity>
                            </View>
                            :
                            <View/>
                    }

                    <View style={styles.mainScroll}>
                        <View style={{ alignSelf :  I18nManager.isRTL ? 'flex-start' : 'flex-end', }}>
                            <ScrollView style={{}} horizontal={true} showsHorizontalScrollIndicator={false}>

                                <TouchableOpacity  onPress={ () => this.products(null)} style={styles.scrollView}>
                                    <Text style={[styles.scrollText,{color:this.state.menu_id === '' || this.state.menu_id == null ? COLORS.black : COLORS.boldGray }]}>{ i18n.t('all') }</Text>
                                    <View style={[styles.triangle , {borderBottomColor:this.state.menu_id === '' || this.state.menu_id == null ? COLORS.black : 'transparent'}]} />
                                </TouchableOpacity>

                                {
                                    (this.state.categories.map((category,i)=> {

                                        return (
                                            <TouchableOpacity key={i} onPress={ () => this.products( category.menu_id )} style={styles.scrollView}>
                                                <Text style={[styles.scrollText,{color:this.state.menu_id === category.menu_id ? COLORS.black : COLORS.boldGray}]}>{ category.menuName }</Text>
                                                <View style={[styles.triangle , {borderBottomColor:this.state.menu_id === category.menu_id ? COLORS.black : 'transparent'}]} />
                                            </TouchableOpacity>
                                        );
                                    }))
                                }

                            </ScrollView>
                        </View>
                    </View>

                    <View style={[styles.homeSection , {marginTop:20}]}>

                        <FlatList
                            onEndReached = { this.handleLoadMore }
                            data={this.state.products}
                            renderItem={({item}) => this.renderItems(item)}
                            numColumns={1}
                            extraData={this.state}
                            keyExtractor={this._keyExtractor}
                        />

                        {
                            (this.state.products.length === 0 && this.state.isLoaded === false)
                                ?
                                <View style={{flex : 1, alignSelf:  'center', marginVertical: 30 }}>
                                    <Image style={{resizeMode : 'contain' , width : 300 , height : 300  }} source={ require('../../assets/images/no_result.png') }/>
                                </View>
                                :
                                <View/>
                        }
                    </View>


                </Content>
            </Container>

        );
    }
}
const mapStateToProps = ({ auth,profile, lang  }) => {

    return {

        auth     : auth.user,
        lang     : lang.lang,
        result   : auth.success,
        userId   : auth.user_id,
    };
};
export default connect(mapStateToProps, { userLogin ,profile})(Home_client);




