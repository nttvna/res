import {TextInput, StyleSheet, Text, ToastAndroid, View} from 'react-native';
import {RootStackParamList} from '../../RootStackParams';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Layout from '../../Layout';
import LoadingComponent from '../../Components/Loading';
import {useEffect, useRef, useState} from 'react';
import React from 'react';
import {baseUrl} from '../../const';
import {WebView} from 'react-native-webview';
import HeaderGoBack from '../../Components/HeaderGoBack';
import {
  useGetRestaurantInfoQuery,
  useUpdateRestaurantMutation,
} from '../../Apis/restaurant';
import IconButton from '../../Components/IconButton';
import {updateRestaurantName} from '../../Redux/accountSlice';
import {useAppDispatch} from '../../Redux/hooks';

type NavProps = NativeStackScreenProps<RootStackParamList, 'Restaurant'>;

const Restaurant = ({route, navigation}: NavProps) => {
  const dispatch = useAppDispatch();
  const webViewRef = useRef<WebView>(null);
  const [gToken, setGToken] = useState<string>('');
  const [refreshCount, setRefreshCount] = useState(0);

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [fax, setFax] = useState<string>('');

  const {data, isLoading} = useGetRestaurantInfoQuery();
  const [updateRestaurant, {isLoading: isUpdating}] =
    useUpdateRestaurantMutation();

  useEffect(() => {
    if (data && data.Data) {
      const {Name, Email, Phone, Fax} = data.Data;
      setName(Name);
      setEmail(Email);
      setPhone(Phone);
      setFax(Fax);
    }
  }, [data]);

  const handleWebViewMessage = (event: {nativeEvent: {data: any}}) => {
    const {data} = event.nativeEvent;
    try {
      const token = JSON.parse(data).token;
      setGToken(token);
      // Use the token as needed in your app logic
    } catch (error: any) {
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    }
  };

  const doRestaurant = () => {
    updateRestaurant({
      Name: name,
      Email: email,
      Phone: phone,
      Fax: fax,
      GoogleToken: gToken,
    })
      .unwrap()
      .then(respone => {
        const {Message} = respone;
        if (Message === 'Success') {
          //update redux
          dispatch(updateRestaurantName({RestaurantName: name}));

          ToastAndroid.show('Update info successfully.', ToastAndroid.SHORT);
          navigation.navigate('Home', {rand: Math.random()});
        } else {
          ToastAndroid.show(Message, ToastAndroid.SHORT);
        }
      })
      .finally(() => {
        setRefreshCount(Math.random());
      });
  };

  const renderForm = () => {
    return (
      <>
        <View style={s.wr}>
          <View style={s.wrLeft}>
            <Text>Name:</Text>
          </View>
          <View style={s.wrRight}>
            <TextInput
              onChangeText={val => setName(val)}
              value={name}
              style={s.inputStyle}
            />
          </View>
        </View>

        <View style={s.wr}>
          <View style={s.wrLeft}>
            <Text>Email:</Text>
          </View>
          <View style={s.wrRight}>
            <TextInput
              onChangeText={val => setEmail(val)}
              value={email}
              keyboardType="email-address"
              style={s.inputStyle}
            />
          </View>
        </View>
        <View style={s.wr}>
          <View style={s.wrLeft}>
            <Text>Phone:</Text>
          </View>
          <View style={s.wrRight}>
            <TextInput
              onChangeText={val => setPhone(val)}
              value={phone}
              keyboardType="phone-pad"
              style={s.inputStyle}
            />
          </View>
        </View>
        <View style={s.wr}>
          <View style={s.wrLeft}>
            <Text>Fax:</Text>
          </View>
          <View style={s.wrRight}>
            <TextInput
              onChangeText={val => setFax(val)}
              value={fax}
              keyboardType="phone-pad"
              style={s.inputStyle}
            />
          </View>
        </View>
        <View
          style={[
            s.wr,
            {
              flexGrow: 1,
              alignItems: 'flex-end',
              borderBottomWidth: 0,
            },
          ]}>
          <View style={s.wrLeft} />
          <View
            style={[
              s.wrRight,
              {
                flexDirection: 'row',
                justifyContent: 'flex-end',
              },
            ]}>
            <IconButton
              text="SAVE"
              leftIcon="print-outline"
              onPress={doRestaurant}
              bgColor="#06b6d4"
              isLoading={isUpdating}
            />
          </View>
        </View>
      </>
    );
  };

  return (
    <Layout screenName="Home">
      <HeaderGoBack name="Restaurant" showBackButton={true} />
      <View
        style={{
          padding: 15,
          paddingTop: 0,
          flexDirection: 'row',
          flex: 1,
        }}>
        <View
          style={{
            flexGrow: 1,
            backgroundColor: '#fff',
            padding: 10,
            paddingLeft: 20,
            paddingRight: 20,
            borderRadius: 5,
            borderColor: '#e5e5e5',
            borderWidth: 1,
          }}>
          {isLoading ? <LoadingComponent isHorizontal={false} /> : renderForm()}
        </View>
      </View>
      {/* Refresh google captcha token */}
      <View style={{display: 'none'}}>
        <WebView
          ref={webViewRef}
          key={refreshCount}
          source={{uri: `${baseUrl}/ReCaptcha.aspx`}}
          onMessage={handleWebViewMessage}
        />
      </View>
      {/* Refresh google captcha token */}
    </Layout>
  );
};

export default Restaurant;

const s = StyleSheet.create({
  wr: {
    flexDirection: 'row',
    borderBottomColor: '#f8f8f8',
    borderBottomWidth: 1,
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
  wrLeft: {
    width: 150,
  },
  wrRight: {
    flexGrow: 1,
  },
  inputStyle: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 5,
    paddingLeft: 10,
  },
});
