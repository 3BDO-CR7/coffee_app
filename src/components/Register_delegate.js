import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, Dimensions, ImageBackground, I18nManager , KeyboardAvoidingView} from "react-native";
import {Container, Content, Item, Input, Label, Form, Icon, CheckBox, Toast} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import COLORS from '../../src/consts/colors'
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import {DoubleBounce} from "react-native-loader";
import axios from "axios";
import CONST from "../consts/colors";
import * as Location from "expo-location";


const height = Dimensions.get('window').height;

class Register_delegate extends Component {
    constructor(props){
        super(props);

        this.state={
            username             : '',
            phone                : '',
            isLoaded             : false,
            password             : '',
            email                : '',
            IdNumber             : '',
            deviceID             : '123',
            plateNum             : '',
            contractImg          : '',
            contractImage        : '',
            showPass             : true,
            checkTerms           : false,
            base64               : null,
            carImg               : '',
            vehicleLicenses      : '',
            vehicleLicensesImage : '',
            carImgImage          : '',
            lat                  : '',
            long                 : '',
            location             : '',
            deviceType           : 'ios',
        }
    }


 async   componentWillMount(){
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status     !== 'granted') {
            alert(i18n.t('open_gps'));
        }else {
            const { coords : { latitude, longitude } } = await Location.getCurrentPositionAsync({});
            const userLocation                         = { latitude, longitude };
            this.setState({
                mapRegion: userLocation,
                lat      : latitude,
                long     : longitude,
                initMap  : false
            });
        }

        let getCity   = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
        getCity      += this.state.mapRegion.latitude + ',' + this.state.mapRegion.longitude;
        getCity      += '&key=AIzaSyCJTSwkdcdRpIXp2yG7DfSRKFWxKhQdYhQ&language=ar&sensor=true';

