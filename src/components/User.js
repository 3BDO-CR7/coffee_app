import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, ImageBackground,I18nManager,BackHandler,Alert} from "react-native";
import {Container, Content} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import {Notifications} from "expo";
class User extends Component {
    constructor(props){
        I18nManager.forceRTL(true);
        super(props);
        this.state ={};
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
    render() {
        return (
            <Container>
                <Content  contentContainerStyle={styles.flexGrow} >
                   <ImageBackground source={require('../../assets/images/bg.png')} resizeMode={'cover'} style={styles.imageBackground}>
                        <View>
                            <Image source={require('../../assets/images/headerlogin.png')} style={styles.headerbg} resizeMode={'cover'} />
                            <Image source={require('../../assets/images/logo.png')} style={styles.headerLogo} resizeMode={'contain'} />
                        </View>
                       <View style={styles.authMainView}>
                            <Text style={[styles.yellowText , styles.mb15]}>{ i18n.t('register') }</Text>
                            <Text style={[styles.grayText , styles.tAC]}></Text>

                            <TouchableOpacity onPress={ () => this.props.navigation.navigate('login_client', {
                                type : 'user'
                            })} style={[styles.yellowBtn , styles.mt50 , styles.mb10]}>
                                <Text style={styles.whiteText}>{ i18n.t('asUser') }</Text>
                            </TouchableOpacity>


                            <TouchableOpacity onPress={ () => this.props.navigation.navigate('login_client' , {
                                type : 'delegate'
                            })} style={styles.redBtn}>
                                <Text style={styles.whiteText}>{ i18n.t('asDelegate') }</Text>
                            </TouchableOpacity>
                       </View>
                   </ImageBackground>
                </Content>
            </Container>

        );
    }
}

export default User;