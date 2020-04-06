import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, Dimensions, ImageBackground, I18nManager , KeyboardAvoidingView} from "react-native";
import {Container, Content, Item, Input, Label, Form, Icon, Toast} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import COLORS from '../../src/consts/colors'
import {connect}         from "react-redux";
import {profile, userLogin} from "../actions";
import {DoubleBounce} from "react-native-loader";
import axios from "axios";
import CONST from "../consts/colors";



class AccActivation_client extends Component {
    constructor(props){
        super(props);

        this.state={
            activitionCode: '',
            isLoaded: false,
        }

        alert(this.props.navigation.state.params.activitionCode)
    }

    validate = () => {
        let isError = false;
        let msg = '';

        if (  this.state.activitionCode === '' ) {
            isError = true;
            msg = i18n.t('code_validation');
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
             <TouchableOpacity onPress={ () => this.onSend()} style={[styles.yellowBtn , styles.mt15, styles.mb10]}>
              <Text style={styles.whiteText}>{ i18n.t('confirm') }</Text>
             </TouchableOpacity>
        );
    }


    onSend() {
        const err = this.validate();
        if (!err){
            this.setState({ isLoaded: true });
            axios({
                method     : 'post',
                url        :  CONST.url + 'activeAccount',
                data       :  {
                    activitionCode   : this.state.activitionCode,
                },
                headers    : {
                    lang             :   ( this.props.lang ) ?  this.props.lang : 'ar',
                    user_id          :   this.props.navigation.state.params.user_id,
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
                    Toast.show({ text: response.data.message, duration : 2000 ,
                        type :"success",
                        textStyle: {
                            color: "white",fontFamily : 'cairoBold' ,textAlign:'center'
                        } });
                    this.props.navigation.navigate('user');
                }

            }).catch(error => {

            }).then(()=>{
                this.setState({ isLoaded: false });
            });
        }
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
                            <Text style={[styles.yellowText , styles.mb15]}>{ i18n.t('activateAcc') }</Text>
                            <Text style={[styles.grayText , styles.tAC]}></Text>

                            <KeyboardAvoidingView behavior={'padding'} style={styles.keyboardAvoid}>
                                <Form style={{ width: '100%' , marginTop:30}}>


                                     <Input placeholder={i18n.t('enteractivitionCode')} placeholderTextColor={COLORS.placeholderColor}  onChangeText={(activitionCode) => this.setState({activitionCode})} keyboardType={'number-pad'} style={styles.input}  />



                                    {
                                        this.renderSubmit()
                                    }



                                </Form>
                            </KeyboardAvoidingView>
                        </View>
                    </ImageBackground>
                </Content>
            </Container>

        );
    }
}

const mapStateToProps = ({ auth,profile, lang  }) => {

    return {
        auth     : auth.user,
        lang     : lang.lang,
    };
};

export default connect(mapStateToProps, { userLogin , profile})(AccActivation_client);