        try {
            const { data } = await axios.get(getCity);
            this.setState({ location: data.results[0].formatted_address });
        } catch (e) {
            console.log(e);
        }
    }

    validate = () => {
        let isError = false;
        let msg = '';

        if (  this.state.username === '' ) {
            isError = true;
            msg = i18n.t('name_validation');
        }else if(this.state.phone === '') {
            isError = true;
            msg = i18n.t('enterPhone');
        }else if(this.state.phone.length < 10) {
            isError = true;
            msg = i18n.t('phonelen');
        }else if(this.state.email === '') {
            msg = i18n.t('email_validation');
            isError = true;
        }else if(this.state.IdNumber === '') {
            msg = i18n.t('IdNumber_validation');
            isError = true;
        }else if(this.state.vehicleLicenses === '') {
            msg = i18n.t('vehicleLicenses_validation');
            isError = true;
        }else if(this.state.carImgImage === '') {
            msg = i18n.t('carImg_validation');
            isError = true;
        }else if(this.state.contractImg === '') {
            msg = i18n.t('requiredContractImg');
            isError = true;
        }else if(this.state.password === '') {
            isError = true;
            msg = i18n.t('enterpassword');
        }else if(this.state.password.length < 6) {
            isError = true;
            msg = i18n.t('passlen');
        }else if(this.state.checkTerms === false) {
            isError = true;
            msg = i18n.t('checkTerms_validation');
        }
        if (msg != ''){
            Toast.show({ text: msg, duration : 2000  ,type :"danger", textStyle: { color: "white",fontFamily : 'cairoBold' ,textAlign:'center' } });
        }
        return isError;
    };

    renderSubmit()
    {
        if (this.state.isLoaded){
            return(
                <View  style={{ justifyContent:'center', alignItems:'center' , marginVertical: 20}}>
                    <DoubleBounce size={25} color="#CBA876"/>
                </View>
            )
        }

        return (
             <TouchableOpacity onPress={ () => this.onSend()} style={[styles.yellowBtn , styles.mt15, styles.mb10 ]}>
                <Text style={styles.whiteText}>{ i18n.t('registerButton') }</Text>
             </TouchableOpacity>
        );
    }





    onSend() {
        const err = this.validate();
        if (!err){
            this.setState({ isLoaded: true });
            axios({
                method     : 'post',
                url        :  CONST.url + 'sign-up',
                data       :  {
                    userName              : this.state.username,
                    phoneNo               : this.state.phone,
                    password              : this.state.password,
                    email                 : this.state.email,
                    deviceID              : this.state.deviceID,
                    userType              : this.props.navigation.state.params.type,
                    deviceType            : this.state.deviceType,
                    imageLicense          : this.state.vehicleLicenses,
                    imageCar              : this.state.carImgImage,
                    cardNumber            : this.state.IdNumber,
                    carNumber             : '123456',
                    lat                   : this.state.lat,
                    long                  : this.state.long,
                    address               : this.state.location,
                    contractImg           : this.state.contractImg,
                },
                headers    : {
                    lang                  :   (this.props.lang) ? this.props.lang : 'ar',
                }
            }).then(response => {

                console.log('adel is sleeping' , response.data);

                Toast.show({ text: response.data.message, duration : 2000 ,
                    type :"danger",
                    textStyle: {
                        color: "white",fontFamily : 'cairoBold' ,textAlign:'center'
                    } });

                if(response.data.status === '0')
                {
                    Toast.show({ text: response.data.message, duration : 2000 ,
                        type :"danger",
                        textStyle: {
                            color: "white",fontFamily : 'cairoBold' ,textAlign:'center'
                        } });
                }else if(response.data.status === '2')
                {
                    Toast.show({ text: response.data.message, duration : 2000 ,
                        type :"success",
                        textStyle: {
                            color: "white",fontFamily : 'cairoBold' ,textAlign:'center'
                        } });
                    this.props.navigation.navigate('accActivation_client', {
                        type : this.props.navigation.state.params.type,
                        user_id : response.data.data.user_id,
                        activitionCode : response.data.data.activitionCode
                    });
                }else{
                    Toast.show({ text: response.data.message, duration : 2000 ,
                        type :"success",
                        textStyle: {
                            color: "white",fontFamily : 'cairoBold' ,textAlign:'center'
                        } });
                    this.props.navigation.navigate('accActivation_client', {
                        type : this.props.navigation.state.params.type,
                        user_id : response.data.data.user_id,
                        activitionCode : response.data.data.activitionCode
                    });
                }

            }).catch(error => {
                console.log(error.message)
            }).then(()=>{
                this.setState({ isLoaded: false });
            });
        }
    }


    askPermissionsAsync = async () => {
        await Permissions.askAsync(Permissions.CAMERA);
        await Permissions.askAsync(Permissions.CAMERA_ROLL);

    };

    _carImg = async () => {

        this.askPermissionsAsync();

        let result = await ImagePicker.launchImageLibraryAsync({
            aspect: [4, 3],
            base64:true,

        });

        if (!result.cancelled) {
            this.setState({ carImgImage : result.base64,userImage: result.uri ,base64:result.base64  });
        }
    };


    _enterContractImg = async () => {

        this.askPermissionsAsync();

        let result = await ImagePicker.launchImageLibraryAsync({
            aspect: [4, 3],
            base64:true,

        });

        if (!result.cancelled) {
            this.setState({ contractImg : result.base64,contractImage: result.uri ,base64:result.base64  });
        }
    };


    _vehicleLicensesImage = async () => {

        this.askPermissionsAsync();

        let result = await ImagePicker.launchImageLibraryAsync({
            aspect: [4, 3],
            base64:true,

        });


        if (!result.cancelled) {
            this.setState({vehicleLicenses : result.base64,vehicleLicensesImage : result.uri  ,base64:result.base64 });
        }
    };


    async componentDidMount(){
        await Permissions.askAsync(Permissions.CAMERA);
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
    }

    render() {
        return (
            <Container>
                <Content  contentContainerStyle={styles.flexGrow}>
                    <TouchableOpacity style={styles.authBack} onPress={() => this.props.navigation.goBack()}>
                        <Icon type={'FontAwesome'} name={'angle-right'} style={[styles.transform]} />
                    </TouchableOpacity>
                    <ImageBackground source={require('../../assets/images/bg.png')} resizeMode={'cover'} style={styles.imageBackground}>
                        <View>
                            <Image source={require('../../assets/images/headerlogin.png')} style={styles.headerbg} resizeMode={'cover'} />
                            <Image source={require('../../assets/images/logo.png')} style={styles.headerLogo} resizeMode={'contain'} />
                        </View>
                        <View style={styles.authMainView}>
                            <Text style={[styles.yellowText , styles.mb15]}>{ i18n.t('registerButton') }</Text>

                                <Form style={{ width: '100%' , marginTop:30}}>

                                    {/*<KeyboardAvoidingView behavior={'padding'} style={styles.keyboardAvoid}>*/}
                                    <Item style={styles.loginItem} bordered>
                                        <Label style={[styles.label ]}>{ i18n.t('delegateName') }</Label>
                                        <Input placeholder={i18n.t('enterUsername')} placeholderTextColor={COLORS.placeholderColor} onChangeText={(username) => this.setState({username})} autoCapitalize='none' style={styles.input}  />
                                    </Item>

                                    <Item style={styles.loginItem} bordered>
                                        <Label style={[styles.label ]}>{ i18n.t('phoneNumber') }</Label>
                                        <Input placeholder={ i18n.t('enterPhone') } placeholderTextColor={COLORS.placeholderColor} onChangeText={(phone) => this.setState({phone})} keyboardType={'number-pad'} style={styles.input}  />
                                    </Item>

                                    <Item style={styles.loginItem} bordered>
                                        <Label style={[styles.label ]}>{ i18n.t('email') }</Label>
                                        <Input placeholder={ i18n.t('enterMail') } placeholderTextColor={COLORS.placeholderColor} onChangeText={(email) => this.setState({email})} keyboardType={'email-address'} style={styles.input}  />
                                    </Item>

                                    <Item style={styles.loginItem} bordered>
                                        <Label style={[styles.label ]}>{ i18n.t('idNum') }</Label>
                                        <Input placeholder={ i18n.t('enterId') } placeholderTextColor={COLORS.placeholderColor} onChangeText={(IdNumber) => this.setState({IdNumber})} keyboardType={'number-pad'} style={styles.input}  />
                                    </Item>

                                    <TouchableOpacity style={styles.loginItem} onPress={this._vehicleLicensesImage}>
                                        <Label style={[styles.label ]}>{ i18n.t('licenseImg') }</Label>
                                        <Input placeholder={ i18n.t('enterLicense') } placeholderTextColor={COLORS.placeholderColor} utoCapitalize='none' disabled value={this.state.vehicleLicensesImage} style={[styles.input , {paddingRight:40}]}  />

                                        <View style={styles.cameraView} onPress={() => this.setState({showPass: !this.state.showPass})}>
                                            <Icon type={'FontAwesome'} name={'camera'} style={[styles.cameraIcon]} />
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.loginItem} onPress={this._carImg}>
                                        <Label style={[styles.label ]}>{ i18n.t('carImg') }</Label>
                                        <Input placeholder={i18n.t('enterCarImg')} placeholderTextColor={COLORS.placeholderColor} utoCapitalize='none' disabled value={this.state.userImage} style={[styles.input , {paddingRight:40}]}/>

                                        <View style={styles.cameraView} onPress={() => this.setState({showPass: !this.state.showPass})}>
                                            <Icon type={'FontAwesome'} name={'camera'} style={[styles.cameraIcon]} />
                                        </View>
                                    </TouchableOpacity>


                                    <TouchableOpacity style={styles.loginItem} onPress={this._enterContractImg}>
                                        <Label style={[styles.label ]}>{ i18n.t('contract') }</Label>
                                        <Input placeholder={i18n.t('enterContractImg')} placeholderTextColor={COLORS.placeholderColor} utoCapitalize='none' disabled value={this.state.contractImage} style={[styles.input , {paddingRight:40}]}/>

                                        <View style={styles.cameraView} onPress={() => this.setState({showPass: !this.state.showPass})}>
                                            <Icon type={'FontAwesome'} name={'camera'} style={[styles.cameraIcon]} />
                                        </View>
                                    </TouchableOpacity>

                                    {/*<Item style={styles.loginItem} bordered>*/}
                                        {/*<Label style={[styles.label ]}>{ i18n.t('carNum') }</Label>*/}
                                        {/*<Input placeholder={i18n.t('enterCarNum')} placeholderTextColor={COLORS.placeholderColor} onChangeText={(plateNum) => this.setState({plateNum})} keyboardType={'number-pad'} style={styles.input}  />*/}
                                    {/*</Item>*/}

                                    <Item style={styles.loginItem} bordered>
                                        <Label style={[styles.label ]}>{ i18n.t('password') }</Label>
                                        <Input placeholder={i18n.t('enterPass')} placeholderTextColor={COLORS.placeholderColor} autoCapitalize='none' onChangeText={(password) => this.setState({password})} secureTextEntry={this.state.showPass === true ? true : false} style={[styles.input , {paddingRight:40}]}  />

                                        <TouchableOpacity style={styles.eye} onPress={() => this.setState({showPass: !this.state.showPass})}>
                                            <Icon type={'FontAwesome'} name={ this.state.showPass === true ? 'eye' : 'eye-slash'} style={[styles.eyeIcon]} />
                                        </TouchableOpacity>
                                    </Item>

                                    <View style={[styles.directionRow , styles.mb15]}>
                                        <CheckBox onPress={() => this.setState({checkTerms: !this.state.checkTerms})} checked={this.state.checkTerms} color={COLORS.black} style={styles.checkBox} />
                                        <TouchableOpacity  onPress={()=>{this.props.navigation.navigate('policy_delegate')}}>
                                            <Text style={[styles.grayText , {fontSize:12} ]}> { i18n.t('byRegister') } <Text  style={styles.termText}>{ i18n.t('terms') }</Text></Text>
                                        </TouchableOpacity>
                                    </View>

                                    {this.renderSubmit()}

                                    <TouchableOpacity onPress={ () => this.props.navigation.navigate('login_delegate')} style={[styles.forgetPass , styles.mb100]}>
                                        <Text style={[styles.grayText , {fontSize:14} ]}>{ i18n.t('haveAcc') } </Text>
                                        <Text style={[styles.grayText , {fontSize:14 , color:COLORS.black} ]}>{ i18n.t('clickHere') }</Text>
                                    </TouchableOpacity>

                                    {/*</KeyboardAvoidingView>*/}

                                </Form>
                        </View>
                    </ImageBackground>
                </Content>
            </Container>

        );
    }
}

export default Register_delegate;
