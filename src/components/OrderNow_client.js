import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, Dimensions, FlatList, I18nManager, Animated,TouchableHighlight,ListView} from "react-native";
import {Container, Content, Header, Button, Item, Input, Icon, Toast, Form, Label, CheckBox} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import COLORS from '../../src/consts/colors'
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import {DoubleBounce} from "react-native-loader";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import axios from "axios";
import CONST from "../consts/colors";
import {connect}         from "react-redux";
import {profile, userLogin} from "../actions";
import Modal from "react-native-modal";
import {NavigationEvents} from "react-navigation";
const height = Dimensions.get('window').height;
const arr = [{
    title : 'product 1',
    body  : 'hi every body'
}];

class OrderNow_client extends Component {
    constructor(props){
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => {} });

        this.state={
            search                 : '',
            data                   : '',
            total                  : '',
            DeliveryPrice          : '',
            totalPrice             : '',
            copun                  : '',
            DeliveryPriceValue     : '',
            priceOrderValue        : '',
            textErr                : '',
            priceValue             : '',
            priveCode              : '',
            isLoaded               : false,
            isLoaders              : false,
            isLoadeds              : false,
            isModalInfo            : false,
            orders                 : [],
            products               : [],
            percentStatus          : false,
            totalPercent           : "",
            totalPricePercent      : "",
            packagePercent         : "",
            productTypeDes         : "",
            checkCode              : "",
            additionArr            : [],

            sectionListData: arr.map((_,i) => ({
                data  : [...arr.map((_, j) => ({key: `${i}.${j}`, text: ''
                }))]
            })),
        }
    }

    onFocus(){
        console.log(this.props.navigation.state.params.place_id)
        console.log(this.props.auth.data.user_id)
        this.componentWillMount();
    }

    async componentWillMount() {
        this._getLocationAsync();
    }

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
                setTimeout(()=> {
                    this.getResults();
                },1000)
            });
        }
    };

    getResults(type)
    {
        if(type === 1){
            this.setState({ isLoaded: true });
        }else{
            this.setState({ isLoaders: true });
        }

        axios({
            method     : 'post',
            url        :  CONST.url + 'detailsOrdersBins',
            data       :  {
                place_id     : this.props.navigation.state.params.place_id,
                lat          : this.state.lat,
                long         : this.state.long,
                copunKey     : this.state.copun
            },
            headers          : {
                lang         :      ( this.props.lang ) ?  this.props.lang : 'ar',
                user_id      :      this.props.auth.data.user_id,

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

                if(response.data.data.check === '0'){
                    this.props.navigation.navigate('cart_client');
                }else {
                    this.setState({
                        data                 : response.data.data.prices.placeData ,
                        total                : response.data.data.prices.priceOrder ,
                        DeliveryPrice        : response.data.data.prices.DeliveryPrice ,
                        DeliveryPriceValue   : response.data.data.prices.DeliveryPriceValue ,
                        totalPrice           : response.data.data.prices.total ,
                        priceOrderValue      : response.data.data.prices.totalPrice,
                        priceValue           : response.data.data.prices.priceOrderValue,
                        totalPercent         : response.data.data.prices.totalPercent,
                        totalPricePercent    : response.data.data.prices.totalPricePercent,
                        packagePercent       : response.data.data.prices.packagePercent,
                        percentStatus        : response.data.data.prices.percentStatus,
                        checkCode            : response.data.data.prices.checkCode,

                        products             : response.data.data.binsData,
                    });
                }


            }

        }).catch(error => {

        }).then(()=>{
           setTimeout(()=>{
               this.setState({ isLoaded: false ,isLoaders: false });
           }, 1000)
        });
    }

    deleteOrder(id){
        this.setState({ isLoaders: true });
        axios({
            method     : 'post',
            url        :  CONST.url + 'deleteOrder',
            data       :  {
                order_id     : id,
                place_id     : this.props.navigation.state.params.place_id
            },
            headers          : {
                lang         :      ( this.props.lang ) ?  this.props.lang : 'ar',
                user_id      :      this.props.auth.data.user_id
            }
        }).then(response => {
            if(response.data.status === '0')
            {
                Toast.show({ text: response.data.message, duration : 2000 ,
                    type :"danger",
                    textStyle: {
                        color: "white",fontFamily : 'cairoBold' ,textAlign:'center'
                    } });
            } else{

                if(response.data.check === '0'){
                    this.props.navigation.navigate('home_client');
                }else {
                    this.getResults(0);
                }

            }

        }).catch(error => {

        }).then(()=>{
            this.setState({
                isLoaders       : false,
            });
        });
    }

    editProduct(item,count,type)
    {
        let num     = parseInt(count)  ;
        if(type   === 'plus')
        {
            num     = num + 1;
        }else{
            if( num > 1)
               num  = num - 1;
        }
        this.setState({ isLoaders: true });
        axios({
            method     : 'post',
            url        :  CONST.url + 'editOrder',
            data       :  {
                order_id     : item.order_id,
                orderCounter : num,
            },
            headers          : {
                lang         :      ( this.props.lang ) ?  this.props.lang : 'ar',
                user_id      :      this.props.auth.data.user_id,

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
                this.getResults(0);
            }

        }).catch(error => {

        }).then(()=>{
            this.setState({ isLoaders: false });
        });
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

    renderLoaders(){
        if (this.state.isLoaders){
            return(
                <View style={{ alignItems: 'center', justifyContent: 'center', height: '100%' , alignSelf:'center' , backgroundColor: 'rgba(0,0,0,0.8)' , width:'100%' , position:'absolute' , zIndex:99, top : 0, right: 0  }}>
                    <DoubleBounce size={20} color={COLORS.red} />
                </View>
            );
        }
    }

    static navigationOptions = () => ({
        drawerLabel: () => null,
    });

    _toggleModal = () => this.setState({ isModalVisible: !this.state.isModalVisible });

    toggleModalInfo(addition, productType){

        console.log(addition.addition)
        console.log('productTypeDes', productType.productType)

        this.setState({
            additionArr         : addition.addition,
            productTypeDes      : productType.productType,
        });

        setTimeout(()=> {
            this.setState({
                isModalInfo     : !this.state.isModalInfo,
            });
        },500)

    }

    renderSubmit() {
        if (this.state.isLoadeds){
            return(
                <View  style={{ justifyContent:'center', alignItems:'center' , marginTop: 40}}>
                    <DoubleBounce size={25} color="#CBA876"/>
                </View>
            )
        }

        return (
            <TouchableOpacity onPress={ () => this.onSend()} style={[styles.yellowBtn , styles.mt15, styles.mb10,{marginTop: 40 ,width : '50%' ,textAlign:'center' ,  alignSelf: 'center' }  ]}>
                <Text style={[styles.whiteText]}>{ i18n.t('confirm') }</Text>
            </TouchableOpacity>
        );
    }

    renderSubmitButton() {
        if (this.state.isLoadeds){
            return(
                <View  style={{ justifyContent:'center', alignItems:'center' , marginTop: 10}}>
                    <DoubleBounce size={25} color="#CBA876"/>
                </View>
            )
        }

        return (
            <TouchableOpacity onPress={ () =>  this.onSendCo() } style={[styles.yellowBtn , styles.mt15, styles.mb10,{marginTop:10 ,width : '50%' ,textAlign:'center' ,  alignSelf: 'center' }  ]}>
                <Text style={[styles.whiteText]}>{ i18n.t('confirm') }</Text>
            </TouchableOpacity>
        );
    }

    onSend(){

        this.props.navigation.navigate('orderDet_client',{
            place_id             : this.props.navigation.state.params.place_id,
            totalPrice           : (this.state.checkCode !== true && this.state.percentStatus !== false) ? this.state.totalPricePercent : this.state.priceOrderValue,
            copun                : this.state.copun,
            DeliveryPriceValue   : this.state.DeliveryPriceValue,
            type                 : 'now'
        });

        let data = {
            place_id             : this.props.navigation.state.params.place_id,
            totalPrice           : (this.state.checkCode !== true && this.state.percentStatus !== false) ? this.state.totalPricePercent : this.state.priceOrderValue,
            copun                : this.state.copun,
            DeliveryPriceValue   : this.state.DeliveryPriceValue,
            type                 : 'now'
        }

        console.log('data go', data)

    }

    onSendCo(){

        if(this.state.copun !== ''){
            this.setState({ isLoadeds: true });
            axios({
                method     : 'post',
                url        :  CONST.url + 'checkCoupon',
                data       :  {
                    code                : this.state.copun,
                    totalPriceValue     : this.state.priceOrderValue,
                },
                headers          : {
                    lang         :      ( this.props.lang ) ?  this.props.lang : 'ar',
                }
            }).then(response => {
                if(response.data.status === '0')
                {
                    this.setState({copun : '', textErr : response.data.message});
                }else{
                    Toast.show({
                        text: response.data.message,
                        duration : 2000 ,
                        type :"success",
                        textStyle: {
                            color: "white",fontFamily : 'cairoBold' ,textAlign:'center'
                        }
                    });
                    this.setState({
                        textErr         : '',
                        isModalVisible  : false,
                        percentStatus   : false,
                        priveCode       : response.data.data.totalPrice,
                        priceOrderValue : response.data.data.totalPriceValue,
                    });
                }

            }).catch(error => {

            }).then(()=>{
                this.setState({ isLoadeds: false });
            });
        }else{
            this.setState({textErr : i18n.t('copoun_required')});
        }

    }

    render() {

        return (

            <Container>

                <Header style={[styles.header ]} noShadow>
                    <View style={styles.directionRow}>
                        <Button onPress={() => this.props.navigation.openDrawer()} transparent style={styles.headerBtn}>
                            <Image source={require('../../assets/images/noun_menu.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                        </Button>

                    </View>
                    <Text style={[styles.headerText , {right:0} ]}>{i18n.t('cart')}</Text>
                    <View style={styles.directionRow}>
                        <View>

                        </View>
                        <Button onPress={() => this.props.navigation.goBack()} transparent  style={styles.headerBtn}>
                            <Image source={require('../../assets/images/arrow_left.png')} style={[styles.headerMenu , styles.transform]} resizeMode={'contain'} />
                        </Button>
                    </View>
                </Header>
                <NavigationEvents onWillFocus={() => this.onFocus()} />


                <Content contentContainerStyle={styles.flexGrow} style={{}} >
                    {  this.renderLoaders() }
                    {  this.renderLoader() }
                    <View style={[styles.w100 , styles.mt15]}>
                        <View style={[styles.notiBlock , {padding:7}]}>
                            <Image source={{uri : this.state.data.familyProfile}} resizeMode={'cover'} style={styles.restImg}/>
                            <View style={[styles.directionColumn , {flex:1}]}>
                                <View style={[styles.directionRowSpace ]}>
                                    <Text style={[styles.boldGrayText ]}>{ this.state.data.familyName}</Text>
                                </View>
                                <View style={[styles.locationView]}>
                                    <Image source={require('../../assets/images/maps.png')} style={[styles.locationImg]} resizeMode={'contain'} />
                                    <Text style={[styles.grayText , {fontSize:12, writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr'} ]}>{ this.state.data.distance}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.backTitle}>
                            <Text style={[styles.yellowText , styles.asfs , {fontSize:15}]}>{i18n.t('products')}</Text>
                        </View>
                        <SwipeListView
                            useFlatList ={true}
                            data        ={this.state.products}
                            renderItem  ={ (rowData, rowMap) => (

                                    <TouchableHighlight onPress={ () => {} }  style={{ borderWidth: .5 , borderColor: '#DDD'}}>
                                        <View   style={{width:'100%', backgroundColor:'#fff' , flexDirection:'row' , alignItems:'center' , justifyContent:'center'}}>

                                            <View style={[ styles.overHidden , {flexBasis : '45%' , borderWidth: .5 , borderColor: '#DDD' , flexDirection:'row', alignItems : 'center', justifyContent : 'space-between', height : 50, lineHeight : 50,} ]}>
                                                <Text style={{textAlign: 'center', fontFamily : 'cairoBold' , color: COLORS.gray, fontSize : 12, width : 70}} numberOfLines={1} ellipsizeMode='tail'> {rowData.item.ProductName} </Text>
                                                <TouchableOpacity
                                                    style={{  paddingHorizontal : 10}}
                                                    onPress={()=> this.toggleModalInfo({ addition : rowData.item.addition }, { productType : rowData.item.productTypeDes})}
                                                >
                                                    <Text style={{textAlign: 'center',fontFamily : 'cairoBold' , color: COLORS.yellow, fontSize : 11}}>
                                                         ( {i18n.t('details')} )
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>

                                            <View style={{flexBasis : '30%', height : 50, lineHeight : 50 , borderWidth: .5 , borderColor: '#DDD' , flexDirection:'row' , alignItems:'center' , justifyContent:'center'}}>
                                               <TouchableOpacity onPress={()=> this.editProduct(rowData.item ,rowData.item.orderCounter,'plus')}>
                                                  <Icon name="circle-with-plus" type="Entypo" style={{color : COLORS.yellow, fontSize : 16}}></Icon>
                                               </TouchableOpacity>
                                                <Text style={{marginHorizontal: 10, fontFamily : 'cairoBold'}}>{ rowData.item.orderCounter }</Text>
                                                <TouchableOpacity onPress={()=> this.editProduct(rowData.item,rowData.item.orderCounter,'minus')}>
                                                 <Icon name="circle-with-minus" type="Entypo" style={{color : COLORS.gray, fontSize : 16}}></Icon>
                                                </TouchableOpacity>
                                            </View>

                                            <View style={{flexBasis : '25%', height : 50 , borderWidth: .5 , borderColor: '#DDD', lineHeight : 50}}>
                                                <Text  style={{textAlign: 'center' , fontFamily : 'cairoBold' , color: COLORS.yellow, fontSize : 12, lineHeight : 50}}>  {rowData.item.price} </Text>
                                            </View>
                                        </View>
                                    </TouchableHighlight>

                                )}

                            renderHiddenItem={ (rowData, rowMap) => (
                                <View style={{}}>
                                    <TouchableOpacity onPress={()=> this.deleteOrder(rowData.item.order_id)} style={{backgroundColor:'#F00'}} >
                                        <Icon name="delete-sweep" type="MaterialIcons" style={{color : '#fff',lineHeight : 50 , textAlign:'right'}}></Icon>
                                    </TouchableOpacity>
                                </View>
                            )}
                              leftOpenValue           = { 75 }
                              disableLeftSwipe        = { true }
                              previewOpenDelay        = { 3000 }
                        />
                    </View>

                    <TouchableOpacity onPress={()=> this._toggleModal()} style={{width : '100%' ,justifyContent:'center' , alignItems:'center' ,flexDirection:'row' , backgroundColor : COLORS.black  , marginVertical  : 12}}>
                        <Image style={{width : 25 , height : 25 , padding : 10}} source={ require('../../assets/images/percentage.png') }/>
                            <View style={{marginHorizontal : 10}}/>
                        <Text style={{fontFamily : 'cairoBold' , color : '#fff', padding : 10}}>{i18n.t('add_copon')} </Text>
                    </TouchableOpacity>


                    <View style={{width : '100%' ,justifyContent:'space-between' , alignItems:'center' ,flexDirection:'row'    , marginVertical  : 3 , borderWidth : .5 , borderColor : COLORS.gray}}>
                        <Text style={{fontFamily : 'cairoBold' , color : COLORS.gray, padding : 10}}>{i18n.t('plus')} </Text>
                        <Text style={{fontFamily : 'cairoBold' , color : COLORS.yellow, padding : 10}}> {this.state.total} </Text>
                    </View>

                    <View style={{width : '100%' ,justifyContent:'space-between' , alignItems:'center' ,flexDirection:'row'    , marginVertical  : 3 , borderWidth : .5 , borderColor : COLORS.gray}}>
                        <Text style={{fontFamily : 'cairoBold' , color : COLORS.gray, padding : 10}}>{i18n.t('deliveryPrice')}</Text>
                        <Text style={{fontFamily : 'cairoBold' , color : COLORS.yellow, padding : 10}}> {this.state.DeliveryPrice} </Text>
                    </View>

                    <View style={{width : '100%' ,justifyContent:'space-between', backgroundColor: (this.state.priveCode !== '' ? '#f00' : COLORS.yellow)  , alignItems:'center' ,flexDirection:'row', marginVertical  : 3 , borderWidth : .5 , borderColor : (this.state.priveCode !== '' ? '#f00' : COLORS.gray)}}>
                        <Text style={{fontFamily : 'cairoBold' , color : '#fff', padding : 10}}>
                            {/*{i18n.t('total')}*/}
                            {/*{i18n.t('counp')}*/}
                            {(this.state.checkCode !== false ? i18n.t('counp') : i18n.t('total'))}
                        </Text>
                        <Text style={{fontFamily : 'cairoBold' , color : '#fff', padding : 10}}>
                            { this.state.totalPrice }
                        </Text>
                    </View>

                    {
                        (this.state.priveCode !== '' && this.state.checkCode !== true) ?
                            <View style={{width : '100%' ,justifyContent:'space-between', backgroundColor: COLORS.black , alignItems:'center' ,flexDirection:'row', marginVertical  : 3 , borderWidth : .5 , borderColor : COLORS.black}}>
                                <Text style={{fontFamily : 'cairoBold' , color : '#fff', padding : 10}}>{i18n.t('counp')} </Text>
                                <Text style={{fontFamily : 'cairoBold' , color : '#fff', padding : 10}}> {this.state.priveCode} </Text>
                            </View>
                            :
                            <View/>
                    }

                    {
                        (this.state.checkCode !== true && this.state.percentStatus !== false) ?
                            <View style={{width : '100%' ,justifyContent:'space-between', backgroundColor: COLORS.black , alignItems:'center' ,flexDirection:'row', marginVertical  : 3 , borderWidth : .5 , borderColor : COLORS.black}}>
                                <Text style={{fontFamily : 'cairoBold' , color : '#fff', padding : 10}}>{i18n.t('prices')} </Text>
                                <Text style={{fontFamily : 'cairoBold' , color : '#fff', padding : 10}}> {this.state.totalPercent} </Text>
                            </View>
                            :
                            <View/>
                    }

                    {this.renderSubmit()}

                </Content>


                <Modal onBackdropPress={()=> this.setState({ isModalVisible : false })} isVisible={this.state.isModalVisible}>
                    <View style={styles.modalStyle}>
                        <View style={styles.modalHead}>
                            <Text style={[styles.whiteText , {fontSize:15}]}>{ i18n.t('check_co') }</Text>
                        </View>
                        <Form style={{ width: '100%' , padding:20}}>

                            {
                                (this.state.percentStatus !== false) ?
                                    <Text style={{ fontFamily: I18nManager.isRTL ? 'cairo' : 'openSans' , fontSize : 14, marginVertical : 10, textAlign : 'center', color : '#F00' }}>
                                        {i18n.t('chick')}
                                    </Text>
                                    :
                                    <View/>
                            }

                            <Item style={styles.loginItem} bordered>
                                <Label style={[styles.label ]}>{ i18n.t('code_co') }</Label>
                                <Input
                                    value={this.state.copun}
                                    placeholder={i18n.t('code_co')}
                                    placeholderTextColor={COLORS.placeholderColor}
                                    autoCapitalize='none'
                                    onChangeText={(copun) => this.setState({copun})}
                                    secureTextEntry={this.state.showOldPass === true ? true : false}
                                    style={[styles.input  ,{borderTopRightRadius:25,paddingRight:40}]}
                                />
                            </Item>

                            <Text style={{ fontFamily: I18nManager.isRTL ? 'cairo' : 'openSans' , fontSize : 14, marginVertical : 10, textAlign : 'center', color : '#F00' }}>
                                { this.state.textErr }
                            </Text>

                            {
                                  this.renderSubmitButton()

                            }
                        </Form>
                    </View>
                </Modal>

                <Modal onBackdropPress={()=> this.setState({ isModalInfo : false })} isVisible={this.state.isModalInfo}>
                    <View style={[styles.modalStyle, {justifyContent:'flex-end'}]}>
                        <View style={styles.modalHead}>
                            <Text style={[styles.whiteText , {fontSize:15}]}>{ i18n.t('details') }</Text>
                        </View>
                        <View style={[ styles.overHidden, styles.Width_100, styles.paddingHorizontal_10, styles.paddingVertical_10 ]}>
                            <View srtyle={[ styles.marginVertical_10, styles.rowRight,  ]}>
                                <Text style={[styles.text_black, { fontFamily : 'cairoBold'} ]}>{ i18n.t('orer') }</Text>
                                {
                                    (this.state.additionArr.length !== 0) ?
                                    (this.state.additionArr.map((addition)=> {
                                        return (
                                            <Text style={[styles.text_gray, { fontFamily : 'cairoBold'}]}>
                                                {addition}
                                            </Text>
                                        );
                                    }))
                                    :
                                    <Text style={{ fontFamily : 'cairoBold', color : "#F00", marginVertical : 10}}>
                                        { i18n.t('noorer') }
                                    </Text>

                                }

                            </View>
                            <View srtyle={[ styles.marginVertical_10, styles.rowRight ]}>
                                <Text style={[styles.text_black, { fontFamily : 'cairoBold'} ]}>{ i18n.t('size') }</Text>
                                <Text style={[styles.text_gray, { fontFamily : 'cairoBold'}]}>
                                    {this.state.productTypeDes}
                                </Text>
                            </View>
                        </View>
                    </View>
                </Modal>

            </Container>
        );
    }
}





const mapStateToProps = ({ auth,profile, lang  }) => {

    return {
        auth       : auth.user,
        lang       : lang.lang,
        user       : profile.user,
    };
};

export default connect(mapStateToProps, { userLogin , profile})(OrderNow_client);




