import React, { Component } from "react";
import {View, Text, Image, Share} from "react-native";
import {Container, Content, Toast} from 'native-base';
import {DrawerItems, NavigationEvents} from 'react-navigation';
import styles from "../../assets/styles";
import {connect}         from "react-redux";
import { userLogin, profile ,logout ,tempAuth} from '../actions'
import axios from "axios";
import CONST from "../consts/colors";
import i18n from '../../locale/i18n'
// import * as Updates from "expo/build/Updates/Updates";
import { Util , Updates} from 'expo';

class DrawerCustomization_client extends Component {
    constructor(props){
        super(props);
        this.state={
            user         : [],
            name         : i18n.t('guest'),
            imageProfile : 'https://cross.4hoste.com:30011/images/defaultUser.jpg',
            items        : this.props.items,
            props        : this.props,
        }
    }

    componentWillMount() {
        // if(this.props.auth){
        //     this.props.profile({
        //         user_id     :this.props.auth.data.user_id,
        //         lang        : this.props.lang
        //     });
        // }
    }
    logout(){
        this.props.navigation.navigate('user');
        if(this.props.user)
        {
            axios({
                method               : 'post',
                url                  :  CONST.url + 'LogOut',
                data                 :  {
                    device_ID        : '000'
                },
                headers              : {
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


                    // setTimeout(()=>{
                        this.props.logout({ token: this.props.user ? this.props.user.user_id  :null});
                        this.props.tempAuth();
                        // setTimeout(()=>{
                        //     this.props.navigation.navigate('Initial');
                        // },2500);
                        //Updates.reload();
                    // },1000)
                }

            }).catch(error => {

            }).then(()=>{
                this.setState({ isLoaded: false });
            });
        }else{
            this.props.navigation.navigate('user');
        }

    }

    onShare = async () => {
        try {
            const result = await Share.share({
                message:'http://s.ll.sa/deem',
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                } else {
                }
            } else if (result.action === Share.dismissedAction) {
            }
        } catch (error) {}
    };
    onFocus(){
        this.setState({
            items        : this.props.items,
            props        : this.props,
        })

        setTimeout(()=> {
            this.componentWillMount()
        }, 2000)
    }
    render() {
        return (
            <Container>
                <NavigationEvents onWillFocus={() => this.onFocus()} />
                <Content style={{backgroundColor:'#fff'}}>
                    <View style={styles.sideView}>
                         <Image source={require('../../assets/images/bgsidemenu.png')} resizeMode={'cover'} style={styles.bgSideMenu}/>
                         <View style={styles.sideImgView}>
                             <View style={styles.sideProfileImg}>
                                 <Image source={{uri : (this.props.user) ? this.props.user.imageProfile :'https://cross.4hoste.com:30011/images/defaultUser.jpg' }} resizeMode={'cover'} style={[  {		width:60,
                                     height:60 ,
                                     borderRadius:30,
                                     borderWidth: 4,
                                     borderColor:'#5d5d5d26'}]}/>
                             </View>
                             <Text style={styles.sideName}>{ ( this.props.user) ?  this.props.user.userName :  i18n.t('guest')}</Text>
                         </View>
                    </View>
                            <DrawerItems {...this.state.props}
                                         onItemPress={
                                             (route, focused) => {
                                                 if (route.route.key === 'logout_client') {
                                                     this.logout()
                                                 }else if(route.route.key === 'shareApp_client'){
                                                     this.onShare();
                                                 }else if(route.route.key === 'login'){
                                                     this.props.navigation.navigate('user');
                                                 }else {
                                                     this.props.navigation.navigate(route.route.key)
                                                 }
                                             }
                                         }
                                         animationEnabled     = {true}
                                         activeBackgroundColor= 'transparent' inactiveBackgroundColor='transparent' activeLabelStyle={{color:'#5d5d5d'}}
                                         labelStyle           = {styles.drawerLabel} iconContainerStyle ={styles.drawerIcon}
                                         itemStyle            = {styles.drawerItemStyle} itemsContainerStyle ={{}}

                                         items={ this.state.items.filter((item) =>
                                             this.filterItems(item)
                                         ) }
                            />
                    </Content>
            </Container>
        );
    }
    filterItems(item){
        if(this.props.user){
            // alert(' -',this.state.props.auth.data.userType)
          if(this.props.user.userType === 'user'){
              return item.routeName !== 'home_delegate' && item.routeName !== 'orderDet_delegate' && item.routeName !== 'profile_delegate'
                  && item.routeName !== 'myOrders_delegate' && item.routeName !== 'followOrder_delegate'  && item.routeName !== 'Orders'  && item.routeName !== 'location_delegate'&& item.routeName !== 'login'||  item.routeName == 'wallet_client'|| item.routeName === 'logout_client'
          }else{
              return item.routeName !== 'home_client'  && item.routeName !== 'profile_client' && item.routeName !== 'myOrders_client'
                  && item.routeName !== 'specialOrders_client' && item.routeName !== 'cart_client'  && item.routeName !== 'Locations' && item.routeName !== 'login' &&  item.routeName == 'wallet_client' || item.routeName === 'logout_client'
          }
      }else{
               return item.routeName === 'home_client' || item.routeName === 'language_client' || item.routeName === 'policy_client' ||  item.routeName === 'shareApp_client' ||  item.routeName === 'login'  ;
      }
    }
}
const mapStateToProps = ({ auth,profile, lang  }) => {

    return {
        auth        : auth.user,
        lang        : lang.lang,
        user        : profile.user,

    };
};
export default connect(mapStateToProps, { userLogin , profile,tempAuth ,logout})(DrawerCustomization_client);




