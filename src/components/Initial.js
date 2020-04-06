import React, { Component } from 'react';
import {AsyncStorage, I18nManager , StyleSheet} from 'react-native';

import {connect} from "react-redux";
import {profile,chooseLang} from "../actions";
import I18n from "ex-react-native-i18n";


class Init extends Component {

    constructor(props) {
        super(props);
        I18nManager.forceRTL(true)
    }

    async componentWillMount() {
                if(this.props.lang === null)
                {
                    this.props.chooseLang('ar');
                    this.props.navigation.navigate('user')
                }else{
                    if(this.props.auth) {
                        if(this.props.auth.status === '0'){
                            this.props.navigation.navigate('user')
                        }else if(this.props.auth.data.userType === 'user'){
                            this.props.navigation.navigate('drawerNavigator_client')
                        }else{
                            this.props.navigation.navigate('drawerNavigator_delegate')
                        }
                    }else{
                        this.props.navigation.navigate('user')
                    }

                }

                AsyncStorage.getItem('init').then(init => {
                    if (init != 'true'){
                        AsyncStorage.setItem('init', 'true');
                        this.props.chooseLang('ar');
                    }

                });


    }



    render() {
        return false;
    }
}

const styles = StyleSheet.create({
    header : {
        backgroundColor       : "transparent",
        justifyContent        : 'space-between',
        flexDirection         : 'row',
        paddingTop            : 25,
        paddingRight          : 5,
        paddingLeft           : 5,
        borderWidth           : 1,
        borderColor           : "#ECECEC",
        height : 85
    },
    text : {
        fontFamily            : 'CairoRegular',
        color                 : '#444',
        marginTop             : 7,
        fontSize              : 15,
        marginLeft            : 15
    },
    icons : {
        fontSize              : 20,
        color                 : "#2977B3"
    },
    logo : {
        width                 : 150,
        height                : 150,
        alignItems            : 'center',
        justifyContent        : 'center',
        alignSelf             : 'center',
        margin                : 40,
        borderRadius :65,
    },
    texter : {
        fontFamily            : 'CairoRegular',
        textAlign             : 'center',
        margin                : 15
    },
    headerTitle:{
        color                 : '#444',
        fontFamily            : 'CairoRegular',
    }
});

const mapStateToProps = ({ auth, lang ,profile}) => {

    return {

        auth   : auth.user,
        lang   : lang.lang,
        user   : profile.user,
    };
};
export default connect(mapStateToProps,{profile,chooseLang})(Init);



