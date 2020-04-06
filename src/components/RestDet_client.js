import React, { Component } from "react";
import {
    View,
    Text,
    Image,
    Animated,
    Dimensions,
    ScrollView,
    TouchableOpacity,
    FlatList,
    I18nManager, KeyboardAvoidingView, Platform
} from "react-native";
import {NavigationEvents} from "react-navigation";
import {Container, Content, Header, Button, Item, Fab, Toast, Form, Label,Icon, Textarea} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import COLORS from '../../src/consts/colors'
import StarRating from 'react-native-star-rating';
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import axios from "axios";
import CONST from "../consts/colors";
import {DoubleBounce} from "react-native-loader";
const height = Dimensions.get('window').height;
import {connect}         from "react-redux";
import {profile, userLogin} from "../actions";
import Modal from "react-native-modal";

class RestDet_client extends Component {
    constructor(props){
        super(props);

        this.state={
            backgroundColor: new Animated.Value(0),
            availabel   :  0,
            placeName   : '',
            address     : '',
            details     : '',
            imageCover  : '',
            starCount   : 3,
            restaurant  : null,
            specials    : [],
            activeType  : 0,
            rating      : 0,
            data        : '',
            menu        : null,
            menu_id     : null,
            products    : [] ,
            menus       : [] ,
            choose_ModalVisible  : false
        }
    }



    static navigationOptions = () => ({
        drawerLabel: () => null,
    });


  async  componentWillMount() {
       this._getLocationAsync();
    }


