import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  Platform,
  KeyboardAvoidingView,
  ToastAndroid,
  Keyboard,
} from 'react-native';
import InputWithIcon from '../../Components/InputWithIcon';
import IconButton from '../../Components/IconButton';
import { RootStackParamList } from '../../RootStackParams';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useLoginMutation } from '../../Apis/account';
import { userLogin } from '../../Redux/accountSlice';
import { useAppDispatch } from '../../Redux/hooks';
import auth from '@react-native-firebase/auth';
import * as Keychain from 'react-native-keychain';
import { baseUrl } from '../../const';
import Badge from '../../Components/Badge';

type NavProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

const Login = ({ navigation, route }: NavProps) => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState(''); //minh@bluejaypos.com
  const [password, setPassword] = useState(''); //123456

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    async function loginFromKeychain() {
      const credentials = await Keychain.getGenericPassword();
      if (credentials && credentials.username && credentials.password) {
        setEmail(credentials.username);
        setPassword(credentials.password);
        doLogin(credentials.username, credentials.password);
      } else {
        setEmail('');
        setPassword('');
      }
    }
    loginFromKeychain();
  }, [route.params?.rand]);

  const doLogin = (email: string, password: string) => {
    if (!email) {
      ToastAndroid.show('Email is required!', ToastAndroid.SHORT);
      return;
    }
    if (!password) {
      ToastAndroid.show('Password is required!', ToastAndroid.SHORT);
      return;
    }

    Keyboard.dismiss();

    login({ email, password })
      .unwrap()
      .then(response => {
        const { Message, Data, Token } = response;
        if (Message === 'Success') {
          Keychain.setGenericPassword(email, password);

          const {
            UserId,
            FirstName,
            LastName,
            roleId,
            Email,
            RestaurantName,
            RestaurantId,
            DefaultLangId,
            fbEmail,
            fbPassword,
            RestaurantTime,
            TimeZone,
            Manager
          } = Data;
          dispatch(
            //start user session.
            userLogin({
              UserId,
              FirstName,
              LastName,
              RoleId: roleId,
              Email,
              RestaurantName,
              RestaurantId,
              DefaultLangId,
              Token,
              fbEmail,
              fbPassword,
              RestaurantTime,
              TimeZone,
              Manager
            }),

            //firebase login for access Realtime Database
            firebaseLogin(fbEmail, fbPassword),
          );
        } else {
          Keychain.resetGenericPassword();
          ToastAndroid.show(Message, ToastAndroid.SHORT);
        }
      })
      .catch(err => {
        Keychain.resetGenericPassword();
        ToastAndroid.show(err, ToastAndroid.SHORT);
      });
    //
  };

  const firebaseLogin = (email: string, password: string) => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(res => {
        navigation.navigate('Home', { rand: Math.random() });
      })
      .catch(error => {
        ToastAndroid.show(
          `Firebase authentication failure for ${email}`,
          ToastAndroid.SHORT,
        );
      });
  };

  const renderHeaderLogo = () => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ paddingRight: 15 }}>
          <Image
            source={require('../../Assets/res_logo.png')}
            style={{ width: 60, height: 60 }}
          />
        </View>
        <View style={{ flexGrow: 1 }}>
          <Text style={{ fontSize: 25, color: '#333' }}>Welcome</Text>
          <Text>Sign in to continue using app</Text>
        </View>
        {baseUrl !== 'https://res.ringameal.com' && (
          <Badge text="Development" color="#f60" />
        )}
      </View>
    );
  };

  const renderForm = () => {
    return (
      <View
        style={{
          paddingTop: 20,
          marginTop: 20,
          borderTopWidth: 1,
          borderTopColor: '#888',
        }}>
        <View style={{ marginBottom: 10 }}>
          <InputWithIcon
            inputValue={email}
            placeHolder="Email address..."
            leftIcon="mail-outline"
            keyboardType="email-address"
            onChange={val => setEmail(val)}
          />
        </View>
        <View style={{ marginBottom: 10 }}>
          <InputWithIcon
            inputValue={password}
            placeHolder="Password..."
            leftIcon="key-outline"
            keyboardType="password"
            onChange={val => setPassword(val)}
          />
        </View>
        <View style={{ paddingTop: 20, paddingBottom: 10 }}>
          <IconButton
            text="LOGIN"
            leftIcon="log-in-outline"
            onPress={() => doLogin(email, password)}
            bgColor="green"
            isLoading={isLoading}
          />
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View
          style={{
            backgroundColor: '#fff',
            borderWidth: 1,
            borderColor: '#e5e5e5',
            width: '35%',
            padding: 20,
            borderRadius: 10,
          }}>
          {renderHeaderLogo()}
          {renderForm()}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;
