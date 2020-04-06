import React from 'react';
import { I18nManager ,Platform , Text} from 'react-native';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import {AppLoading, Notifications} from 'expo';
import AppNavigator from './src/routes';
import { Root } from "native-base";
import {PersistGate} from "redux-persist/integration/react";
import { Provider } from 'react-redux';
import { store, persistedStore } from './src/store';
import './ReactotronConfig'
import * as Permissions from 'expo-permissions';
import { NavigationActions } from 'react-navigation';
import I18n from "ex-react-native-i18n";

export default class App extends React.Component {

  constructor(props) {
    super(props);
      I18n.locale = 'ar';
      this.state = {
      isReady: false,
    };

    I18nManager.forceRTL(true)
  }



  async componentDidMount() {
      if (Text.defaultProps == null) Text.defaultProps = {};
      Text.defaultProps.allowFontScaling = false;

      if (Platform.OS === 'android') {
          Notifications.createChannelAndroidAsync('notification-sound', {
              name: 'notification sound',
              sound: true,
          });
      }
    await Font.loadAsync({
      cairo             : require('./assets/fonts/Cairo-Regular.ttf'),
      cairoBold         : require('./assets/fonts/Cairo-Bold.ttf'),
      openSansBold      : require('./assets/fonts/OpenSans-Bold.ttf'),
      openSans          : require('./assets/fonts/OpenSans-Regular.ttf'),
      Roboto            : require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium     : require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    });
    this.setState({ isReady: true });
    I18n.locale = 'ar';
    console.log('lang', I18n.locale)

  }

  render() {
    if (!this.state.isReady) {
      return <AppLoading />;
    }

    return (



        <Provider store={store} UNSAFE_readLatestStoreStateOnFirstRender={true}>
          <PersistGate persistor={persistedStore}>
          <Root>
             <AppNavigator />
          </Root>
        </PersistGate>
        </Provider>
    );
  }
}