    onFocus(){
      this.componentWillMount();
    }
    _getLocationAsync = async () => {
        this.setState({ isLoaded: true });
        let {status} = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            Toast.show({
                text: 'Permission to access location was denied',
                duration: 4000,
                type: 'danger',
                textStyle: {color: "white", textAlign: 'center'}
            });
            this.setState({ isLoaded: false });
        } else {

            return await Location.getCurrentPositionAsync({
                enableHighAccuracy: false,
                maximumAge: 15000
            }).then((position) => {
                this.setState({
                    lat         :       position.coords.longitude,
                    long        :       position.coords.latitude
                });
                setTimeout(()=> {
                    this.getResults();
                },1000)
            }).catch(()=>{

            });
        }
    };

    getResults()
    {

        this.products();

        this.setState({ isLoaded: true });
        axios({
            method     : 'post',
            url        :  CONST.url + 'detailsPlace',
            data       :  {
                place_id     :  this.props.navigation.state.params.place_id,
                lat          :  this.state.lat,
                long         :  this.state.long,
            },
            headers    : {
                lang             :     ( this.props.lang ) ?  this.props.lang : 'ar',
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
                    data               : response.data.data,
                    placeName          : response.data.data.placeName,
                    address            : response.data.data.address,
                    rating             : response.data.data.rating,
                    imageProfile       : response.data.data.imageProfile,
                    imageCover         : response.data.data.imageCover,
                    specials           : response.data.data.menus,
                });
            }

        }).catch(error => {

        }).then(()=>{
            this.setState({ isLoaded: false });
        });
    }


    renderLoader(){
        if (this.state.isLoaded){
            return(
                <View style={{ alignItems: 'center', justifyContent: 'center', height: (height-100) , alignSelf:'center' , backgroundColor: '#fff' , width:'100%' , position:'absolute' , zIndex:1  }}>
                    <DoubleBounce size={20} color={COLORS.red} />
                </View>
            );
        }
    }

    _keyExtractor = (item, index) => item.id;
    renderItems = (item , key) => {
        return(
            <TouchableOpacity key={key} onPress={() => this.props.navigation.navigate('productDet_client',{
                product_id   : item.product_id,
                place_id     : this.props.navigation.state.params.place_id,
                type         : this.props.navigation.state.params.type,
                lat          : this.state.lat,
                long         : this.state.long
            })} style={[styles.notiBlock , {padding:7}]}>
                <Image source={{uri : item.image}} resizeMode={'cover'} style={styles.restImg}/>
                <View style={[styles.directionColumn , {flex:1}]}>
                    <View style={[styles.directionRowSpace ]}>
                        <Text style={[styles.boldGrayText ]}>{item.productName}</Text>
                        <Text style={[styles.boldGrayText , {color:COLORS.yellow} ]}>{item.price}</Text>

                    </View>
                    <View style={[styles.locationView]}>
                        <Text style={[styles.grayText , {writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',fontSize:13 , lineHeight:16} ]}>{item.details}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    setAnimate(availabel){
        if (availabel === 0){
            Animated.timing(
                this.state.backgroundColor,
                {
                    toValue: 1,
                    duration: 1000,
                },
            ).start();
            this.setState({ availabel: 1 });
        }else {
            Animated.timing(
                this.state.backgroundColor,
                {
                    toValue: 0,
                    duration: 1000,
                },
            ).start();
            this.setState({ availabel: 0 });
        }
    }

    headerScrollingAnimation(e){
        if (e.nativeEvent.contentOffset.y > 30){
            console.log(e.nativeEvent.contentOffset.y);
            this.setAnimate(0)
        } else{
            this.setAnimate(1)
        }
    }
    activeInput(type){
        if (type === 'msg'){
            this.setState({ msgStatus: 1 })
        }else
            this.setState({ emailStatus: 1 })
    }

    products(id ) {
            this.setState({menu_id : id ,  isLoaded: true});
            axios({
                method     : 'post',
                url        :  CONST.url + 'getProducts',
                data       :  {
                    place_id     :  this.props.navigation.state.params.place_id,
                    menu_id      :  id,
                },
                headers    : {
                    lang                 : ( this.props.lang ) ?  this.props.lang : 'ar',
                }
            }).then(response => {
                this.setState({
                    products             : response.data.data,
                    isLoaded             : false
                });

            });
    }



    openModal(){
        if(this.props.auth){
            this.setState({choose_ModalVisible  : true});
        }else{
            Toast.show({ text: i18n.t('sign_in'), duration : 2000 ,
                type :"success",
                textStyle: {
                    color: "white",fontFamily : 'cairoBold' ,textAlign:'center'
                }});
            this.props.navigation.navigate('user');
        }
    }


    make_special(){
        if(this.state.details !== ''){
            this.setState({ choose_ModalVisible : false });
            this.props.navigation.navigate('orderDet_client',{
                place_id : this.props.navigation.state.params.place_id,
                kindBuy      : 'buy_with_Cash',
                orderDetails :  this.state.details,
                status       : 'private',
            });
        }else{
            Toast.show({ text: i18n.t('details_required'), duration : 2000 ,
                type :"danger",
                textStyle: {
                    color: "white",fontFamily : 'cairoBold' ,textAlign:'center'
             } });
        }

    }


    render() {
        const backgroundColor = this.state.backgroundColor.interpolate({
            inputRange: [0, 1],
            outputRange: ['rgba(0, 0, 0, 0)', '#00000099']
        });

        const IS_IPHONE_X = height === 812 || height === 896;

        return (
            <Container>
                <NavigationEvents onWillFocus={() => this.onFocus()} />


                        <Header style={[styles.header , {backgroundColor:'transparent' , paddingLeft:0 , paddingRight:0} ]} noShadow>
                            <Animated.View style={[styles.animatedHeader ,{ backgroundColor: backgroundColor}]}>
                                <View style={styles.directionRow}>
                                    <Button onPress={() => this.props.navigation.openDrawer()} transparent style={styles.headerBtn}>
                                        <Image source={require('../../assets/images/noun_menu.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                                    </Button>

                                </View>

                                <Text style={[styles.headerText , {right:0} ]}>{ i18n.t('productDet') }</Text>

                                <View style={styles.directionRow}>
                                    <Button onPress={() => this.props.navigation.navigate(this.props.navigation.state.params.type)} transparent  style={styles.headerBtn}>
                                        <Image source={require('../../assets/images/arrow_left.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                                    </Button>
                                </View>
                            </Animated.View>
                        </Header>


                <Content contentContainerStyle={styles.flexGrow} style={styles.homecontent} onScroll={e => this.headerScrollingAnimation(e) }>

                    { this.renderLoader() }


                    <View style={styles.headImg}>


                        {
                            (Platform.OS !== 'android' && IS_IPHONE_X)
                                ?

                                <View style={{position: 'absolute', top: 45, left: 20, zIndex: 9999}}>
                                    <Button onPress={() => this.props.navigation.openDrawer()} transparent
                                            style={styles.headerBtn}>
                                        <Image source={require('../../assets/images/noun_menu.png')}
                                               style={[styles.headerMenu, styles.transform]} resizeMode={'contain'}/>
                                    </Button>
                                </View>
                                : null

                        }

                        {
                            (Platform.OS  !== 'android'  && IS_IPHONE_X)
                                ?

                                <View style={{position: 'absolute', top: 45, right: 20, zIndex: 9999}}>
                                        <Button onPress={() => this.props.navigation.goBack()} transparent
                                                style={styles.headerBtn}>
                                            <Image source={require('../../assets/images/arrow_left.png')}
                                                   style={[styles.headerMenu, styles.transform, {zIndex: 999}]}
                                                   resizeMode={'contain'}/>
                                        </Button>
                                    </View>

                                : null
                        }
                        <Image source={{uri : this.state.imageCover}} style={styles.swiperimage} resizeMode={'cover'}/>
                        <View style={[styles.sideImgView , styles.w100 , { top:120}]}>
                            <View style={[styles.resProfileImg]}>
                                <Image source={{uri : this.state.imageProfile}} resizeMode={'cover'} style={styles.swiperimage}/>
                            </View>
                            <Text style={[styles.sideName, {fontSize:15}]}>{this.state.placeName}</Text>
                            <View style={[styles.locationView, styles.mb10 , {marginTop:7}]}>
                                <Image source={require('../../assets/images/maps.png')} style={[styles.locationImg]} resizeMode={'contain'} />
                                <Text style={[styles.whiteText , styles.normalText]}>{ this.state.address }</Text>
                            </View>
                            <StarRating
                                disabled={true}
                                maxStars={5}
                                rating={this.state.rating}
                                fullStarColor={COLORS.yellow}
                                starSize={13}
                                starStyle={styles.starStyle}
                            />
                        </View>
                    </View>

                    <View style={styles.mainScroll}>
                        <ScrollView style={{}} horizontal={true} showsHorizontalScrollIndicator={false}>

                            <TouchableOpacity onPress={ () =>  this.products(null)} style={styles.scrollView}>
                                <Text style={[styles.scrollText,{color:this.state.menu_id === 0 ? COLORS.yellow : COLORS.boldGray}]}>{ i18n.t('all') }</Text>
                                <View style={[styles.triangle , {borderBottomColor:this.state.special_id === null ? COLORS.yellow : 'transparent'}]} />
                            </TouchableOpacity>


                            {
                                this.state.specials.map((special , key) => {
                                  return(
                                      <TouchableOpacity  key={key} onPress={ () => this.products(special.menu_id)} style={styles.scrollView}>
                                          <Text style={[styles.scrollText,{color:this.state.menu_id === special.menu_id ? COLORS.yellow : COLORS.boldGray}]}>{  special.menuName }</Text>
                                          <View style={[styles.triangle , {borderBottomColor:this.state.menu_id === special.menu_id? COLORS.yellow : 'transparent'}]} />
                                      </TouchableOpacity>
                                  );
                                })
                            }

                        </ScrollView>
                    </View>

                    <View style={[styles.homeSection , {marginTop:20}]}>
                        <FlatList
                            data={this.state.products}
                            renderItem={({item}) => this.renderItems(item)}
                            numColumns={1}
                            extraData={this.state}
                            keyExtractor={this._keyExtractor}
                        />

                    </View>

                </Content>

                <Modal onBackdropPress={()=> this.setState({ choose_ModalVisible : false , initMap : true , LocationName : '' })} isVisible={this.state.choose_ModalVisible}>
                    <View style={[styles.modalStyle , {justifyContent:'center' , alignItems :'center'}]}>
                        <View style={styles.modalHead}>
                            <Text style={[styles.whiteText , {fontSize:15}]}>{ i18n.t('special_order') }</Text>
                        </View>
                        <KeyboardAvoidingView behavior={'padding'} style={styles.keyboardAvoid}>
                            <Form style={{ justifyContent:'center' , alignItems :'center'  }}>

                                <Item style={[styles.loginItem , {width : '90%'}]} bordered>
                                    <Label style={[styles.label ]}>{i18n.t('orderDet')}</Label>
                                    <Textarea onBlur={() => this.unActiveInput('msg')} onFocus={() => this.activeInput('msg')} placeholderTextColor={COLORS.placeholderColor}
                                              onChangeText={(details) => this.setState({details})} autoCapitalize='none'
                                              style={[styles.input , {borderTopRightRadius:25,width : '100%' ,borderTopLeftRadius:25 ,
                                                  borderColor: this.state.msgStatus === 1 ? COLORS.yellow : COLORS.lightGray ,
                                                  backgroundColor: this.state.msgStatus === 1 ? '#fff' : COLORS.lightGray ,
                                                  height:120 , paddingVertical:10}]} placeholder={i18n.t('details')} />
                                </Item>

                                <TouchableOpacity  onPress={()=> { this.make_special() }}  style={[styles.yellowBtn , styles.mb10 , {justifyContent : 'center' , alignItems :'center' , alignSelf: 'center' , width : '50%'}]}>
                                    <Text style={styles.whiteText}>{ i18n.t('confirm') }</Text>
                                </TouchableOpacity>
                            </Form>
                        </KeyboardAvoidingView>
                    </View>
                </Modal>
                {
                    (this.props.navigation.state.params.type !== 'restaurants_client')
                        ?
                <Fab
                    active={true}
                    direction="up"
                    containerStyle={{marginHorizontal : 20 }}
                    style={{ backgroundColor: COLORS.yellow , width : 100 , height: 45, borderRadius : 0}}
                    position="bottomRight"
                    onPress={() => this.openModal() }>
                  <TouchableOpacity  onPress={() => this.openModal() } >
                      <Text style={styles.catText}>{i18n.t('special_order')}</Text>
                  </TouchableOpacity>
                </Fab>
                        :null
                }
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
export default connect(mapStateToProps, { userLogin ,profile})(RestDet_client);





